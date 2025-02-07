import { GetByIdEventDTO } from '@/dto/get-by-id-event.dto';
import { GetSalesEventDTO } from '@/dto/get-sales-event.dto';
import { GetSummaryEventDTO } from '@/dto/get-summary-event.dto';
import { prismaclient } from '@/prisma';
import { z } from 'zod';
import { TicketService } from './ticket.service';
import { TransactionService } from './transaction.service';

export class EventDetailService {
  private transactionService = new TransactionService();
  private ticketService = new TicketService();

  getById = async (
    organizerId: string,
    dto: z.infer<typeof GetByIdEventDTO>,
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
        tickets: {},
      },
    });

    if (!event) return null;
    return {
      ...event,
      category: event?.category.name,
    };
  };

  getSummary = async (dto: z.infer<typeof GetSummaryEventDTO>) => {
    const summary = await prismaclient.recordEventInfo.findUnique({
      where: {
        eventId: dto.eventId,
      },
    });
    return summary;
  };

  getTicketSales = async (dto: z.infer<typeof GetSalesEventDTO>) => {
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
}
