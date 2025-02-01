import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getEventCategory } from '@/lib/utils';
import CategoryBadge from '../category-badge';
import EventDateTime from '../event-date-time';
import EventHeading from '../event-heading';
import EventLoaction from '../event-location';
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
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <CategoryBadge label={getEventCategory(event.category)} />
              </div>
            </div>
            <div className="p-6">
              <EventHeading title={event.name} className="md:text-3xl" />
              <Separator className="mt-6" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
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
