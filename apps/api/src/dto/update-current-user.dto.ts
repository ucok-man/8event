import { z } from 'zod';

export const UpdateCurrentUserDTO = z.object({
  profilePicture: z
    .string()
    .nonempty('Please upload your profilePicture first before continue')
    .url('Invalid profilePicture image url')
    .refine(
      (url) => {
        return url.startsWith(
          'https://res.cloudinary.com/dx6hmxiv3/image/upload/',
        );
      },
      { message: 'Invalid profilePicture image url' },
    )
    .optional(),
  name: z.string().nonempty().min(3).max(255).optional(),
  password: z
    .object({
      current: z
        .string()
        .min(8, {
          message: 'Password must be at least 8 characters.',
        })
        .max(64, {
          message: 'Password must be less than 64 characters.',
        }),
      new: z
        .string()
        .min(8, {
          message: 'Password must be at least 8 characters.',
        })
        .max(64, {
          message: 'Password must be less than 64 characters.',
        }),
    })
    .optional(),
});
