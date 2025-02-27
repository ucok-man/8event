import { z } from 'zod';

export const DeleteTicketDTO = z.object({
  ticketId: z.string().uuid().nonempty(),
});
