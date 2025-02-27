'use client';

import CardCarousel from '@/components/shared/card-carousel';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { useAuthContext } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { GetAllEventsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import EventCard from '../event-card';
import CarouselSkeleton from './carousel-skeleton';

export default function HolidayEvent() {
  const { apiclient } = useAuthContext();

  const { data, error, isPending } = useQuery({
    queryKey: ['event-discovery', 'holiday-event'],
    queryFn: async () => {
      const { data } = await apiclient.get(
        `/events?pageSize=8&category=travel_holidays`,
      );
      return data as GetAllEventsResponse;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Failed Load Data',
        description: 'Failed to load holiday events',
        variant: 'destructive',
      });
    }
  }, [error]);

  if (isPending) return <CarouselSkeleton title="Take a Moment to Heal!" />;
  if (!isPending && !data) return null;

  const { events } = data;

  return (
    <MaxWidthWrapper className="my-8">
      <div>
        <h2 className="mb-4 text-xl font-bold">Take a Moment to Heal!</h2>
        {events.length >= 1 && (
          <div className="w-full">
            <CardCarousel
              slideToScroll={1}
              items={events.map((event) => (
                <EventCard
                  containerClass="h-full"
                  key={event.id}
                  event={event}
                />
              ))}
            />
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
