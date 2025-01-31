import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Calendar, Clock, Globe2, MapPin } from 'lucide-react';
import TicketCard from '../ticket-card';

type Props = {
  event: {
    bannerUrl: string;
    name: string;
    category: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    isEventOnline: boolean;
    urlStreaming: string;
    placeName: string;
    placeAddress: string;
    placeCity: string;
    description: string;
  };
  tickets: (
    | {
        type: 'FREE';
        name: string;
        description: string;
        amount: number;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
      }
    | {
        type: 'PAID';
        name: string;
        description: string;
        amount: number;
        price: number;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
      }
  )[];
};

export default function EventDetail({ event, tickets }: Props) {
  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <img
                src={event.bannerUrl}
                alt={event.name}
                className="object-cover object-center w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 max-sm:hidden">
                <Badge className="bg-brand-blue-500 hover:bg-brand-blue-600 text-white mb-3">
                  {event.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {event.name}
                </h1>
              </div>
            </div>
            <div className="sm:hidden p-6">
              <h1 className="text-2xl font-bold text-gray-700 mb-2">
                {event.name}
              </h1>
              <Badge className="bg-brand-blue-500 hover:bg-brand-blue-600 text-white mb-3">
                {event.category}
              </Badge>
              <Separator className="mt-6" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-brand-blue-500" />
                  <span className="text-gray-700">
                    {format(new Date(event.startDate), 'MMMM d')} -{' '}
                    {format(new Date(event.endDate), 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-brand-blue-500" />
                  <span className="text-gray-700">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {event.isEventOnline && (
                  <div className="flex items-center gap-3">
                    <Globe2 className="h-5 w-5 text-brand-blue-500" />
                    <span className="text-gray-700">Online Event</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  {!event.isEventOnline && (
                    <>
                      <MapPin className="h-5 w-5 text-brand-blue-500 shrink-0" />
                      <div className="text-gray-700">
                        <div className="font-medium">{event.placeName}</div>
                        <div className="text-sm text-gray-500">
                          {event.placeAddress}, {event.placeCity}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

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
                  className="prose max-w-none [&>h2]:text-brand-blue-900 [&>h3]:text-brand-blue-800 [&>p]:text-gray-700 [&>ul]:text-gray-700 [&>ul>li]:mb-2"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </TabsContent>

              <TabsContent value="tickets" className="mt-0">
                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <TicketCard ticket={ticket} key={index} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
