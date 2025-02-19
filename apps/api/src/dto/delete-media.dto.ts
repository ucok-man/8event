import { z } from 'zod';

export const DeleteMediaDTO = z.object({
  mediaUrl: z
    .string()
    .url()
    .nonempty()
    .refine(
      (url) => {
        return url.startsWith(
          'https://res.cloudinary.com/dx6hmxiv3/image/upload/',
        );
      },
      { message: 'Invalid mediaUrl format' },
    ),
});
