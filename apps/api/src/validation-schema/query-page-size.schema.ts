import { z } from 'zod';

export const QueryPageSizeSchema = z
  .string()
  .trim()
  .refine((arg) => !isNaN(Number(arg)), { message: 'Invalid number' }) // Ensure it's a valid number
  .transform((arg) => Number(arg))
  .pipe(z.number().min(1).max(100)) // Validate after transformation
  .optional();
