import { z } from 'zod';

export const GetEventTransactionSummaryDTO = z.object({
  eventId: z.string().uuid(),
});
