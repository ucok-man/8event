import { z } from 'zod';

export const UpdatePaymentProofDTO = z.object({
  transactionId: z.string().uuid(),
  paymentProof: z
    .string({ message: 'Please upload your image first before continue' })
    .nonempty('Please upload your image first before continue')
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
