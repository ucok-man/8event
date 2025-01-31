import { TimeType } from '@/types/time-type';

export function timeToFloat(time: TimeType): number {
  const parts = time.split(':');
  if (parts.length < 2) return 0;
  return parseFloat(`${parts[0]}.${parts[1]}`);
}
