import { z } from 'zod';

export const QueryEventStartTimeSchema = z
  .enum(['this_day', 'tomorrow', 'this_week', 'this_month'])
  .optional();
