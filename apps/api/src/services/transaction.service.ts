import { CheckoutTransactionDTO } from '@/dto/checkout-transaction.dto';
import { GetTransactionByUserIdDTO } from '@/dto/get-transaction-by-userid.dto';
import { midtransSnap } from '@/midtrans';
import { prismaclient } from '@/prisma';
import { TRANSACTION_EXPIRATION_TOKEN, transactionQueue } from '@/queues';
import { Prisma, Transaction, TransactionStatus } from '@prisma/client';
import { z } from 'zod';

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

  checkout = async (dto: z.infer<typeof CheckoutTransactionDTO>) => {
    return await prismaclient.$transaction(async (prismaclient) => {
      const current = new Date();
      const twoHoursAfter = new Date();
      twoHoursAfter.setHours(current.getHours() + 2);

      const transaction = await prismaclient.transaction.create({
        data: {
          ...dto,
          expiredAt: twoHoursAfter,
          tickets: {
            createMany: {
              data: dto.tickets.map((ticket) => ({
                name: ticket.name,
                price: ticket.price,
                quantity: ticket.quantity,
                ticketId: ticket.ticketId,
              })),
            },
          },
        },
      });

      // update event ticket quantity
      await Promise.all(
        dto.tickets.map((ticket) =>
          prismaclient.ticket.update({
            where: { id: ticket.ticketId },
            data: {
              amount: {
                decrement: ticket.quantity,
              },
            },
          }),
        ),
      );

      // update voucher if exists.
      // TODO: when transction is accepted by organizer updated expiredAt to null
      if (dto.voucherId) {
        await prismaclient.voucher.update({
          where: {
            id: dto.voucherId,
          },
          data: {
            status: 'USED',
          },
        });
      }

      // update point balance
      if (dto.usedPoints && dto.usedPoints > 0) {
        await prismaclient.pointBalance.create({
          data: {
            point: dto.usedPoints,
            type: 'REDEEM',
            userId: dto.buyerId,
          },
        });
      }

      // if transaction amount === 0 (FREE Ticket or Covered with discount)
      // return early go back on controller
      if (transaction.priceAfterDiscount <= 0) return transaction;

      // if need payment execute below path
      // spwan new worker
      await transactionQueue.add(
        TRANSACTION_EXPIRATION_TOKEN,
        { transactionId: transaction.id },
        { delay: 2 * 60 * 60 * 1000 }, // 2 hours delay
        // { delay: 2 * 60 * 1000 }, // 2 minutes
      );

      // req invoice
      const result: {
        token: string;
        redirect_url: string;
      } = await midtransSnap.createTransaction({
        transaction_details: {
          order_id: transaction.id,
          gross_amount: transaction.priceAfterDiscount,
        },
      });

      return await prismaclient.transaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          snaptoken: result.token,
        },
      });
    });
  };

  getByUserId = async (dto: z.infer<typeof GetTransactionByUserIdDTO>) => {
    if (!dto.status) {
      return await prismaclient.transaction.findFirst({
        where: {
          buyerId: dto.userId,
        },
      });
    } else {
      return await prismaclient.transaction.findFirst({
        where: {
          buyerId: dto.userId,
          status: dto.status,
        },
      });
    }
  };

  getById = async (transactionId: string) => {
    return await prismaclient.transaction.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        tickets: true,
        voucher: true,
        buyer: true,
        event: true,
      },
    });
  };

  update = async (transaction: Transaction) => {
    return prismaclient.transaction.update({
      where: {
        id: transaction.id,
      },
      data: transaction,
    });
  };
}
