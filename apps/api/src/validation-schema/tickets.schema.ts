import {
  firstIsAfterEqualSecondDate,
  sourceTimeIsAfterTarget,
  targetIsAfterEqualCurrentDate,
} from '@/helpers/datetime-utils';
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
      .refine(
        (data) => firstIsAfterEqualSecondDate(data.endDate, data.startDate),
        {
          message: 'End date must be after or equal start date',
          path: ['endDate'],
        },
      )
      .refine((data) => targetIsAfterEqualCurrentDate(data.startDate), {
        message: 'Event start must be in the future',
        path: ['startDate'],
      })
      .refine(
        (data) =>
          sourceTimeIsAfterTarget(
            data.endTime as TimeType,
            data.startTime as TimeType,
          ),
        {
          message: 'End time must be after start time',
          path: ['endTime'],
        },
      ),
  )
  .nonempty();
