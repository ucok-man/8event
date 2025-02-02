import { CreateEventDTO } from '@/dto/create-event.dto';
import { GetAllEventDTO } from '@/dto/get-all-event.dto';
import { prismaclient } from '@/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { MetadataService } from './metadata.service';

export class EventService {
  readonly metadataService = new MetadataService();

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

  getAll = async (organizerId: string, dto: z.infer<typeof GetAllEventDTO>) => {
    const searchTerm = getSearch({ search: dto.search || '' });
    const eventType = getEventType({ type: dto.eventType || '' });
    const orderBy = getSortBy({ sortBy: dto.sortBy || '' });
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
      e."id", e."name", e."bannerUrl", e."description",
      e."startDate", e."endDate", e."startTime", e."endTime",
      e."isEventOnline", e."urlStreaming", e."placeName",
      e."placeCity", e."placeAddress", e."isPublished",
      ec."name" as "category" 
    FROM "Event" as e
    JOIN "EventCategory" as ec ON e."categoryId" = ec."id"
		WHERE e."organizerId" = ${organizerId} ${searchTerm} ${eventType}
		${orderBy}
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

function getSortBy({ sortBy }: { sortBy: string }) {
  if (sortBy === 'startDate') {
    return Prisma.sql`ORDER BY e."startDate" ASC, e."id" ASC`;
  } else if (sortBy === '-startDate') {
    return Prisma.sql`ORDER BY e."startDate" DESC, e."id" ASC`;
  } else if (sortBy === 'name') {
    return Prisma.sql`ORDER BY e."name" ASC, e."id" ASC`;
  } else if (sortBy === '-name') {
    return Prisma.sql`ORDER BY e."name" DESC, e."id" ASC`;
  } else return Prisma.sql`ORDER BY e."id" ASC`;
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
