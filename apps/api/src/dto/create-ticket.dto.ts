import { z } from 'zod';

export const CreateTicketDtoValidation = z.object({
  tickets: z
    .array(
      z
        .object({
          type: z.string().trim().nonempty(),
          price: z.number().nonnegative(),
          isFree: z.boolean(),
          seatsAvailable: z.number().nonnegative(),
        })
        .refine((ticket) => {
          if (ticket.isFree && ticket.price > 0) {
            return false;
          }
          if (!ticket.isFree && ticket.price <= 0) {
            return false;
          }
          return true;
        }, 'invalid isFree and price combination'),
    )
    .nonempty(),
});

export type CreateTicketDto = z.infer<typeof CreateTicketDtoValidation>;
