'use client';

import StatCard from '@/components/shared/stat-card';
import { useAuthContext } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { fadeInUp, opacityUp } from '@/lib/animation-template';
import { cn } from '@/lib/utils';
import {
  GetAllTransactionForActionResponse,
  GetEventTransactionSummaryResponse,
} from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Hourglass, NotepadText, ShieldBan, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { notFound, useParams } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';
import { columns, DataColumnType } from './columns';
import { DataTable } from './data-table';

export default function TransactionPage() {
  const { eventId } = useParams();
  const maxw450 = useMediaQuery('(max-width: 450px)');
  const { apiclient, status } = useAuthContext();

  if (Array.isArray(eventId)) {
    return notFound();
  }

  const { data, isError, error, isPending } = useQuery({
    queryKey: ['event-detail', 'event-detail-transaction', eventId],
    queryFn: async () => {
      const [transactionsfetch, summaryfetch] = await Promise.all([
        await apiclient.get(`/transactions/eid/${eventId}/action`),
        await apiclient.get(`/transactions/eid/${eventId}/summary`),
      ]);

      return {
        transactions: transactionsfetch.data
          .transactions as GetAllTransactionForActionResponse['transactions'],
        summary: summaryfetch.data
          .summary as GetEventTransactionSummaryResponse['summary'],
      };
    },
    enabled: status !== 'pending',
  });

  if (isPending) {
    return (
      <div className="p-8 text-center">
        <div className="text-base text-muted-foreground">
          🤔 Preparing your data...
        </div>
      </div>
    );
  }

  if (isError && error instanceof AxiosError) {
    if (error.status === 404) {
      return notFound();
    } else {
      toast({
        title: 'Failed to Load Data',
        description:
          'Sorry we have problem in our server. Please try again later!',
        variant: 'destructive',
      });
      return null;
    }
  }

  if (!isPending && !data) return null;

  const { transactions, summary } = data;

  const datacolumn: DataColumnType[] = transactions.map((tr) => ({
    transactionId: tr.id,
    name: tr.buyer.name,
    email: tr.buyer.email,
    payment: tr.priceAfterDiscount,
    paymentDetail: {
      proof: tr.paymentProof,
      tickets: tr.tickets,
      totalPrice: tr.priceAfterDiscount,
      totalTicketQuantity: tr.totalTicketQuantity,
      discount: {
        points: tr.usedPoints || 0,
        voucher: tr.voucher?.price || 0,
      },
    },
    status: tr.status,
    cancelledIn: tr.expiredAt,
  }));

  return (
    <motion.div {...opacityUp}>
      <div className="mb-12 mt-9">
        <div className="font-semibold text-gray-500">Summary</div>
        <div className="flex max-w-7xl gap-4 max-xl:flex-col">
          <StatCard
            title="Waiting Confirmation"
            value={summary.transaction.waitingConfirmation}
            icon={<Hourglass className="size-6 text-blue-600" />}
          />
          <StatCard
            title="Completed"
            value={summary.transaction.completed}
            icon={<ShieldCheck className="size-6 text-green-600" />}
          />
          <StatCard
            title="Cancelled"
            value={summary.transaction.cancelled}
            icon={<ShieldBan className="size-6 text-orange-600" />}
          />
          <StatCard
            title="Total Transaction"
            value={summary.transaction.total}
            icon={<NotepadText className="size-6 text-purple-600" />}
          />
        </div>
      </div>
      <motion.div {...fadeInUp}>
        <div className="mb-4 text-gray-500 font-semibold">
          Online Ticket Sales
        </div>

        <div
          className={cn(
            'w-[88vw] sm:w-[calc(92vw)] md:w-[calc(93vw-255px)] overflow-x-auto ',
            maxw450 && 'w-[83vw]',
          )}
        >
          <DataTable columns={columns} data={datacolumn} />
        </div>
      </motion.div>
    </motion.div>
  );
}
