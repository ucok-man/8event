import { prismaclient } from '@/prisma';
import { Prisma, TransactionStatus } from '@prisma/client';

export class TransactionService {
  getTicketSalesForEach = async (ticketId: string) => {
    const query = Prisma.sql`
    SELECT 
      COALESCE(SUM(tt."quantity"), 0)::INT AS "ticketSold",
      COALESCE(SUM(tt."quantity" * tt."price"), 0)::FLOAT AS "ticketSales"
    FROM "TransactionTicket" tt
    JOIN "Transaction" tr ON tt."transactionId" = tr."id"
    WHERE tr."status" = 'COMPLETED' AND tt."ticketId" = ${ticketId};`;

    const result: { ticketSold: number; ticketSales: number }[] =
      await prismaclient.$queryRaw(query);
    return result[0];
  };

  getTicketSalesForAll = async (eventId: string) => {
    const query = Prisma.sql`
    SELECT 
      COALESCE(SUM(tr."totalDiscount"),0)::FLOAT AS "totalDiscount",
      COALESCE(SUM(tr."priceBeforeDiscount"),0)::FLOAT AS "totalTicketSales",
      COALESCE(SUM(tr."priceAfterDiscount"),0)::FLOAT AS "totalIncome"
    FROM "Transaction" tr
    JOIN "TransactionTicket" tt ON tr."id" = tt."transactionId"
    WHERE tr."status" = 'COMPLETED' AND tr."eventId" = ${eventId};`;

    const result: {
      totalDiscount: number;
      totalTicketSales: number;
      totalIncome: number;
    }[] = await prismaclient.$queryRaw(query);
    return result[0];
  };

  getEventTransactionSummary = async (eventId: string) => {
    const [completed, cancelled, waitingConfirmation] = await Promise.all([
      prismaclient.transaction.count({
        where: { eventId, status: 'COMPLETED' },
      }),
      prismaclient.transaction.count({
        where: { eventId, status: 'CANCELLED' },
      }),
      prismaclient.transaction.count({
        where: { eventId, status: 'WAITING_CONFIRMATION' },
      }),
    ]);

    const sales = await prismaclient.transaction.aggregate({
      _sum: {
        priceAfterDiscount: true,
        priceBeforeDiscount: true,
      },
      where: {
        status: TransactionStatus.COMPLETED,
        eventId: eventId,
      },
    });

    return {
      transaction: {
        total: completed + cancelled + waitingConfirmation,
        completed: completed,
        cancelled: cancelled,
        waitingConfirmation: waitingConfirmation,
      },
      sales: {
        totalIncome: sales._sum.priceAfterDiscount || 0,
        totalTicketSold: sales._sum.priceBeforeDiscount || 0,
      },
    };
  };
}
