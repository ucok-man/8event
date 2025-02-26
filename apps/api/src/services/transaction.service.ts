import { CheckoutTransactionDTO } from '@/dto/checkout-transaction.dto';
import { GetTransactionByUserIdDTO } from '@/dto/get-transaction-by-userid.dto';
import { midtransSnap } from '@/midtrans';
import { prismaclient } from '@/prisma';
import {
  TRANSACTION_EXP_WAIT_PAYMENT_TOKEN,
  transactionWaitPaymentQueue,
} from '@/queues';
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
    const result = await prismaclient.transaction.aggregate({
      where: {
        status: 'COMPLETED',
        eventId,
      },
      _sum: {
        totalDiscount: true,
        priceBeforeDiscount: true,
        priceAfterDiscount: true,
      },
    });

    return {
      totalDiscount: result._sum.totalDiscount || 0,
      totalTicketSales: result._sum.priceBeforeDiscount || 0,
      totalIncome: result._sum.priceAfterDiscount || 0,
    };
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
        totalTicketQuantity: true,
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
        totalTicketSold: sales._sum.totalTicketQuantity || 0,
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
            point: -dto.usedPoints,
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
      await transactionWaitPaymentQueue.add(
        TRANSACTION_EXP_WAIT_PAYMENT_TOKEN,
        { transactionId: transaction.id, tickets: dto.tickets },
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
        include: {
          tickets: true,
          voucher: true,
          buyer: true,
        },
      });
    } else {
      return await prismaclient.transaction.findFirst({
        where: {
          buyerId: dto.userId,
          status: dto.status,
        },
        include: {
          tickets: true,
          voucher: true,
          buyer: true,
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
      },
    });
  };

  getAllForAction = async (eventId: string) => {
    return await prismaclient.transaction.findMany({
      where: {
        eventId: eventId,
        status: {
          in: [
            TransactionStatus.WAITING_CONFIRMATION,
            TransactionStatus.COMPLETED,
            TransactionStatus.CANCELLED,
          ],
        },
      },
      include: {
        tickets: true,
        voucher: true,
        buyer: true,
      },
    });
  };

  update = async (transaction: Transaction) => {
    return prismaclient.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        isPayed: transaction.isPayed,
        paymentProof: transaction.paymentProof,
        snaptoken: transaction.snaptoken,
        status: transaction.status,
        usedPoints: transaction.usedPoints,
        expiredAt: transaction.expiredAt,
        // Below should be not muatated, but anyway
        id: transaction.id,
        buyerId: transaction.buyerId,
        createdAt: transaction.createdAt,
        eventId: transaction.eventId,
        voucherId: transaction.voucherId,
        priceAfterDiscount: transaction.priceAfterDiscount,
        priceBeforeDiscount: transaction.priceBeforeDiscount,
        totalDiscount: transaction.totalDiscount,
        totalTicketQuantity: transaction.totalTicketQuantity,
      },
    });
  };
}
