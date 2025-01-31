import { TimeType } from '@/components/shared/time-picker/time-type';
import { timeToFloat } from '@/lib/utils';
import { z } from 'zod';

const BaseTicketValidationSchema = {
  name: z.string().min(3).max(500),
  amount: z.number().min(1),
  description: z.string().min(10),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  startTime: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/, {
    message: 'Invalid time format. Please use HH:mm format.',
  }),
  endTime: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/, {
    message: 'Invalid time format. Please use HH:mm format.',
  }),
};

export const FreeTicketValidationSchema = z
  .object({
    ...BaseTicketValidationSchema,
    type: z.enum(['FREE']),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine(
    (data) => {
      const start = timeToFloat(data.startTime as TimeType) || 0;
      const end = timeToFloat(data.endTime as TimeType) || 0;
      return end > start;
    },
    { message: 'End time must be more than start time', path: ['endTime'] },
  );

export const PaidTicketValidationSchema = z
  .object({
    ...BaseTicketValidationSchema,
    type: z.enum(['PAID']),
    price: z.number().min(1),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine(
    (data) => {
      const start = timeToFloat(data.startTime as TimeType) || 0;
      const end = timeToFloat(data.endTime as TimeType) || 0;
      return end > start;
    },
    { message: 'End time must be more than start time', path: ['endTime'] },
  );

export type FreeTicket = z.infer<typeof FreeTicketValidationSchema>;
export type PaidTicket = z.infer<typeof PaidTicketValidationSchema>;
export const DEFAULT_FREE_TICKET = {
  type: 'FREE',
  name: '',
  amount: 1,
  description: '',
  endDate: '',
  endTime: '',
  startDate: '',
  startTime: '',
} as const;

export const DEFAULT_PAID_TICKET = {
  type: 'PAID',
  name: '',
  amount: 1,
  price: 0,
  description: '',
  endDate: '',
  endTime: '',
  startDate: '',
  startTime: '',
} as const;
