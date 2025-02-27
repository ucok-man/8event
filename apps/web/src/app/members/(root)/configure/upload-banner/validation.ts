import { z } from 'zod';

export const UploadBannerSchema = z.object({
  bannerUrl: z
    .string({ message: 'Please upload your banner first before continue' })
    .nonempty('Please upload your banner first before continue')
    .url('Invalid banner image url')
    .refine(
      (url) => {
        return url.startsWith(
          'https://res.cloudinary.com/dx6hmxiv3/image/upload/',
        );
      },
      { message: 'Invalid banner image url' },
    ),
});
