import { z } from 'zod';

export const NameSchema = z.object({
  name: z.string().nonempty().min(3).max(255),
});
