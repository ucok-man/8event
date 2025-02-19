import { z } from 'zod';

export const QueryEventPriceTypeSchema = z.enum(['paid', 'free']).optional();
