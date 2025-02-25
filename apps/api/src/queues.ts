import { Queue } from 'bullmq';
import { redisclient } from './redis';

export const TRANSACTION_EXPIRATION_TOKEN = 'transaction-expiration';
export const transactionQueue = new Queue(TRANSACTION_EXPIRATION_TOKEN, {
  connection: redisclient,
});
