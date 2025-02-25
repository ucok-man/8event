'use client';

import { TabsContent } from '@/components/ui/tabs';
import EventCard from './event-card';
import { Event } from './types';

type Props = {
  events: Event[];
};

export default function ContentPastEvent({ events }: Props) {
  return (
    <TabsContent value="past" className="mt-0">
      {events.length >= 1 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {events.length === 0 && (
        <div className="p-8 text-center">
          <div className="text-base text-muted-foreground">
            🤫 Ooops! No events found for the current filters
          </div>
        </div>
      )}
    </TabsContent>
  );
}
