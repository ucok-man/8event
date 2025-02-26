'use client';

import CategoryBadge from '@/components/shared/category-badge';
import EventCreatorAvatar from '@/components/shared/event-creator-avatar';
import EventDateTime from '@/components/shared/event-date-time';
import EventHeading from '@/components/shared/event-heading';
import EventLoaction from '@/components/shared/event-location';
import TicketCard from '@/components/shared/ticket-card';
import { TimeType } from '@/components/shared/time-picker/time-type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/context/auth-provider';
import {
  TransactionContextType,
  TransactionStateType,
} from '@/context/transaction-provider';
import {
  currentDateIsAfterEqual,
  currentDateIsBefore,
  currentTimeIsAfterEqual,
  currentTimeIsBefore,
} from '@/lib/datetime-utils';
import { cn, getEventCategory } from '@/lib/utils';
import { GetEventByIdResponse } from '@/types';
import { format } from 'date-fns';

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
  event: GetEventByIdResponse['event'];
  payload: TransactionStateType;
  addTicket: TransactionContextType['addTicket'];
  substractTicket: TransactionContextType['substractTicket'];
};

export default function EventDetail({
  event,
  payload,
  addTicket,
  substractTicket,
}: Props) {
  const { user } = useAuthContext();

  return (
    <div className="p-4 md:p-8 grow">
      <div className="mx-auto w-full max-w-4xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="p-0">
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
          <CardContent className="p-6">
            <div className="mb-6">
              <EventHeading title={event.name} className="md:text-3xl" />
              <Separator className="mt-6" />
            </div>
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

            <div className="mb-6 flex flex-col w-full justify-center items-start">
              <EventCreatorAvatar
                explainer
                profile={event.organizer.profilePicture}
                name={event.organizer.name}
                nameClass="font-semibold text-base"
                containerClass="place-content-start"
                imageClass="size-10"
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-brand-blue-50 p-1">
                <TabsTrigger
                  value="about"
                  className="text-base data-[state=active]:bg-brand-blue-500 data-[state=active]:text-white"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="tickets"
                  className="text-base data-[state=active]:bg-brand-blue-500 data-[state=active]:text-white"
                >
                  Tickets
                </TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="mt-0">
                <div
                  className={cn(proseStyle.trim().replaceAll('\n', ' '))}
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </TabsContent>
              <TabsContent value="tickets" className="mt-0">
                <div className="space-y-4">
                  {event.tickets.map((ticket, index) => {
                    const isNotOpen =
                      currentDateIsBefore(ticket.startDate) ||
                      currentTimeIsBefore(ticket.startTime as TimeType);

                    const isOpen =
                      currentDateIsAfterEqual(ticket.startDate) &&
                      currentTimeIsAfterEqual(ticket.startTime as TimeType);

                    const count = payload.tickets.find(
                      (tp) => tp.ticketId === ticket.id,
                    )?.quantity;

                    return (
                      <TicketCard
                        ticket={ticket}
                        key={index}
                        action={
                          <div className="h-10 border-t">
                            {isNotOpen && (
                              <div className="size-full flex justify-end items-center px-6 gap-x-1 text-red-600 font-semibold">
                                <span>Open At</span>
                                <span>
                                  {format(new Date(ticket.startDate), 'MMM d')}
                                </span>
                              </div>
                            )}
                            {isOpen && (
                              <div className="size-full flex justify-end items-center px-6 gap-x-3">
                                <button
                                  disabled={
                                    user?.role !== 'CUSTOMER' || !user.id
                                  }
                                  className="px-2 rounded-full border border-brand-blue-600 text-brand-blue-600 font-medium"
                                  onClick={() => addTicket(ticket.id)}
                                >
                                  +
                                </button>
                                <span>{count || 0}</span>
                                <button
                                  disabled={
                                    user?.role !== 'CUSTOMER' || !user.id
                                  }
                                  className="px-2 rounded-full border border-brand-blue-600 text-brand-blue-600 font-medium"
                                  onClick={() => substractTicket(ticket.id)}
                                >
                                  -
                                </button>
                              </div>
                            )}
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
