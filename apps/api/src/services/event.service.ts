import { CreateEventDTO } from '@/dto/create-event.dto';
import { GetAllEventDTO } from '@/dto/get-all-event.dto';
import { InternalSeverError } from '@/errors/internal-server.error';
import {
  getDateFromDayInThisMonth,
  getFirstDateOfMonthFromNumber,
  getFirstDateOfThisMonth,
  getLastDateOfMonthFromNumber,
  getMonthFromNumber,
  getWeeklyRangesInThisMonth,
} from '@/helpers/datetime-utils';
import { prismaclient } from '@/prisma';
import { Prisma, TransactionStatus } from '@prisma/client';
import { z } from 'zod';
import {
  getCategory,
  getCity,
  getEventFormat,
  getEventType,
  getLimit,
  getOffset,
  getOrganizerId,
  getPopular,
  getPriceType,
  getSearch,
  getSortBy,
  getStartTime,
} from './event.helper';
import { MetadataService } from './metadata.service';

export class EventService {
  private metadataService = new MetadataService();

  create = async (organizerId: string, dto: z.infer<typeof CreateEventDTO>) => {
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
  };

  getAll = async (dto: z.infer<typeof GetAllEventDTO>) => {
    const searchTerm = getSearch({ search: dto.search || '' });
    const organizerId = getOrganizerId({ organizerId: dto.organizerId });
    const eventType = getEventType({ type: dto.eventType });
    const eventFormat = getEventFormat({ format: dto.eventFormat || '' });
    const city = getCity({ city: dto.city || '' });
    const category = getCategory({ category: dto.category || '' });
    const startTime = getStartTime({ startTime: dto.startTime || '' });
    const priceType = getPriceType({ type: dto.priceType || '' });
    const sortBy = getSortBy({ sortBy: dto.sortBy });
    const popular = getPopular({ popular: dto.popular });
    const limit = getLimit({
      pageSize: dto.pageSize,
    });
    const offset = getOffset({
      page: dto.page,
      pageSize: dto.pageSize,
    });

    const query = Prisma.sql`
    SELECT 
      (COUNT(*) OVER())::int as "totalRecord",
      o."name" as "organizerName", o."profilePicture" as "organizerProfile",
      e."id", e."name", e."bannerUrl", e."description",
      e."startDate", e."endDate", e."startTime", e."endTime",
      e."isEventOnline", e."urlStreaming", e."placeName",
      e."placeCity", e."placeAddress", e."isPublished", e."views",
      ec."name" as "category",
      ( SELECT MIN(CASE WHEN t."type" = 'FREE' THEN 0 ELSE t."price" END)
        FROM "Ticket" t
        WHERE t."eventId" = e."id"
      ) as "lowestTicketPrice"
    FROM "Event" as e
    JOIN "EventCategory" as ec ON e."categoryId" = ec."id"
    JOIN "User" as o ON e."organizerId" = o."id"
		WHERE 
      e."id" = e."id" 
      ${organizerId} ${searchTerm} ${eventType} 
      ${eventFormat} ${city} ${category} ${startTime}
      ${priceType}
		ORDER BY ${popular} ${sortBy} e."id" ASC
		${limit} ${offset}`;

    const result: {
      totalRecord: number;
      id: string;
      name: string;
      bannerUrl: string;
      description: string;
      startDate: Date;
      endDate: Date;
      startTime: string;
      endTime: string;
      isEventOnline: boolean;
      urlStreaming?: string;
      placeName?: string;
      placeCity?: string;
      placeAddress?: string;
      isPublished: boolean;
      category: string;
      views: number;
      lowestTicketPrice: number;
      organizerName: string;
      organizerProfile?: string;
    }[] = await prismaclient.$queryRaw(query);

    if (result.length >= 1) {
      const metadata = this.metadataService.calculateMetadata({
        page: dto.page,
        pageSize: dto.pageSize,
        totalRecord: result[0].totalRecord,
      });

      return {
        events: result.map((e) => ({
          id: e.id,
          name: e.name,
          bannerUrl: e.bannerUrl,
          description: e.description,
          startDate: e.startDate,
          endDate: e.endDate,
          startTime: e.startTime,
          endTime: e.endTime,
          isEventOnline: e.isEventOnline,
          urlStreaming: e.urlStreaming,
          placeName: e.placeName,
          placeCity: e.placeCity,
          placeAddress: e.placeAddress,
          isPublished: e.isPublished,
          category: e.category,
          views: e.views,
          lolowestTicketPrice: e.lowestTicketPrice,
          organizerName: e.organizerName,
          organizerProfile: e.organizerProfile,
        })),
        metadata: metadata,
      };
    }
    return {
      events: [],
      metadata: null,
    };
  };

