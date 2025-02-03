export type GetEventByIdPayload = {
  category: string;
  tickets: {
    eventId: string;
    type: 'FREE' | 'PAID';
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    initialAmount: number;
    amount: number;
    price?: number;
  }[];
  id: string;
  name: string;
  bannerUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  isEventOnline: boolean;
  urlStreaming?: string;
  placeName?: string;
  placeCity?: string;
  placeAddress?: string;
  isPublished: boolean;
  organizerId: string;
  categoryId: string;
};

export type GetEventByIdSummaryPayload = {
  eventId: string;
  totalView: number;
  ticketSales: number;
  ticketTotal: number;
  ticketRemaining: number;
  totalIncome: number;
  totalTransaction: number;
};
