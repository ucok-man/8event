import { TimeType } from '@/components/shared/time-picker/time-type';
import { timeToFloat } from '@/lib/utils';
import { z } from 'zod';

export const CreateEventSchema = z
  .object({
    name: z.string().trim().min(3).max(500),
    category: z.string().trim().nonempty(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    startTime: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/, {
      message: 'Invalid time format. Please use HH:mm format.',
    }),
    endTime: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/, {
      message: 'Invalid time format. Please use HH:mm format.',
    }),
    isEventOnline: z.boolean(),
    urlStreaming: z.string().trim().url().optional(),
    placeName: z.string().trim().nonempty().optional(),
    placeAddress: z.string().trim().nonempty().optional(),
    placeCity: z.string().trim().nonempty().optional(),
    description: z
      .string()
      .trim()
      .min(10)
      .refine((arg) => arg !== '<p></p>', { message: 'Required' }),
  })
  .refine(
    (data) => {
      if (data.isEventOnline) return !data.placeName;
      return true;
    },
    {
      message: 'Should be null if event is online',
      path: ['placeName'],
    },
  )
  .refine(
    (data) => {
      if (data.isEventOnline) return !data.placeAddress;
      return true;
    },
    {
      message: 'Should be null if event is online',
      path: ['placeAddress'],
    },
  )
  .refine(
    (data) => {
      if (data.isEventOnline) return !data.placeCity;
      return true;
    },
    {
      message: 'Should be null if event is online',
      path: ['placeCity'],
    },
  )
  .refine(
    (data) => {
      if (!data.isEventOnline) return !data.urlStreaming;
      return true;
    },
    {
      message: 'Should be null if event is in place',
      path: ['urlStreaming'],
    },
  )
  .refine(
    (data) => {
      if (data.isEventOnline) return data.urlStreaming;
      return true;
    },
    {
      message: 'Required',
      path: ['urlStreaming'],
    },
  )
  .refine(
    (data) => {
      if (!data.isEventOnline) return data.placeName;
      return true;
    },
    {
      message: 'Required',
      path: ['placeName'],
    },
  )
  .refine(
    (data) => {
      if (!data.isEventOnline) return data.placeAddress;
      return true;
    },
    {
      message: 'Required',
      path: ['placeAddress'],
    },
  )
  .refine(
    (data) => {
      if (!data.isEventOnline) return data.placeCity;
      return true;
    },
    {
      message: 'Required',
      path: ['placeCity'],
    },
  )
  .refine(
    (data) => {
      return data.startDate <= data.endDate;
    },
    { message: 'End date is behind start date', path: ['endDate'] },
  )
  .refine(
    (data) => {
      const start = timeToFloat(data.startTime as TimeType) || 0;
      const end = timeToFloat(data.endTime as TimeType) || 0;
      return end > start;
    },
    { message: 'End time must be more than start time', path: ['endTime'] },
  );
