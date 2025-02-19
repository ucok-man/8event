'use client';

import EmptyState from '@/components/shared/empty-state';
import ErrorState from '@/components/shared/error-state';
import PendingState from '@/components/shared/pending-state';
import { toast } from '@/hooks/use-toast';
import { apiclient } from '@/lib/axios';
import { GetAllEventsResponse } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useEffect } from 'react';
import { useIsClient } from 'usehooks-ts';
import EventCard from '../event-card';

type Props = {
  search: string;
  sortBy: string;
  eventFormat: string;
  category: string;
  city: string;
  startTime: string;
  priceType: string;
  page: number;
};

export default function Content(props: Props) {
  const isClient = useIsClient();
  const router = useRouter();

  const { data, isPending, error } = useQuery({
    queryKey: ['event-discovery', 'explore', props],
    queryFn: async () => {
      const queryparam = qs.stringify(
        {
          ...props,
          eventType: 'active',
          pageSize: 8,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        },
      );
      const { data } = await apiclient.get(`/events?${queryparam}`);
      return data as GetAllEventsResponse;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (error) {
      console.log({ error });
      toast({
        title: 'Search Error',
        description: 'We encountered some issue, please try again!',
        variant: 'destructive',
      });
    }
  }, [error]);

  if (isPending) return <PendingState containerClass="min-h-[75vh]" />;
  if (error)
    return (
      <ErrorState
        containerClass="min-h-[75vh]"
        ctaTitle="Go Home"
        ctaAction={() => router.push('/')}
      />
    );

  if (!isClient || !data) return null;

  return (
    <div className="min-h-[75vh]">
      {data.events.length >= 1 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
      {data.events.length === 0 && (
        <EmptyState
          containerClass="min-h-[75vh]"
          title="No Events Found"
          description="We couldn’t find any events that match your current filters. Try adjusting your search criteria or check back later."
          ctaTitle="Reset Filters"
          ctaAction={() => router.replace('/explore')}
        />
      )}
    </div>
  );
}
