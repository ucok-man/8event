'use client';

import { useAuthContext } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { GetEventByIdResponse, GetEventSummaryResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notFound, useParams } from 'next/navigation';
import ContentEvent from './content-event';
import ContentSummary from './content-summary';

export default function SummaryPage() {
  const { eventId } = useParams();
  const { apiclient } = useAuthContext();

  const { data, isError, error, isFetching } = useQuery({
    queryKey: ['event-detail', 'event-detail-summary', eventId],
    queryFn: async () => {
      const [eventres, summaryres] = await Promise.all([
        apiclient.get(`/events/id/${eventId}`),
        apiclient.get(`/events/id/${eventId}/summary`),
      ]);
      return {
        event: eventres.data.event as GetEventByIdResponse['event'],
        summary: summaryres.data.summary as GetEventSummaryResponse['summary'],
      };
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

  if (!data || Array.isArray(eventId)) return notFound();
  const { event, summary } = data;

  return (
    <div className="mt-8">
      <div className="flex flex-col-reverse xl:flex-row size-full gap-8">
        <ContentEvent event={event} />
        <ContentSummary summary={summary} event={event} />
      </div>
    </div>
  );
}
