export type GetEventByIdSalesPayload = {
  tickets: {
    id: string;
    type: 'FREE' | 'PAID';
    name: string;
    ticketSold: number;
    ticketSales: number;
    initialAmount: number;
    amount: number; // current amount
    price: number | null;
  }[];
  summary: {
    totalDiscount: number;
    totalTicketSales: number;
    totalIncome: number;
  };
};
