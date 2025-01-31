import { CreateEventDTO } from '@/dto/create-event.dto';
import { prismaclient } from '@/prisma';
import { z } from 'zod';

export class EventService {
  async create(organizerId: string, dto: z.infer<typeof CreateEventDTO>) {
    const foundcategory = await prismaclient.eventCategory.findUnique({
      where: {
        name: dto.event.category,
      },
    });
    if (!foundcategory)
      throw new Error(`missing event category for: ${dto.event.category}`);

    const { category, ...event } = {
      ...dto.event,

      organizerId: organizerId,
      categoryId: foundcategory.id,
    };
    if ('category' in event) {
      delete event.category;
    }

    const result = await prismaclient.$transaction(async (tx) => {
      const createdEvent = await tx.event.upsert({
        create: event,
        where: {
          id: event.id || '',
        },
        update: event,
      });

      const tickets = await Promise.all(
        dto.tickets.map((ticket) =>
          tx.ticket.upsert({
            create: {
              ...ticket,
              initialAmount: ticket.amount,
              eventId: createdEvent.id,
            },
            where: {
              id: ticket.id || '',
            },
            update: {
              ...ticket,
              initialAmount: ticket.amount,
              eventId: createdEvent.id,
            },
          }),
        ),
      );
      return {
        event: {
          id: createdEvent.id,
        },
        tickets: tickets.map((ticket) => ticket.id),
      };
    });

    return result;
  }
}
