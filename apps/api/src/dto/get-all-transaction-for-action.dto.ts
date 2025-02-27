import { z } from 'zod';

export const GetAllTransactionForActionDTO = z.object({
  eventId: z.string().uuid(),
});
