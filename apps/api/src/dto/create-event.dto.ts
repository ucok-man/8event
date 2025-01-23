import { z } from 'zod';

export const CreateEventDtoValidation = z.object({
  name: z.string().trim().nonempty().max(500),
  description: z.string().trim().nonempty(),
  eventImage: z.string().trim().nonempty().url(), // this should be url
  startDate: z.date(),
  endDate: z.date(),

  location: z.string().trim().nonempty(),
  latitude: z.number(),
  longitude: z.number(),

  categories: z
    .array(
      z.object({
        name: z.string().trim().nonempty().toLowerCase(),
      }),
    )
    .nonempty(),

  organizerId: z.string().uuid(),

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

export type CreateEventDto = z.infer<typeof CreateEventDtoValidation>;
