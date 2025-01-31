export type CreateEventStepPayload = {
  uploadBanner: {
    data: { bannerUrl: string };
    error?: {
      bannerUrl?: {
        type: 'onChange';
        message: string;
      };
    };
  };
  createEvent: {
    data: {
      id?: string; // optional
      name: string;
      category: string;
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      description: string;
      isEventOnline: boolean;
      urlStreaming?: string;
      placeName?: string;
      placeAddress?: string;
      placeCity?: string;
    };
    error?: {
      name?: {
        type: 'onChange';
        message: string;
      };
      category?: {
        type: 'onChange';
        message: string;
      };
      startDate?: {
        type: 'onChange';
        message: string;
      };
      endDate?: {
        type: 'onChange';
        message: string;
      };
      startTime?: {
        type: 'onChange';
        message: string;
      };
      endTime?: {
        type: 'onChange';
        message: string;
      };
      isEventOnline?: {
        type: 'onChange';
        message: string;
      };
      urlStreaming?: {
        type: 'onChange';
        message: string;
      };
      placeName?: {
        type: 'onChange';
        message: string;
      };
      placeAddress?: {
        type: 'onChange';
        message: string;
      };
      placeCity?: {
        type: 'onChange';
        message: string;
      };
      latitude?: {
        type: 'onChange';
        message: string;
      }; // TODO: missing feature map
      longitude?: {
        type: 'onChange';
        message: string;
      }; // TODO: missing feature map
      description?: {
        type: 'onChange';
        message: string;
      };
    };
  };
  createTicket: {
    data: {
      id?: string; // optional
      type: 'FREE' | 'PAID';
      name: string;
      description: string;
      amount: number;
      price?: number;
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
    }[];
    error?: Record<
      string,
      {
        type?: {
          type: 'onChange';
          message: string;
        };
        name?: {
          type: 'onChange';
          message: string;
        };
        description?: {
          type: 'onChange';
          message: string;
        };
        amount?: {
          type: 'onChange';
          message: string;
        };
        price?: {
          type: 'onChange';
          message: string;
        };
        startDate?: {
          type: 'onChange';
          message: string;
        };
        endDate?: {
          type: 'onChange';
          message: string;
        };
        startTime?: {
          type: 'onChange';
          message: string;
        };
        endTime?: {
          type: 'onChange';
          message: string;
        };
      }
    >;
  };
};

export type BannerPayload = CreateEventStepPayload['uploadBanner']['data'];
export type BannerError = CreateEventStepPayload['uploadBanner']['error'];
export type EventPayload = CreateEventStepPayload['createEvent']['data'];
export type EventError = CreateEventStepPayload['createEvent']['error'];
export type TicketPayload = CreateEventStepPayload['createTicket']['data'];
export type TicketError = CreateEventStepPayload['createTicket']['error'];
