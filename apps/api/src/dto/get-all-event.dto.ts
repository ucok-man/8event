import { QueryPageSizeSchema } from '@/validation-schema/query-page-size.schema';
import { QueryPageSchema } from '@/validation-schema/query-page.schema';
import { QuerySearchSchema } from '@/validation-schema/query-search.schema';
import { QuerySortByEventSchema } from '@/validation-schema/query-sortby-event.schema';
import { QueryTypeEventSchema } from '@/validation-schema/query-type-event.schema';
import { z } from 'zod';

export const GetAllEventDTO = z.object({
  organizerId: z.string().uuid().optional(),
  search: QuerySearchSchema,
  sortBy: QuerySortByEventSchema.default('startDate'),
  eventType: QueryTypeEventSchema.default('active'),
  page: QueryPageSchema.default('1'),
  pageSize: QueryPageSizeSchema.default('6'),
});
