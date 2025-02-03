import { z } from 'zod';

export const GetByIdEventDTO = z.object({
  eventId: z.string().uuid().nonempty(),
});
