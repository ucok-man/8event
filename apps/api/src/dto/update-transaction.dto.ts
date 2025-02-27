import { z } from 'zod';

export const UpdateTransactionDTO = z.object({
  transactionId: z.string().uuid(),
  isPayed: z.boolean().optional(),
});
