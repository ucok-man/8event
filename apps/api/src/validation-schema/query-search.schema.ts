import { z } from 'zod';

export const QuerySearchSchema = z.string().nonempty().optional();
