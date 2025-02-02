import { z } from 'zod';

export const QuerySortByEventSchema = z
  .enum(['name', '-name', 'startDate', '-startDate'])
  .optional();
