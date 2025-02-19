import { GetEventByIdDTO } from '@/dto/get-event-by-id.dto';
import { GetEventSalesDTO } from '@/dto/get-event-sales.dto';
import { GetEventSummaryDTO } from '@/dto/get-event-summary.dto';
import { prismaclient } from '@/prisma';
import { z } from 'zod';
import { TicketService } from './ticket.service';
import { TransactionService } from './transaction.service';

export class EventDetailService {
  private transactionService = new TransactionService();
  private ticketService = new TicketService();

  getById = async (
    organizerId: string,
    dto: z.infer<typeof GetEventByIdDTO>,
  ) => {
    const event = await prismaclient.event.findUnique({
      where: {
        id: dto.eventId,
        organizerId: organizerId,
      },
      include: {
        category: {
          select: { name: true },
        },
        tickets: true,
        organizer: {
          omit: {
            password: true,
          },
        },
      },
    });

    if (!event) return null;
    return {
      ...event,
      category: event?.category.name,
    };
  };

  getSummary = async (dto: z.infer<typeof GetEventSummaryDTO>) => {
    const event = await prismaclient.event.findUnique({
      where: {
        id: dto.eventId,
      },
      select: {
        views: true,
      },
    });
    if (!event) return null;

    const { transaction, sales } =
      await this.transactionService.getEventTransactionSummary(dto.eventId);

    const totalTicket = await this.ticketService.getEventTotalTicket(
      dto.eventId,
    );

    const result = {
      totalView: event.views,
      totalTicket: totalTicket,
      totalTicketSold: sales.totalTicketSold,
      totalIncome: sales.totalIncome,
      totalTransaction: transaction.total,
    };

    return result;
  };

  getTicketSales = async (dto: z.infer<typeof GetEventSalesDTO>) => {
    const tickets = await this.ticketService.getAllByEventId(dto.eventId);
    if (tickets.length <= 0) return null;

    const updatedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const sales = await this.transactionService.getTicketSalesForEach(
          ticket.id,
        );
        return {
          ...ticket,
          ...sales,
        };
      }),
    );

    const totalSales = await this.transactionService.getTicketSalesForAll(
      dto.eventId,
    );

    return {
      tickets: updatedTickets,
      summary: totalSales,
    };
  };

  incrementView = async (eventId: string) => {
    const event = await prismaclient.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!event) return null;

    await prismaclient.event.update({
      data: {
        views: {
          increment: 1,
        },
      },
      where: {
        id: event.id,
      },
    });
    return event;
  };
}
