import { currentDate, dateFrom } from '@/helpers/datetime-utils';
import { Prisma } from '@prisma/client';
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export function getOrganizerId({ organizerId }: { organizerId?: string }) {
  if (organizerId) {
    return Prisma.sql`AND e."organizerId" = ${organizerId}`;
  }
  return Prisma.sql``;
}

export function getSearch({ search }: { search: string }) {
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

export function getEventType({ type }: { type: string }) {
  const timetoday = format(currentDate(), 'HH:mm');
  const startofday = startOfDay(currentDate());

  if (type === 'active') {
    return Prisma.sql`AND e."isPublished" = ${true} AND (
      e."startDate" > ${startofday}
      OR (e."startDate" = ${startofday} AND e."startTime" > ${timetoday})
    )`;
  } else if (type === 'past') {
    return Prisma.sql`AND e."isPublished" = ${true} AND (
      e."startDate" < ${startofday} 
      OR (e."startDate" = ${startofday} AND e."startTime" < ${timetoday})
    )`;
  } else if (type === 'draft') {
    return Prisma.sql`AND e."isPublished" = ${false}`;
  } else return Prisma.sql``;
}

export function getEventFormat({ format }: { format: string }) {
  if (format === 'online') {
    return Prisma.sql`AND e."isEventOnline" = ${true}`;
  } else if (format === 'inperson') {
    return Prisma.sql`AND e."isEventOnline" = ${false}`;
  } else return Prisma.sql``;
}

export function getCity({ city }: { city: string }) {
  if (city != '') {
    const token = city
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');
    return Prisma.sql`AND (to_tsvector('simple', e."placeCity") @@ to_tsquery('simple', ${token}) OR ${token} = ${''})`;
  }
  return Prisma.sql``;
}

export function getCategory({ category }: { category: string }) {
  if (category === '') return Prisma.sql``;
  return Prisma.sql`AND ec."name" = ${category}`;
}

export function getStartTime({ startTime }: { startTime: string }) {
  const today = startOfDay(currentDate());
  const tomorrow = addDays(dateFrom(today), 1);
  const dayAfterTomorrow = addDays(dateFrom(tomorrow), 1);

  const startOfCurrentWeek = startOfWeek(currentDate(), { weekStartsOn: 1 });
  const startOfNextWeek = startOfWeek(addWeeks(currentDate(), 1), {
    weekStartsOn: 1,
  });

  const startOfCurrentMonth = startOfMonth(currentDate());
  const startOfNextMonth = startOfMonth(addMonths(currentDate(), 1));

  if (startTime === 'this_day') {
    return Prisma.sql`AND e."startDate" >= ${today} AND e."startDate" < ${tomorrow}`;
  } else if (startTime === 'tomorrow') {
    return Prisma.sql`AND e."startDate" >= ${tomorrow} AND e."startDate" < ${dayAfterTomorrow}`;
  } else if (startTime === 'this_week') {
    return Prisma.sql`AND e."startDate" >= ${startOfCurrentWeek} AND e."startDate" < ${startOfNextWeek}`;
  } else if (startTime === 'this_month') {
    return Prisma.sql`AND e."startDate" >= ${startOfCurrentMonth} AND e."startDate" < ${startOfNextMonth}`;
  } else return Prisma.sql``;
}

export function getPriceType({ type }: { type: string }) {
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

export function getSortBy({ sortBy }: { sortBy: string }) {
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

export function getPopular({ popular }: { popular: boolean }) {
  if (!popular) return Prisma.sql``;
  return Prisma.sql`e."views" DESC,`;
}

export function getLimit({ pageSize }: { pageSize: number }) {
  if (!pageSize || pageSize <= 0) {
    return Prisma.sql``;
  }
  return Prisma.sql`LIMIT ${pageSize}`;
}

export function getOffset({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  if (!pageSize || pageSize <= 0 || !page || page <= 0) {
    return Prisma.sql``;
  }
  return Prisma.sql`OFFSET ${(page - 1) * pageSize}`;
}
