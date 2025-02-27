import { z } from 'zod';

export const QueryPageSchema = z
  .string()
  .trim()
  .refine((arg) => !isNaN(Number(arg)), { message: 'Invalid number' }) // Ensure it's a valid number
  .transform((arg) => Number(arg))
  .pipe(z.number().min(1).max(1000)) // Validate after transformation
  .optional();
