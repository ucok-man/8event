import { z } from 'zod';

export const GetUserByIdDTO = z.object({
  userId: z.string().uuid().nonempty(),
});
