import { z } from 'zod';

export const QueryEventTypeSchema = z
  .enum(['active', 'draft', 'past'])
  .optional();
