import { z } from 'zod';

export const UpdateEventViewIncrementDTO = z.object({
  eventId: z.string().uuid().nonempty(),
});
