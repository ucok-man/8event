import CategoryBadge from '@/components/shared/category-badge';
import EventDateTime from '@/components/shared/event-date-time';
import EventHeading from '@/components/shared/event-heading';
import EventLoaction from '@/components/shared/event-location';
import { Card } from '@/components/ui/card';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  event: {
    id: string;
    bannerUrl: string;
    name: string;
    category: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    isEventOnline: boolean;
    urlStreaming?: string;
    placeName?: string;
    placeAddress?: string;
    placeCity?: string;
  };
};

export default function EventCard({ event }: Props) {
  return (
    <Card className="group relative flex flex-col overflow-hidden bg-white transition-all hover:shadow-lg cursor-pointer">
      {/* Action */}
      <Link
        href={`/dashboard/event-details/${event.id}/summary`}
        className="absolute inset-0 -translate-y-full group-hover:translate-y-0 transition-all duration-300 z-20"
      >
        <div className="flex size-full items-center justify-center bg-brand-blue-950/20">
          <ExternalLinkIcon className="text-brand-blue-600 font-semibold size-10 group-hover:scale-105" />
        </div>
      </Link>

      {/* Banner Image */}
      <div className="relative aspect-video">
        <img
          src={event.bannerUrl}
          alt={event.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        {/* Category Badge - Positioned on the image */}
        <div className="absolute left-4 top-4">
          <CategoryBadge label={event.category} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        {/* Title */}
        <div className="mb-4 flex-grow">
          <EventHeading
            title={event.name}
            className="text-xl font-semibold tracking-tight"
          />
        </div>

        {/* Event Details */}
        <div className="space-y-3 border-t pt-4">
          <EventDateTime
            endDate={event.endDate}
            endTime={event.endTime}
            startDate={event.startDate}
            startTime={event.startTime}
            visual="short"
            containerClass="text-sm"
            iconClass="size-4"
          />

          <EventLoaction
            isOnline={event.isEventOnline}
            placeAddress={event.placeAddress}
            placeCity={event.placeCity}
            placeName={event.placeName}
            visual="short"
            containerClass="text-sm"
            iconClass="size-4"
          />
        </div>
      </div>
    </Card>
  );
}
