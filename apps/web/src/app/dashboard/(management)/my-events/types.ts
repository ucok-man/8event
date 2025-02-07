import { SORTBY_OPTION } from './constant';

export type SortByOptionType = (typeof SORTBY_OPTION)[number]['value'];
export type TabActiveType = 'active' | 'draft' | 'past';

export type GetAllEventPayload = {
  events: Event[];
  metadata: Metadata | null;
};

export type Event = {
  id: string;
  name: string;
  bannerUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isEventOnline: boolean;
  urlStreaming?: string;
  placeName?: string;
  placeCity?: string;
  placeAddress?: string;
  isPublished: boolean;
  category: string;
};

export type Metadata = {
  currentPage: number;
  pageSize: number;
  firstPage: number;
  lastPage: number;
  totalRecord: number;
};
