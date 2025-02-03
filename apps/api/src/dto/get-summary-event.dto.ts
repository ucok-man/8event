import { z } from 'zod';

export const GetSummaryEventDTO = z.object({
  eventId: z.string().uuid().nonempty(),
});
