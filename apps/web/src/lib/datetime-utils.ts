import { TimeType } from '@/components/shared/time-picker/time-type';
import { format, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';

/* ---------------------------------------------------------------- */
/*                               TIME                               */
/* ---------------------------------------------------------------- */

export function timeToFloat(time: TimeType): number {
  const parts = time.split(':');
  if (parts.length < 2) return 0;
  return parseFloat(`${parts[0]}.${parts[1]}`);
}

export function currentTimeIsBefore(target: TimeType) {
  const currentTime = format(new Date(), 'HH:mm');
  const ct = timeToFloat(currentTime as TimeType);
  return ct < timeToFloat(target);
}

export function sourceTimeIsBeforeTarget(src: TimeType, target: TimeType) {
  return timeToFloat(src) < timeToFloat(target);
}

export function currentTimeIsAfterEqual(target: TimeType) {
  const currentTime = format(new Date(), 'HH:mm');
  const ct = timeToFloat(currentTime as TimeType);
  return ct >= timeToFloat(target);
}

export function sourceTimeIsAfterTarget(src: TimeType, target: TimeType) {
  return timeToFloat(src) > timeToFloat(target);
}

/* ---------------------------------------------------------------- */
/*                               DATE                               */
/* ---------------------------------------------------------------- */

export function currentDateIsBefore(target: string | Date) {
  return isBefore(startOfDay(new Date()), startOfDay(new Date(target)));
}

export function currentDateIsAfterEqual(target: string | Date) {
  return (
    isSameDay(new Date(), new Date(target)) ||
    isAfter(startOfDay(new Date()), startOfDay(new Date(target)))
  );
}

export function sourceDateIsBeforeTarget(
  src: string | Date,
  target: string | Date,
) {
  return isBefore(startOfDay(new Date(src)), startOfDay(new Date(target)));
}

export function sourceDateIsAfterTarget(
  src: string | Date,
  target: string | Date,
) {
  return isAfter(startOfDay(new Date(src)), startOfDay(new Date(target)));
}

export function sourceDateIsAfterEqualTarget(
  src: string | Date,
  target: string | Date,
) {
  return (
    isAfter(startOfDay(new Date(src)), startOfDay(new Date(target))) ||
    isSameDay(new Date(src), new Date(target))
  );
}

export function targetIsAfterEqualCurrentDate(target: string | Date) {
  return isSameDay(new Date(), new Date(target)) || isAfter(target, new Date());
}
