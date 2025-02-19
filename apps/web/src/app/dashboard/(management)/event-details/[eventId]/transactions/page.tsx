'use client';

import StatCard from '@/components/shared/stat-card';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Hourglass, NotepadText, ShieldBan, ShieldCheck } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';

export default function TransactionPage() {
  const { eventId } = useParams();
  const maxw450 = useMediaQuery('(max-width: 450px)');

  if (Array.isArray(eventId)) {
    return notFound();
  }

  const { data, isError, error, isFetching } = useQuery({
    queryKey: ['event-detail', 'event-detail-sales', eventId],
    queryFn: async () => {
      return [
        {
          username: 'user 1',
          email: 'user@user.com',
          payment: 20000,
          action: 'WAITING_CONFIRMATION',
        },
        {
          username: 'user 2',
          email: 'user@user.com',
          payment: 20000,
          action: 'CANCELLED',
        },
        {
          username: 'user 3',
          email: 'user@user.com',
          payment: 20000,
          action: 'COMPLETED',
        },
      ];
    },
  });

  if (isFetching) {
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

  if (!data) return notFound();

  return (
    <div>
      <div className="mb-12 mt-9">
        <div className="font-semibold text-gray-500">Summary</div>
        <div className="flex max-w-7xl gap-4 max-xl:flex-col">
          <StatCard
            title="Waiting Confirmation"
            value={50}
            icon={<Hourglass className="size-6 text-blue-600" />}
          />
          <StatCard
            title="Completed"
            value={50}
            icon={<ShieldCheck className="size-6 text-green-600" />}
          />
          <StatCard
            title="Cancelled"
            value={50}
            icon={<ShieldBan className="size-6 text-orange-600" />}
          />
          <StatCard
            title="Total Transaction"
            value={150}
            icon={<NotepadText className="size-6 text-purple-600" />}
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
          {/* <DataTable columns={columns} data={data!} /> */}
        </div>
      </div>
    </div>
  );
}
