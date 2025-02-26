import { z } from 'zod';

export const AcceptRejectPaymentDTO = z.object({
  transactionId: z.string().uuid(),
});
