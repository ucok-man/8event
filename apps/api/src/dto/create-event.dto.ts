import { z } from 'zod';
import { EventSchema } from '../validation-schema/event.schema';
import { TicketsSchema } from '../validation-schema/tickets.schema';

export const CreateEventDTO = z
  .object({
    event: EventSchema,
    tickets: TicketsSchema,
  })
  .superRefine((data, ctx) => {
    data.tickets.forEach((ticket, index) => {
      const startDate = new Date(ticket.startDate);

      if (
        !(startDate > new Date() && startDate < new Date(data.event.startDate))
      ) {
        ctx.addIssue({
          code: 'invalid_date',
          message:
            'Ticket startDate must be in the future and before the event startDate.',
          path: ['tickets', index, 'startDate'], // Point to the specific ticket's startDate
        });
      }
    });
  });
