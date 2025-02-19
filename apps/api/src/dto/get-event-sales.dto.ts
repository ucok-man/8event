import { z } from 'zod';

export const GetEventSalesDTO = z.object({
  eventId: z.string().uuid().nonempty(),
});
