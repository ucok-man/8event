import { z } from 'zod';

export const CheckoutTransactionDTO = z.object({
  id: z.string().uuid().nonempty(),
  priceBeforeDiscount: z.number().nonnegative(),
  priceAfterDiscount: z.number().nonnegative(),
  eventId: z.string().uuid().nonempty(),
  buyerId: z.string().uuid().nonempty(),
  totalTicketQuantity: z.number().min(1),
  tickets: z
    .array(
      z.object({
        transactionId: z.string().uuid().nonempty(),
        ticketId: z.string().uuid().nonempty(),
        name: z.string().nonempty(),
        price: z.number().nonnegative(),
        quantity: z.number().min(1),
      }),
    )
    .nonempty(),
  totalDiscount: z.number().nonnegative(),
  usedPoints: z.number().nonnegative().nullable().optional(),
  voucherId: z.string().nullable().optional(),
});
