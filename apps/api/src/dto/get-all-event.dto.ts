import { QueryEventCategorySchema } from '@/validation-schema/query-event-category.schema';
import { QueryEventCitySchema } from '@/validation-schema/query-event-city.schema';
import { QueryEventFormatSchema } from '@/validation-schema/query-event-format.schema';
import { QueryEventPriceTypeSchema } from '@/validation-schema/query-event-price-type.schema';
import { QueryEventStartTimeSchema } from '@/validation-schema/query-event-start-time.schema';
import { QueryEventTypeSchema } from '@/validation-schema/query-event-type.schema';
import { QueryPageSizeSchema } from '@/validation-schema/query-page-size.schema';
import { QueryPageSchema } from '@/validation-schema/query-page.schema';
import { QuerySearchSchema } from '@/validation-schema/query-search.schema';
import { QuerySortByEventSchema } from '@/validation-schema/query-sortby-event.schema';
import { z } from 'zod';

export const GetAllEventDTO = z.object({
  organizerId: z.string().uuid().optional(),
  search: QuerySearchSchema,
  eventType: QueryEventTypeSchema.default('active'),
  eventFormat: QueryEventFormatSchema,
  city: QueryEventCitySchema,
  category: QueryEventCategorySchema,
  startTime: QueryEventStartTimeSchema,
  priceType: QueryEventPriceTypeSchema,
  sortBy: QuerySortByEventSchema.default('startDate'),
  page: QueryPageSchema.default('1'),
  pageSize: QueryPageSizeSchema.default('6'),
  popular: z
    .enum(['true', 'false'])
    .transform((arg) => {
      if (arg === 'true') return true;
      if (arg === 'false') return false;
    })
    .optional()
    .default('false'),
});
