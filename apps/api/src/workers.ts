import { Worker } from 'bullmq';
import { prismaclient } from './prisma';
import { TRANSACTION_EXPIRATION_TOKEN } from './queues';
import { redisclient } from './redis';

const transactionWorker = new Worker(
  TRANSACTION_EXPIRATION_TOKEN,
  async (job) => {
    console.log(`Running ${job.id}...`);
    console.log(
      `Task: Marking transaction ${job.data.transactionId} as expired`,
    );

    await prismaclient.transaction.update({
      where: { id: job.data.transactionId },
      data: { status: 'EXPIRED' },
    });
  },
  { connection: redisclient },
);

transactionWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

transactionWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
