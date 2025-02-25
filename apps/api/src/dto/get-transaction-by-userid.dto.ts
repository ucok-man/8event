import { z } from 'zod';

export const GetTransactionByUserIdDTO = z.object({
  userId: z.string().uuid().nonempty(),
  status: z
    .enum([
      'WAITING_PAYMENT',
      'WAITING_CONFIRMATION',
      'COMPLETED',
      'CANCELLED',
      'EXPIRED',
    ])
    .optional(),
});
