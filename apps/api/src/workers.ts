import { TransactionStatus } from '@prisma/client';
import { Worker } from 'bullmq';
import { prismaclient } from './prisma';
import {
  TRANSACTION_EXP_WAIT_CONFIRM_TOKEN,
  TRANSACTION_EXP_WAIT_PAYMENT_TOKEN,
} from './queues';
import { redisclient } from './redis';

/* ---------------------------------------------------------------- */
/*                    worker for waiting payment                    */
/* ---------------------------------------------------------------- */

const transactionWaitPaymentWorker = new Worker(
  TRANSACTION_EXP_WAIT_PAYMENT_TOKEN,
  async (job) => {
    console.log(`Running ${job.id}...`);
    console.log(
      `Task: Attempt to mark transaction ${job.data.transactionId} as expired`,
    );

    const transaction = await prismaclient.transaction.findUnique({
      where: { id: job.data.transactionId },
    });
    if (!transaction)
      throw new Error(
        `Error: (Missing Data) trasaction with id #${job.data.transactionId} not found`,
      );

    if (transaction.status === TransactionStatus.WAITING_PAYMENT) {
      await prismaclient.transaction.update({
        where: { id: job.data.transactionId },
        data: { status: 'EXPIRED' },
      });
      if (transaction.voucherId) {
        await prismaclient.voucher.update({
          where: {
            id: transaction.voucherId,
          },
          data: {
            status: 'NOT_USE',
          },
        });
      }
      if (transaction.usedPoints) {
        await prismaclient.pointBalance.create({
          data: {
            point: transaction.usedPoints,
            type: 'EARN',
            userId: transaction.buyerId,
          },
        });
      }

      // kembalikan jumlah ticket
      const tickets = job.data.tickets as {
        transactionId: string;
        ticketId: string;
        name: string;
        price: number;
        quantity: number;
      }[];
      tickets.forEach(async (ticket) => {
        await prismaclient.ticket.update({
          where: {
            id: ticket.ticketId,
          },
          data: {
            amount: {
              increment: ticket.quantity,
            },
          },
        });
      });

      console.log(
        `Trasaction with id #${job.data.transactionId} is marked expired`,
      );
    } else {
      console.log(
        `Trasaction with id #${job.data.transactionId} was payed. Nothing to mark`,
      );
    }
  },
  { connection: redisclient },
);

transactionWaitPaymentWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

transactionWaitPaymentWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

/* ---------------------------------------------------------------- */
/*                  worker for waiting confirmation                 */
/* ---------------------------------------------------------------- */

const transactionWaitConfirmWorker = new Worker(
  TRANSACTION_EXP_WAIT_CONFIRM_TOKEN,
  async (job) => {
    console.log(`Running ${job.id}...`);
    console.log(
      `Task: Attempt to mark transaction ${job.data.transactionId} as cancelled`,
    );

    const transaction = await prismaclient.transaction.findUnique({
      where: { id: job.data.transactionId },
    });
    if (!transaction)
      throw new Error(
        `Error: (Missing Data) trasaction with id #${job.data.transactionId} not found`,
      );

    if (transaction.status === TransactionStatus.WAITING_CONFIRMATION) {
      await prismaclient.transaction.update({
        where: { id: job.data.transactionId },
        data: { status: 'CANCELLED' },
      });
      if (transaction.voucherId) {
        await prismaclient.voucher.update({
          where: {
            id: transaction.voucherId,
          },
          data: {
            status: 'NOT_USE',
          },
        });
      }
      if (transaction.usedPoints) {
        await prismaclient.pointBalance.create({
          data: {
            point: transaction.usedPoints,
            type: 'EARN',
            userId: transaction.buyerId,
          },
        });
      }

      // kembalikan jumlah ticket
      const tickets = job.data.tickets as {
        transactionId: string;
        ticketId: string;
        name: string;
        price: number;
        quantity: number;
      }[];
      tickets.forEach(async (ticket) => {
        await prismaclient.ticket.update({
          where: {
            id: ticket.ticketId,
          },
          data: {
            amount: {
              increment: ticket.quantity,
            },
          },
        });
      });

      console.log(
        `Trasaction with id #${job.data.transactionId} is marked cancelled`,
      );
    } else {
      console.log(
        `Trasaction with id #${job.data.transactionId} was confirmed. Nothing to mark`,
      );
    }
  },
  { connection: redisclient },
);

transactionWaitConfirmWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

transactionWaitConfirmWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
