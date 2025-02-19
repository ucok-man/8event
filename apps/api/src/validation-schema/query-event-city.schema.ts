import { z } from 'zod';

export const QueryEventCitySchema = z.string().nonempty().optional();
