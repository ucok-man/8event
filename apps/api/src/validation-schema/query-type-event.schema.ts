import { z } from 'zod';

export const QueryTypeEventSchema = z
  .enum(['active', 'draft', 'past'])
  .optional();
