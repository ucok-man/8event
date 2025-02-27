import { z } from 'zod';

export const ResetPasswordSchema = z
  .object({
    currPassword: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .max(64, {
        message: 'Password must be less than 64 characters.',
      }),
    confPasssword: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .max(64, {
        message: 'Password must be less than 64 characters.',
      }),
    newPassword: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .max(64, {
        message: 'Password must be less than 64 characters.',
      }),
  })
  .refine((data) => data.confPasssword === data.newPassword, {
    path: ['confPasssword'],
    message: 'Password not match',
  });
