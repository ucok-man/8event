'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import EventCard from './event-card';

// Mock data with isPublished field
const events = [
  {
    id: '1',
    bannerUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2400&q=80',
    name: 'Tech Conference 2024',
    category: 'Technology',
    startDate: '2024-04-15',
    endDate: '2024-04-17',
    startTime: '09:00',
    endTime: '18:00',
    description:
      'Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities.',
    isEventOnline: false,
    placeName: 'Convention Center',
    placeAddress: '123 Tech Street',
    placeCity: 'San Francisco',
    isPublished: true,
  },
  {
    id: '2',
    bannerUrl:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=2400&q=80',
    name: 'Virtual Workshop',
    category: 'Education',
    startDate: '2024-04-20',
    endDate: '2024-04-20',
    startTime: '14:00',
    endTime: '16:00',
    description:
      'Learn from industry experts online in this interactive workshop focused on the latest educational technologies and methodologies.',
    isEventOnline: true,
    urlStreaming: 'https://workshop.example.com',
    isPublished: true,
  },
  {
    id: '3',
    bannerUrl:
      'https://images.unsplash.com/photo-1591115765373-5207764f72e4?auto=format&fit=crop&w=2400&q=80',
    name: 'Business Summit 2024',
    category: 'Business',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    startTime: '08:00',
    endTime: '17:00',
    description:
      'Past business summit featuring industry leaders, keynote speakers, and breakthrough business strategies for 2024.',
    isEventOnline: false,
    placeName: 'Grand Hotel',
    placeAddress: '456 Business Ave',
    placeCity: 'New York',
    isPublished: true,
  },
  {
    id: '4',
    bannerUrl:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=2400&q=80',
    name: 'Marketing Workshop Draft',
    category: 'Marketing',
    startDate: '2024-05-01',
    endDate: '2024-05-01',
    startTime: '10:00',
    endTime: '16:00',
    description:
      'Draft event for upcoming marketing workshop focused on digital strategies and social media optimization.',
    isEventOnline: true,
    urlStreaming: 'https://workshop.example.com/marketing',
    isPublished: false,
  },
];

export default function MyEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('active');
  const isMobile = useMediaQuery('(min-width: 450px)');

  const categories = [...new Set(events.map((event) => event.category))];

  const filteredEvents = useMemo(() => {
    const now = new Date();

    return events.filter((event) => {
      const eventEndDate = new Date(`${event.endDate}T${event.endTime}`);
      const eventStartDate = new Date(`${event.startDate}T${event.startTime}`);
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || event.category === categoryFilter;

      const isPast = eventEndDate < now;
      const isActive = eventStartDate >= now && event.isPublished;
      const isDraft = !event.isPublished;

      const matchesTab =
        (activeTab === 'active' && isActive) ||
        (activeTab === 'draft' && isDraft) ||
        (activeTab === 'past' && isPast && event.isPublished);

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [searchQuery, categoryFilter, activeTab]);

  return (
    <div className="mt-8">
      <div className="mb-8 grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-10 grainy-dark focus-visible:ring-brand-blue-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="grainy-dark focus:ring-brand-blue-600">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="grainy-dark">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3 grainy-dark">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-brand-blue-600 data-[state=active]:text-white"
          >
            Active {isMobile && 'Events'}
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="data-[state=active]:bg-brand-blue-600 data-[state=active]:text-white"
          >
            Draft {isMobile && 'Events'}
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=active]:bg-brand-blue-600 data-[state=active]:text-white"
          >
            Past {isMobile && 'Events'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center min-h-[700px]">
              <div className="text-base text-muted-foreground">
                🤫 Ooops! No events found for the current filters
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
