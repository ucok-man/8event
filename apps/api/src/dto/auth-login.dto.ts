import { z } from 'zod';

export const AuthLoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
});
