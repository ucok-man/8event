import { prismaclient } from '@/prisma';

export class TicketService {
  getAllByEventId = async (eventId: string) => {
    return await prismaclient.ticket.findMany({
      where: {
        eventId: eventId,
      },
    });
  };

  delete = async (ticketId: string) => {
    const exists = prismaclient.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });
    if (!exists) return null;

    return await prismaclient.ticket.delete({
      where: {
        id: ticketId,
      },
    });
  };
}
