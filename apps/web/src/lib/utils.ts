import { TimeType } from '@/components/shared/time-picker/time-type';
import {
  BannerError,
  BannerPayload,
  EventError,
  EventPayload,
  TicketError,
  TicketPayload,
} from '@/context/create-event-provider/type';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DeepRequired } from 'utility-types';
import { ZodError } from 'zod';
import { EVENT_CATEGORY_MAP } from './category-map';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeToFloat(time: TimeType): number {
  const parts = time.split(':');
  if (parts.length < 2) return 0;
  return parseFloat(`${parts[0]}.${parts[1]}`);
}

export function toTitleCase(text: string): string {
  return text
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function toErrForm(zoderr: ZodError) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errform: Record<string, any> = {};
  for (const issue of zoderr.issues) {
    errform[issue.path[0]] = {
      type: 'onChange',
      message: issue.message,
    };
  }
  return errform;
}

export function validTicket(param: {
  data?: TicketPayload;
  error?: TicketError;
}): param is {
  data: DeepRequired<NonNullable<TicketPayload>>;
  error: Record<string, object> | undefined;
} {
  const { data, error } = param;

  if (!Array.isArray(data) || data.length < 1) {
    return false;
  }

  for (const ticket of data) {
    if (
      typeof ticket.name !== 'string' ||
      typeof ticket.description !== 'string' ||
      typeof ticket.amount !== 'number' ||
      typeof ticket.startDate !== 'string' ||
      typeof ticket.endDate !== 'string' ||
      typeof ticket.startTime !== 'string' ||
      typeof ticket.endTime !== 'string'
    ) {
      return false;
    }

    if (ticket.type === 'FREE' && typeof ticket.price !== 'undefined') {
      return false;
    }

    if (ticket.type === 'PAID' && typeof ticket.price !== 'number') {
      return false;
    }
  }

  const hasErr = Object.keys(error || {}).length > 0;
  if (hasErr) return false;

  return true;
}

export function validEvent(param: {
  data?: EventPayload;
  error?: EventError;
}): param is {
  data: DeepRequired<NonNullable<EventPayload>>;
  error: object | undefined;
} {
  const { data, error } = param;

  const haserror = Object.keys(error || {}).length > 0;
  if (haserror) return false;

  if (
    !data ||
    !data.name ||
    !data.category ||
    !data.startDate ||
    !data.endDate ||
    !data.startTime ||
    !data.endTime ||
    !data.description
  ) {
    return false;
  }

  if (data.isEventOnline && !data.urlStreaming) {
    return false;
  }
  if (
    !data.isEventOnline &&
    (!data.placeName || !data.placeCity || !data.placeAddress)
  ) {
    return false;
  }
  return true;
}

export function validbanner(param: {
  data?: BannerPayload;
  error?: BannerError;
}): param is {
  data: DeepRequired<NonNullable<BannerPayload>>;
  error: undefined;
} {
  const { data, error } = param;

  if (!data || !data.bannerUrl) {
    return false;
  }

  const haserror = Object.keys(error || {}).length > 0;
  if (haserror) return false;

  return true;
}

export function getEventCategory(key: string) {
  return EVENT_CATEGORY_MAP[key as keyof typeof EVENT_CATEGORY_MAP]
    ? EVENT_CATEGORY_MAP[key as keyof typeof EVENT_CATEGORY_MAP]
    : '';
}
