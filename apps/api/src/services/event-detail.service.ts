import { GetByIdEventDTO } from '@/dto/get-by-id-event.dto';
import { GetSummaryEventDTO } from '@/dto/get-summary-event.dto';
import { prismaclient } from '@/prisma';
import { z } from 'zod';

export class EventDetailService {
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
    if (!summary) return null;

    return {
      ...summary,
      ticketSales: summary.ticketTotal - summary.ticketRemaining,
    };
  };
}
