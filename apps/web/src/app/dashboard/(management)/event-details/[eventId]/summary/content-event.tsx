'use client';

import CategoryBadge from '@/components/shared/category-badge';
import EventDateTime from '@/components/shared/event-date-time';
import EventLoaction from '@/components/shared/event-location';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, getEventCategory } from '@/lib/utils';
import { GetEventByIdPayload } from './types';

const proseStyle = `
prose max-w-none
prose-headings:text-brand-blue-900
prose-p:text-gray-700
prose-a:text-brand-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:cursor-pointer
prose-strong:text-brand-blue-800
prose-ul:list-disc prose-ol:list-decimal prose-ul:text-gray-700 prose-li:mb-2
prose-img:rounded-md prose-img:shadow-md
`;

type Props = {
  event: GetEventByIdPayload;
};

export default function ContentEvent({ event }: Props) {
  return (
    <div className="size-full">
      <Card className="shadow-md border-0">
        <CardHeader className="p-0 grainy-light">
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
            <img
              src={event.bannerUrl}
              alt={event.name}
              className="object-cover object-center w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <CategoryBadge label={getEventCategory(event.category)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grainy-light">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <EventDateTime
                endDate={event.endDate}
                endTime={event.endTime}
                startDate={event.startDate}
                startTime={event.startTime}
                visual="long"
              />
            </div>
            <div>
              <EventLoaction
                isOnline={event.isEventOnline}
                placeAddress={event.placeAddress}
                placeCity={event.placeCity}
                placeName={event.placeName}
                platform="Virtual Platform"
                visual="long"
              />
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Tabs */}
          <div
            className={cn(proseStyle.trim().replaceAll('\n', ' '))}
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
