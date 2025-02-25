import { z } from 'zod';

export const UploadPaymentProofSchema = z.object({
  paymentProof: z
    .string({ message: 'Please upload your payment proof before continue' })
    .nonempty('Please upload your payment proof before continue')
    .url('Invalid image url')
    .refine(
      (url) => {
        return url.startsWith(
          'https://res.cloudinary.com/dx6hmxiv3/image/upload/',
        );
      },
      { message: 'Invalid image url' },
    ),
});
