'use client';

import StatCard from '@/components/shared/stat-card';
import { useAuthContext } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { cn, formatRupiah } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Minus, Plus, WalletCards } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';
import { columns, DataColumnType } from './columns';
import { DataTable } from './data-table';
import { GetEventByIdSalesPayload } from './types';

export default function SalesPage() {
  const { eventId } = useParams();
  const maxw450 = useMediaQuery('(max-width: 450px)');
  const { apiclient, status } = useAuthContext();

  if (Array.isArray(eventId)) {
    return notFound();
  }

  const { data, isError, error, isPending } = useQuery({
    queryKey: ['event-detail', 'event-detail-sales', eventId],
    queryFn: async () => {
      const { data } = await apiclient.get(`/events/id/${eventId}/sales`);
      return data.ticketSales as GetEventByIdSalesPayload;
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

  if (!isPending && !data) return notFound();
  const { tickets, summary } = data;

  const datacolumn: DataColumnType[] = tickets.map((ticket) => ({
    ticketName: ticket.name,
    price: ticket.price ? ticket.price : undefined,
    amount: ticket.initialAmount,
    sold: ticket.ticketSold,
    sales: ticket.ticketSales,
  }));

  return (
    <div className="w-full">
      <div className="mb-12 mt-9">
        <div className="text-gray-500 font-semibold">Summary</div>
        <div className="flex gap-4 max-w-5xl max-lg:flex-col">
          <StatCard
            title="Total Ticket Sales"
            value={formatRupiah(summary.totalTicketSales)}
            icon={<Plus className="h-6 w-6 text-blue-600" />}
          />
          <StatCard
            title="Total Discount"
            value={formatRupiah(summary.totalDiscount)}
            icon={<Minus className="h-6 w-6 text-orange-600" />}
          />
          <StatCard
            title="Total Income"
            value={formatRupiah(summary.totalIncome)}
            icon={<WalletCards className="h-6 w-6 text-purple-600" />}
          />
        </div>
      </div>

      <div>
        <div className="mb-4 text-gray-500 font-semibold">
          Online Ticket Sales
        </div>

        <div
          className={cn(
            'w-[88vw] sm:w-[calc(92vw)] md:w-[calc(93vw-255px)] overflow-x-auto ',
            maxw450 && 'w-[83vw]',
          )}
        >
          <DataTable columns={columns} data={datacolumn} summary={summary} />
        </div>
      </div>
    </div>
  );
}
