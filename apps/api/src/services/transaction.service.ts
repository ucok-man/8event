import { prismaclient } from '@/prisma';
import { Prisma } from '@prisma/client';

export class TransactionService {
  getTicketSalesForEach = async (ticketId: string) => {
    const query = Prisma.sql`
    SELECT 
      count(tr.id)::int AS "ticketSold",
      coalesce(sum(ti.price * tr."ticketQuantity"), 0)::int AS "ticketSales"
    FROM "Transaction" tr
    JOIN "Ticket" ti ON tr."ticketId" = ti.id
    WHERE tr.status = 'COMPLETED' AND ti.id =${ticketId}`;

    const result: { ticketSold: number; ticketSales: number }[] =
      await prismaclient.$queryRaw(query);
    return result[0];
  };

  getTicketSalesForAll = async (eventId: string) => {
    const query = Prisma.sql`
    SELECT 
      COALESCE(SUM(tr."usedPoints" + COALESCE(v."discountAmount", 0)), 0)::INT AS "totalDiscount",
      COALESCE(SUM(tr."priceBeforeDiscount"), 0) AS "totalTicketSales",
      COALESCE(SUM(tr."priceAfterDiscount"), 0) AS "totalIncome"
    FROM "Transaction" tr
    LEFT JOIN "Voucher" v ON tr."voucherId" = v."id"
    WHERE tr.status = 'COMPLETED' AND tr."eventId" = ${eventId};
    `;

    const result: {
      totalDiscount: number;
      totalTicketSales: number;
      totalIncome: number;
    }[] = await prismaclient.$queryRaw(query);
    return result[0];
  };
}
