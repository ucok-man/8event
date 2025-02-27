import { prismaclient } from '@/prisma';

export class TicketService {
  getEventTotalTicket = async (eventId: string) => {
    const sum = await prismaclient.ticket.aggregate({
      _sum: {
        initialAmount: true,
      },
      where: {
        eventId: eventId,
      },
    });
    return sum._sum.initialAmount || 0;
  };

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
