import {
  EVENT_CATEGORY,
  EVENT_CATEGORY_MAP,
  EVENT_FORMAT_OPTION,
  EVENT_PRICE_TYPE_OPTION,
  EVENT_START_TIME_OPTION,
  SORTBY_OPTION,
} from '@/constants';
import {
  BannerError,
  BannerPayload,
  EventError,
  EventPayload,
  TicketError,
  TicketPayload,
} from '@/context/create-event-provider/type';
import { clsx, type ClassValue } from 'clsx';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';
import { DeepRequired } from 'utility-types';
import { ZodError } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
      !ticket.name ||
      !ticket.description ||
      !ticket.amount ||
      !ticket.startDate ||
      !ticket.endDate ||
      !ticket.startTime ||
      !ticket.endTime
    ) {
      return false;
    }

    if (ticket.type === 'FREE' && ticket.price) {
      return false;
    }

    if (ticket.type === 'PAID' && !ticket.price) {
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

export function checkQueryEventCategory(val: string) {
  return getEventCategory(val);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getOneFromQuery(
  key: string,
  queries: qs.ParsedQuery<string>,
): string {
  const q = queries[key];
  if (!q) return '';
  if (Array.isArray(q) && q[0]) return q[0];
  return q as string;
}

export function checkQuerySearch(input: string | string[] | undefined): string {
  if (!input) return '';
  if (Array.isArray(input)) return input[0] || '';
  return input;
}

export function checkQuerySortBy(
  input: string | string[] | undefined,
): (typeof SORTBY_OPTION)[number]['value'] {
  if (!input) return 'startDate';
  if (Array.isArray(input)) {
    input = input[0];
  }
  const safesort = SORTBY_OPTION.map((opt) => opt.value);
  const found = safesort.find((safeval) => safeval === input);
  if (!found) return 'startDate';
  return found;
}

export function checkQueryEventFormat(
  input: string | string[] | undefined,
): (typeof EVENT_FORMAT_OPTION)[number]['value'] | '' {
  if (!input) return '';
  if (Array.isArray(input)) {
    input = input[0];
  }
  const safesort = EVENT_FORMAT_OPTION.map((opt) => opt.value);
  const found = safesort.find((safeval) => safeval === input);
  if (!found) return '';
  return found;
}

export function checkQueryCity(input: string | string[] | undefined): string {
  if (!input) return '';
  if (Array.isArray(input)) return input[0] || '';
  return input;
}

export function checkQueryCategory(
  input: string | string[] | undefined,
): (typeof EVENT_CATEGORY)[number]['value'] | '' {
  if (!input) return '';
  if (Array.isArray(input)) {
    input = input[0];
  }
  const safesort = EVENT_CATEGORY.map((opt) => opt.value);
  const found = safesort.find((safeval) => safeval === input);
  if (!found) return '';
  return found;
}

export function checkQueryStartTime(
  input: string | string[] | undefined,
): (typeof EVENT_START_TIME_OPTION)[number]['value'] | '' {
  if (!input) return '';
  if (Array.isArray(input)) {
    input = input[0];
  }
  const safesort = EVENT_START_TIME_OPTION.map((opt) => opt.value);
  const found = safesort.find((safeval) => safeval === input);
  if (!found) return '';
  return found;
}

export function checkQueryPriceType(
  input: string | string[] | undefined,
): (typeof EVENT_PRICE_TYPE_OPTION)[number]['value'] | '' {
  if (!input) return '';
  if (Array.isArray(input)) {
    input = input[0];
  }
  const safesort = EVENT_PRICE_TYPE_OPTION.map((opt) => opt.value);
  const found = safesort.find((safeval) => safeval === input);
  if (!found) return '';
  return found;
}

export function checkQueryPage(input: string | string[] | undefined): number {
  if (!input) return 1;
  if (Array.isArray(input)) {
    input = input[0];
  }
  const p = Number(input);
  if (isNaN(p) || p < 1) return 1;
  return p;
}
