import { CreateEventDTO } from '@/dto/create-event.dto';
import { GetAllEventDTO } from '@/dto/get-all-event.dto';
import { prismaclient } from '@/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
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
    console.log({ dto });
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
}

function getOrganizerId({ organizerId }: { organizerId?: string }) {
  if (organizerId) {
    return Prisma.sql`AND e."organizerId" = ${organizerId}`;
  }
  return Prisma.sql``;
}

function getSearch({ search }: { search: string }) {
  if (search != '') {
    // construct the search term in the form 'term1:* & term2:*'
    const token = search
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');
    return Prisma.sql`AND (to_tsvector('simple', e."name") @@ to_tsquery('simple', ${token}) OR ${token} = ${''})`;
  }
  return Prisma.sql``;
}

function getEventType({ type }: { type: string }) {
  if (type === 'active') {
    return Prisma.sql`AND e."startDate" >= ${new Date()} AND e."isPublished" = ${true}`;
  } else if (type === 'past') {
    return Prisma.sql`AND e."startDate" < ${new Date()} AND e."isPublished" = ${true}`;
  } else if (type === 'draft') {
    return Prisma.sql`AND e."isPublished" = ${false}`;
  } else return Prisma.sql``;
}

function getEventFormat({ format }: { format: string }) {
  if (format === 'online') {
    return Prisma.sql`AND e."isEventOnline" = ${true}`;
  } else if (format === 'inperson') {
    return Prisma.sql`AND e."isEventOnline" = ${false}`;
  } else return Prisma.sql``;
}

function getCity({ city }: { city: string }) {
  if (city != '') {
    const token = city
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');
    return Prisma.sql`AND (to_tsvector('simple', e."placeCity") @@ to_tsquery('simple', ${token}) OR ${token} = ${''})`;
  }
  return Prisma.sql``;
}

function getCategory({ category }: { category: string }) {
  if (category === '') return Prisma.sql``;
  return Prisma.sql`AND ec."name" = ${category}`;
}

function getStartTime({ startTime }: { startTime: string }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight today

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Set to midnight tomorrow

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2); // Set to midnight the day after tomorrow

  // Calculate the start of the week (Sunday)
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  // Calculate the start of next week (next Sunday)
  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setDate(startOfWeek.getDate() + 7);

  // Calculate the start of the month (first day of the month)
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate the start of the next month (first day of next month)
  const startOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
  );

  if (startTime === 'this_day') {
    return Prisma.sql`AND e."startDate" >= ${today} AND e."startDate" < ${tomorrow}`;
  } else if (startTime === 'tomorrow') {
    return Prisma.sql`AND e."startDate" >= ${tomorrow} AND e."startDate" < ${dayAfterTomorrow}`;
  } else if (startTime === 'this_week') {
    return Prisma.sql`AND e."startDate" >= ${startOfWeek} AND e."startDate" < ${startOfNextWeek}`;
  } else if (startTime === 'this_month') {
    return Prisma.sql`AND e."startDate" >= ${startOfMonth} AND e."startDate" < ${startOfNextMonth}`;
  } else return Prisma.sql``;
}

function getPriceType({ type }: { type: string }) {
  if (type === 'free') {
    return Prisma.sql`AND EXISTS (
      SELECT t."name" FROM "Ticket" t
      WHERE t."eventId" = e."id" AND t."type" = 'FREE'
    )`;
  } else if (type === 'paid') {
    return Prisma.sql`AND EXISTS (
      SELECT t."name" FROM "Ticket" t
      WHERE t."eventId" = e."id" AND t."type" = 'PAID'
    )`;
  } else return Prisma.sql``;
}

function getSortBy({ sortBy }: { sortBy: string }) {
  if (sortBy === 'startDate') {
    return Prisma.sql`e."startDate" ASC,`;
  } else if (sortBy === '-startDate') {
    return Prisma.sql`e."startDate" DESC,`;
  } else if (sortBy === 'name') {
    return Prisma.sql`e."name" ASC,`;
  } else if (sortBy === '-name') {
    return Prisma.sql`e."name" DESC,`;
  } else return Prisma.sql``;
}

function getPopular({ popular }: { popular: boolean }) {
  if (!popular) return Prisma.sql``;
  return Prisma.sql`e."views" DESC,`;
}

function getLimit({ pageSize }: { pageSize: number }) {
  if (!pageSize || pageSize <= 0) {
    return Prisma.sql``;
  }
  return Prisma.sql`LIMIT ${pageSize}`;
}

function getOffset({ page, pageSize }: { page: number; pageSize: number }) {
  if (!pageSize || pageSize <= 0 || !page || page <= 0) {
    return Prisma.sql``;
  }
  return Prisma.sql`OFFSET ${(page - 1) * pageSize}`;
}
