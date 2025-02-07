import { z } from 'zod';

export const GetSalesEventDTO = z.object({
  eventId: z.string().uuid().nonempty(),
});
