import { Queue } from 'bullmq';
import { redisclient } from './redis';

export const TRANSACTION_EXP_WAIT_PAYMENT_TOKEN =
  'transaction-expiration-waiting-payment';
export const transactionWaitPaymentQueue = new Queue(
  TRANSACTION_EXP_WAIT_PAYMENT_TOKEN,
  {
    connection: redisclient,
  },
);

export const TRANSACTION_EXP_WAIT_CONFIRM_TOKEN =
  'transaction-expiration-waiting-confirmation';
export const transactionWaitConfirmQueue = new Queue(
  TRANSACTION_EXP_WAIT_CONFIRM_TOKEN,
  {
    connection: redisclient,
  },
);
