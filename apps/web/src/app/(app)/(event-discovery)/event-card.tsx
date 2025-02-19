import EventDateTime from '@/components/shared/event-date-time';
import EventHeading from '@/components/shared/event-heading';
import EventTicketPrice from '@/components/shared/event-ticket-price';
import OrganizerBadgeTooltip from '@/components/shared/organizer-badge-tooltip';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GetAllEventsResponse } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  event: GetAllEventsResponse['events'][number];
  containerClass?: string;
};

export default function EventCard({ event, containerClass }: Props) {
  return (
    <Card
      className={cn(
        'group relative flex flex-col overflow-hidden bg-white transition-all hover:shadow-lg cursor-pointer',
        containerClass,
      )}
    >
      {/* Banner Image */}
      <div className="relative aspect-video">
        <Image
          src={event.bannerUrl}
          alt={event.name}
          fill
          className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex grow flex-col p-6">
        {/* Title */}
        <div className="grow">
          <EventHeading
            title={event.name}
            className="text-xl font-semibold tracking-tight"
          />
        </div>

        {/* Event Details */}
        <div className="space-y-3 border-t pt-4">
          <EventDateTime
            startDate={event.startDate}
            endDate={event.startDate}
            startTime={event.startTime}
            endTime={event.endTime}
            visual="short"
            containerClass="text-sm"
            iconClass="size-4"
          />

          <EventTicketPrice price={event.lolowestTicketPrice} />
        </div>

        {/* Organizer*/}
        <OrganizerBadgeTooltip
          profile={event.organizerProfile}
          name={event.organizerName}
        />
      </div>

      {/* Action */}
      <Link
        href={`/details/${event.id}`}
        className="absolute inset-0 size-full"
      />
    </Card>
  );
}
