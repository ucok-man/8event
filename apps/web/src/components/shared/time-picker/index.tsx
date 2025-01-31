import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ClockIcon } from 'lucide-react';
import { useMemo } from 'react';
import { TimeType } from './time-type';

type Props = {
  onChange: (value: string) => void;
  value: TimeType;
  triggerClassName?: string;
};

export default function TimePicker({
  onChange,
  value,
  triggerClassName,
}: Props) {
  const TIME_OPTIONS: string[] = useMemo(() => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  }, []);

  return (
    <div className="w-full">
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger
          className={cn(
            'border-gray-200 focus:border-brand-rose-500 focus:ring-brand-rose-500 bg-background group',
            triggerClassName,
          )}
          triggerIcon={
            <ClockIcon
              className={cn(
                'h-4 w-4 opacity-30 mr-1 group-hover:opacity-50',
                value && 'opacity-50',
              )}
            />
          }
        >
          <SelectValue placeholder="Pick a time" />
        </SelectTrigger>
        <SelectContent>
          {TIME_OPTIONS.map((time, i) => (
            <SelectItem key={i} value={time}>
              {time} WIB
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
