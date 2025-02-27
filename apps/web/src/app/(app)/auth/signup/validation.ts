import { z } from 'zod';

export const SignupSchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z0-9_ ]*$/, 'Must be number, letter, and underscore only')
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .nonempty(),
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
  referralCode: z.string().optional(),
});
