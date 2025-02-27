import { z } from 'zod';

export const SigninSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .max(64, {
      message: 'Password must be less than 64 characters.',
    }),
});
