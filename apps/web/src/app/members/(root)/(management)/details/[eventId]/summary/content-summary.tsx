'use client';

import StatCard from '@/components/shared/stat-card';
import { useCreateEventContext } from '@/context/create-event-provider';
import { formatRupiah } from '@/lib/utils';
import { GetEventByIdResponse, GetEventSummaryResponse } from '@/types';
import { EyeIcon, NotepadText, Ticket, WalletCards } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
  event: GetEventByIdResponse['event'];
  summary: GetEventSummaryResponse['summary'];
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
        data: {
          id: event.id,
          name: event.name,
          category: event.category,
          description: event.description,
          endDate: event.endDate,
          endTime: event.endTime,
          isEventOnline: event.isEventOnline,
          startDate: event.startDate,
          startTime: event.startTime,
          placeAddress: event.placeAddress,
          placeCity: event.placeCity,
          placeName: event.placeName,
          urlStreaming: event.urlStreaming,
        },
      },
      createTicket: {
        data: event.tickets,
      },
      showBackButton: {
        link: currentpath,
      },
    });
    router.push('/members/configure/review-draft');
  };

  return (
    <div className="w-full xl:w-[700px] relative h-fit xl:sticky xl:top-8">
      <div className="flex flex-col justify-center gap-2">
        <StatCard
          title="Revenue"
          value={formatRupiah(summary.totalIncome)}
          icon={<WalletCards className="h-6 w-6 text-blue-600" />}
          description="Total earning from this event"
        />
        <StatCard
          title="Attendees"
          value={summary.totalTicketSold}
          subtitle={`/${summary.totalTicket}`}
          icon={<Ticket className="h-6 w-6 text-orange-600" />}
          description="Pepole attending this event / total seat available"
        />
        <StatCard
          title="Transactions"
          value={summary.totalTransaction}
          icon={<NotepadText className="h-6 w-6 text-purple-600" />}
          description="Total transactions for this event"
        />
        <StatCard
          title="Visitors"
          value={summary.totalView}
          icon={<EyeIcon className="h-6 w-6 text-green-600" />}
          description="Total people seeing for this event"
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