  getStatistic = async (organizerId: string) => {
    /* ----------------------------- STATS ----------------------------- */
    const events = await prismaclient.event.findMany({
      select: {
        id: true,
      },
      where: {
        organizerId: organizerId,
        isPublished: true,
      },
    });
    const {
      _sum: {
        priceAfterDiscount: totalRevenue,
        totalTicketQuantity: totalTicketSold,
      },
    } = await prismaclient.transaction.aggregate({
      _sum: {
        totalTicketQuantity: true,
        priceAfterDiscount: true,
      },
      where: {
        status: 'COMPLETED',
        eventId: {
          in: events.map((e) => e.id),
        },
      },
    });

    const averageRating =
      await prismaclient.recordOrganizerAverageRating.findUnique({
        where: {
          organizerId: organizerId,
        },
      });

    /* ---------------------------- MONTHLY --------------------------- */
    const dayrange = getWeeklyRangesInThisMonth();
    const monthlycontent = await Promise.all(
      dayrange.map(async (day, idx) => {
        const mindate =
          idx === 0
            ? getFirstDateOfThisMonth()
            : getDateFromDayInThisMonth(dayrange[idx - 1] + 1);
        const maxdate = getDateFromDayInThisMonth(day);

        mindate.setHours(0, 0);
        maxdate.setHours(23, 59);

        const eventfounds = await prismaclient.event.findMany({
          where: {
            startDate: {
              gte: mindate,
              lte: maxdate,
            },
            organizerId: organizerId,
            isPublished: true,
          },
          select: {
            id: true,
          },
        });
        // console.log({ eventfounds, day, mindate, maxdate });
        const {
          _sum: { totalTicketQuantity: ticketSold },
        } = await prismaclient.transaction.aggregate({
          _sum: {
            totalTicketQuantity: true,
          },
          where: {
            // createdAt: {
            //   gte: mindate,
            //   lte: maxdate,
            // },
            eventId: {
              in: eventfounds.map((e) => e.id),
            },
            status: TransactionStatus.COMPLETED,
          },
        });

        return {
          events: eventfounds.length,
          ticketSold: ticketSold || 0,
        };
      }),
    );
    if (dayrange.length !== monthlycontent.length)
      throw new InternalSeverError(
        `get statistic error dayrange length !== monthlycontent length`,
      );

    /* ---------------------------- YEARLY ---------------------------- */
    const monthrangestr = Array.from({ length: 12 }, (_, idx) =>
      getMonthFromNumber(idx),
    );
    const yearlycontent = await Promise.all(
      monthrangestr.map(async (_, idx) => {
        const mindate = getFirstDateOfMonthFromNumber(idx);
        const maxdate = getLastDateOfMonthFromNumber(idx);

        mindate.setHours(0, 0);
        maxdate.setHours(23, 59);

        const events = await prismaclient.event.findMany({
          where: {
            startDate: {
              gte: mindate,
              lte: maxdate,
            },
            organizerId: organizerId,
            isPublished: true,
          },
          select: {
            id: true,
          },
        });

        const {
          _sum: { totalTicketQuantity: ticketSold },
        } = await prismaclient.transaction.aggregate({
          _sum: {
            totalTicketQuantity: true,
          },
          where: {
            // createdAt: {
            //   gte: mindate,
            //   lte: maxdate,
            // },
            eventId: {
              in: events.map((e) => e.id),
            },
            status: TransactionStatus.COMPLETED,
          },
        });

        return {
          events: events.length,
          ticketSold: ticketSold || 0,
        };
      }),
    );

    if (monthrangestr.length !== yearlycontent.length)
      throw new InternalSeverError(
        `get statistic error monthrangestr length !== yearlycontent length`,
      );

    return {
      yearly: monthrangestr.map((month, idx) => ({
        month: month,
        ...yearlycontent[idx],
      })),
      monthly: dayrange.map((day, idx) => ({
        day: day,
        ...monthlycontent[idx],
      })),
      stats: {
        totalEvents: events.length || 0,
        totalTicketSold: totalTicketSold || 0,
        averageRating: averageRating?.averageRating || 0.0,
        totalRevenue: totalRevenue || 0,
      },
    };
  };
}
//
