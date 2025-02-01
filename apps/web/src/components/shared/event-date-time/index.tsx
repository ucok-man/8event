import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import DateRange from '../date-range';

type Props = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  containerClass?: string;
  iconClass?: string;
  visual: 'long' | 'short';
};

export default function EventDateTime(props: Props) {
  return (
    <>
      {props.visual === 'short' && (
        <div className={cn('flex items-start gap-3', props.containerClass)}>
          <Calendar
            className={cn('mt-1 h-5 w-5 text-brand-blue-500', props.iconClass)}
          />
          <div>
            <div className="font-medium">
              <DateRange startDate={props.startDate} endDate={props.endDate} />
            </div>
            <div className="text-gray-500">
              {props.startTime} - {props.endTime} WIB
            </div>
          </div>
        </div>
      )}

      {props.visual === 'long' && (
        <>
          <div className={cn('flex items-center gap-3', props.containerClass)}>
            <Calendar
              className={cn('h-5 w-5 text-brand-blue-500', props.iconClass)}
            />
            <DateRange startDate={props.startDate} endDate={props.endDate} />
          </div>
          <div className={cn('flex items-center gap-3', props.containerClass)}>
            <Clock
              className={cn('h-5 w-5 text-brand-blue-500', props.iconClass)}
            />
            <span className="text-gray-700">
              {props.startTime} - {props.endTime} WIB
            </span>
          </div>
        </>
      )}
    </>
  );
}
