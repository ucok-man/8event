import { z } from 'zod';

export const GetEventSummaryDTO = z.object({
  eventId: z.string().uuid().nonempty(),
});
