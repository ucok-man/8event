'use client';

import StatCard from '@/components/shared/stat-card';
import { useCreateEventContext } from '@/context/create-event-provider';
import { formatRupiah } from '@/lib/utils';
import { CreditCard, Ticket, Users, WalletCards } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { GetEventByIdPayload, GetEventByIdSummaryPayload } from './types';

type Props = {
  summary: GetEventByIdSummaryPayload;
  event: GetEventByIdPayload;
};

export default function ContentSummary({ summary, event }: Props) {
  const { setStorage } = useCreateEventContext();
  const currentpath = usePathname();
  const router = useRouter();

  const onContinuePublish = () => {
    setStorage({
      uploadBanner: {
        data: { bannerUrl: event.bannerUrl },
      },
      createEvent: {
        data: { ...event },
      },
      createTicket: {
        data: event.tickets,
      },
      showBackButton: {
        link: currentpath,
      },
    });
    router.push('/dashboard/configure/review-draft');
  };

  return (
    <div className="w-full xl:w-[700px] relative h-fit xl:sticky xl:top-8">
      <div className="flex flex-col justify-center gap-2">
        <StatCard
          title="Income"
          value={formatRupiah(summary!.totalIncome)}
          icon={<WalletCards className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Ticket Sales"
          value={summary.ticketSales}
          subtitle={`/${summary!.ticketTotal}`}
          icon={<Ticket className="h-6 w-6 text-orange-600" />}
        />
        <StatCard
          title="Transactions"
          value={summary!.totalTransaction}
          icon={<CreditCard className="h-6 w-6 text-purple-600" />}
        />
        <StatCard
          title="Visitors"
          value={summary!.totalView}
          icon={<Users className="h-6 w-6 text-green-600" />}
        />
      </div>

      {!event.isPublished && (
        <div className="grainy-dark mt-8 p-2">
          <p className="text-gray-500 text-sm">
            This event is not published yet.{' '}
            <span
              onClick={onContinuePublish}
              className="text-brand-rose-600 cursor-pointer hover:underline hover:underline-offset-2"
            >
              Continue on publishing now!
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
