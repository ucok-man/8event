import { z } from 'zod';
import { EventSchema } from '../validation-schema/event.schema';
import { TicketsSchema } from '../validation-schema/tickets.schema';

export const CreateEventDTO = z.object({
  event: EventSchema,
  tickets: TicketsSchema,
});
