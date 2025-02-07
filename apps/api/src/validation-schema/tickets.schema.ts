import { timeToFloat } from '@/helpers/time-to-float';
import { TimeType } from '@/types/time-type';
import { z } from 'zod';

export const TicketsSchema = z
  .array(
    z
      .object({
        id: z.string().uuid().optional(),
        type: z.enum(['PAID', 'FREE']),
        name: z.string().min(3).max(250),
        amount: z.number().min(1),
        description: z.string().min(10),
        price: z.number().min(1).optional().nullable(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        startTime: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/, {
          message: 'Invalid time format. Please use HH:mm format.',
        }),
        endTime: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/, {
          message: 'Invalid time format. Please use HH:mm format.',
        }),
      })
      .refine(
        (data) =>
          (data.type === 'FREE' && !data.price) ||
          (data.type === 'PAID' && data.price),
        {
          message:
            'Free ticket should not include price, and paid ticket should specify the price',
          path: ['price'],
        },
      )
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
      ),
  )
  .nonempty();
