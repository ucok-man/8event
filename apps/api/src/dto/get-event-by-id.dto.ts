import { z } from 'zod';

export const GetEventByIdDTO = z.object({
  eventId: z.string().uuid().nonempty(),
});
