import CategoryBadge from '@/components/shared/category-badge';
import EventDateTime from '@/components/shared/event-date-time';
import EventHeading from '@/components/shared/event-heading';
import EventLoaction from '@/components/shared/event-location';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ExternalLinkIcon } from 'lucide-react';

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
    description: string;
  };
};

const proseStyle = `
prose max-w-none
prose-headings:text-brand-blue-900
prose-p:text-gray-700
prose-a:text-brand-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:cursor-pointer
prose-strong:text-brand-blue-800
prose-ul:list-disc prose-ol:list-decimal prose-ul:text-gray-700 prose-li:mb-2
prose-img:rounded-md prose-img:shadow-md
`;

export default function EventCard({ event }: Props) {
  return (
    <Card className="group relative flex flex-col overflow-hidden bg-white transition-all hover:shadow-lg cursor-pointer">
      {/* Action */}
      <div className="absolute inset-0 -translate-y-full group-hover:translate-y-0 transition-all duration-300">
        <div className="flex size-full items-center justify-center bg-brand-blue-950/20">
          <ExternalLinkIcon className="text-brand-blue-600 font-semibold size-10 group-hover:scale-105 z-50" />
        </div>
      </div>

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
        {/* Title and Description */}
        <div className="mb-4 flex-grow">
          <EventHeading
            title={event.name}
            className="text-xl font-semibold tracking-tight"
          />
          <div
            className={cn(
              'line-clamp-2 text-sm text-gray-500',
              proseStyle.trim().replaceAll('\n', ' '),
            )}
            dangerouslySetInnerHTML={{ __html: event.description }}
          ></div>
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
