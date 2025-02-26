'use client';

import PaginationButton from '@/components/shared/pagination-button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';
import { useIsClient, useMediaQuery } from 'usehooks-ts';
import ContentActiveEvent from './content-active-event';
import ContentDraftEvent from './content-draft-event';
import ContentPastEvent from './content-past-event';
import { GetAllEventPayload, SortByOptionType, TabActiveType } from './types';

type Props = {
  search: string;
  sortBy: SortByOptionType;
  page: number;
};

export default function Content({ search, sortBy, page }: Props) {
  const { apiclient, user, status } = useAuthContext();
  const isClient = useIsClient();
  const [activeTab, setActiveTab] = useState<TabActiveType>('active');
  const isMobile = useMediaQuery('(min-width: 450px)');
  const router = useRouter();
  // const searchParams = useSearchParams();

  const { data, isPending, error } = useQuery({
    queryKey: ['my-events', search, sortBy, page, activeTab],
    queryFn: async () => {
      const queryparam = qs.stringify(
        {
          search: search,
          sortBy: sortBy,
          eventType: activeTab,
          page: page,
          pageSize: 6,
          organizerId: user?.id || '',
        },
        {
          skipEmptyString: true,
          skipNull: true,
        },
      );
      const { data } = await apiclient.get(`/events?${queryparam}`);
      return data as GetAllEventPayload;
    },
    placeholderData: keepPreviousData,
    enabled: status !== 'pending' && user !== null,
  });

  const handleTabChange = (val: string) => {
    const newParams = qs.stringify(
      {
        search: search,
        sortBy: sortBy,
        page: null,
        // eventType: val, // Update activeTab
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );

    // Update URL query params, removing "page"
    setActiveTab(val as TabActiveType);
    router.push(`?${newParams}`, { scroll: false });
  };

  if (isPending) {
    return (
      <div className="p-8 text-center">
        <div className="text-base text-muted-foreground">
          🤔 Preparing your data...
        </div>
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Search Error',
      description: 'We encountered some issue, please try again!',
      variant: 'destructive',
    });
    return (
      <div className="p-8 text-center">
        <div className="text-base text-muted-foreground">
          😮 We encountered some issue, please try again!
        </div>
      </div>
    );
  }

  if (!isClient) return <div></div>;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => handleTabChange(val)}
      className="w-full"
    >
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

      <ContentActiveEvent events={data.events} />
      <ContentDraftEvent events={data.events} />
      <ContentPastEvent events={data.events} />

      <PaginationButton metadata={data.metadata} />
    </Tabs>
  );
}
