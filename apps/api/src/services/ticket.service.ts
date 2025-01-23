import { CreateEventDto } from '@/dto/create-event.dto';
import { prismaclient } from '@/prisma';

export class TicketService {
  async createMany(
    tickets: Pick<CreateEventDto, 'tickets'>['tickets'],
    eventId: string,
  ) {
    return await prismaclient.ticket.createManyAndReturn({
      data: tickets.map((ticket) => ({
        eventId: eventId,
        isFree: ticket.isFree,
        price: ticket.price,
        seatsAvailable: ticket.seatsAvailable,
        type: ticket.type,
      })),
    });
  }
}
