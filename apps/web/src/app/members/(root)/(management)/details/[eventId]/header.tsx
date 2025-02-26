'use client';

import EventHeading from '@/components/shared/event-heading';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { GetEventByIdResponse } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notFound, useParams } from 'next/navigation';

export default function Header() {
  const { eventId } = useParams();
  const { apiclient } = useAuthContext();

  const { data, isError, error, isPending } = useQuery({
    queryKey: ['event-detail', 'event-detail-header', eventId],
    queryFn: async () => {
      const { data } = await apiclient.get(`/events/id/${eventId}`);
      return data.event as GetEventByIdResponse['event'];
    },
    placeholderData: keepPreviousData,
  });

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

  if (!isPending && !data) return null;

  return (
    <div>
      {!isPending && (
        <div className="mt-8">
          <div className="mb-8">
            <EventHeading title={data.name || ''} className="mb-4 text-xl" />
            <Separator className="" />
          </div>
        </div>
      )}
    </div>
  );
}
