export type GetAllEventsResponse = {
  events: {
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
    lolowestTicketPrice: number;
    organizerName: string;
    organizerProfile?: string;
    views: number;
  }[];
  metadata: {
    currentPage: number;
    pageSize: number;
    firstPage: number;
    lastPage: number;
    totalRecord: number;
  } | null;
};

export type GetEventByIdResponse = {
  event: {
    category: string;
    tickets: {
      eventId: string;
      startTime: string;
      name: string;
      startDate: string;
      type: 'FREE' | 'PAID';
      id: string;
      endDate: string;
      endTime: string;
      description: string;
      amount: number;
      price?: number;
      createdAt: string;
      updatedAt: string;
      initialAmount: number;
    }[];
    organizer: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      profilePicture?: string;
      role: 'ORGANIZER';
      referralCode: string;
      referredById?: string;
    };
    organizerId: string;
    startTime: string;
    name: string;
    startDate: string;
    id: string;
    bannerUrl: string;
    endDate: string;
    endTime: string;
    isEventOnline: boolean;
    urlStreaming?: string;
    placeName?: string;
    placeAddress?: string;
    placeCity?: string;
    description: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    views: number;
    categoryId: string;
  };
};

export type GetUserByIdResponse = {
  user: {
    pointBalance: number;
    vouchers: {
      id: string;
      name: string;
      createdAt: string;
      description: string;
      status: 'NOT_USE' | 'USED' | 'EXPIRED';
      price: number;
      userId: string;
      expiredAt?: string;
    }[];
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    role: 'CUSTOMER' | 'ORGANIZER';
    createdAt: string;
    updatedAt: string;
    referralCode: string;
    referredById?: string;
    rating: number;
  };
};

export type GetEventSummaryResponse = {
  summary: {
    totalTransaction: number;
    totalIncome: number;
    totalTicketSold: number;
    totalTicket: number;
    totalView: number;
  };
};

export type GetTransactionByUserId = {
  transaction: {
    id: string;
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    eventId: string;
    buyerId: string;
    totalTicketQuantity: number;
    status:
      | 'WAITING_PAYMENT'
      | 'WAITING_CONFIRMATION'
      | 'COMPLETED'
      | 'CANCELLED'
      | 'EXPIRED';
    totalDiscount: number;
    usedPoints?: number;
    voucherId?: string;
    paymentProof?: string;
    snaptoken?: string;
    createdAt: string;
    expiredAt?: string;
    isPayed: boolean;
  };
};

export type CheckoutResponse = {
  status: 'COMPLETED' | 'NEED_PAYMENT';
  transaction: {
    id: string;
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    eventId: string;
    buyerId: string;
    totalTicketQuantity: number;
    status:
      | 'WAITING_PAYMENT'
      | 'WAITING_CONFIRMATION'
      | 'COMPLETED'
      | 'CANCELLED'
      | 'EXPIRED';
    totalDiscount: number;
    usedPoints?: number;
    voucherId?: string;
    paymentProof?: string;
    snaptoken?: string;
    createdAt: string;
    expiredAt?: string;
    isPayed: boolean;
  };
};

export type GetAllTransactionForActionResponse = {
  transactions: {
    id: string;
    status: 'WAITING_CONFIRMATION' | 'COMPLETED' | 'CANCELLED';
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    isPayed: boolean;
    paymentProof: string;
    snaptoken?: string;
    createdAt: string;
    expiredAt?: string;
    eventId: string;
    buyerId: string;
    totalTicketQuantity: number;
    totalDiscount: number;
    usedPoints?: number;
    voucherId?: string;
    tickets: {
      transactionId: string;
      ticketId: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    voucher?: {
      id: string;
      name: string;
      description: string;
      price: number;
      status: 'USED';
      createdAt: string;
      expiredAt: string;
      userId: string;
    };
    buyer: {
      id: string;
      name: string;
      email: string;
      password: string;
      profilePicture: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      referralCode: string;
      referredById: string;
    };
  }[];
};

export type AcceptRejectPaymentResponse = {
  transaction: {
    id: string;
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    eventId: string;
    buyerId: string;
    totalTicketQuantity: number;
    status:
      | 'WAITING_PAYMENT'
      | 'WAITING_CONFIRMATION'
      | 'COMPLETED'
      | 'CANCELLED'
      | 'EXPIRED';
    totalDiscount: number;
    usedPoints?: number;
    voucherId?: string;
    isPayed: boolean;
    paymentProof?: string;
    snaptoken?: string;
    createdAt: Date;
    expiredAt?: Date;
  };
};

export type GetEventTransactionSummaryResponse = {
  summary: {
    transaction: {
      total: number;
      completed: number;
      cancelled: number;
      waitingConfirmation: number;
    };
    sales: {
      totalIncome: number;
      totalTicketSold: number;
    };
  };
};

export type GetEventsStatistic = {
  statistic: {
    yearly: { month: string; events: number; ticketSold: number }[];
    monthly: { day: string; events: number; ticketSold: number }[];
    stats: {
      totalEvents: number;
      totalTicketSold: number;
      averageRating: number;
      totalRevenue: number;
    };
  };
};
