import { z } from 'zod';

export const QueryEventFormatSchema = z.enum(['online', 'inperson']).optional();
