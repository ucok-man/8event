import { cn } from '@/lib/utils';
import { Globe, MapPin } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  visual: 'short' | 'long';
  isOnline: boolean;
  placeName?: string;
  placeCity?: string;
  placeAddress?: string;
  platform?: ReactNode;
  containerClass?: string;
  iconClass?: string;
};

export default function EventLoaction(props: Props) {
  return (
    <div className={cn('flex items-start gap-3', props.containerClass)}>
      {props.isOnline ? (
        <>
          <Globe
            className={cn('mt-1 h-5 w-5 text-brand-blue-500', props.iconClass)}
          />
          <div className="text-gray-700">
            <div className="font-medium">Online Event</div>
            <div className="text-gray-500">Virtual Platform</div>
          </div>
        </>
      ) : (
        <>
          {props.visual === 'short' && (
            <>
              <MapPin
                className={cn(
                  'mt-1 h-5 w-5 text-brand-rose-500',
                  props.iconClass,
                )}
              />
              <div className="text-gray-700">
                <div className="font-medium">{props.placeName}</div>
                <div className="text-gray-500">{props.placeCity}</div>
              </div>
            </>
          )}

          {props.visual === 'long' && (
            <>
              <MapPin
                className={cn(
                  'mt-1 h-5 w-5 text-brand-rose-500',
                  props.iconClass,
                )}
              />
              <div className="text-gray-700">
                <div className="font-medium">{props.placeName}</div>
                <div className="text-gray-500">{props.placeAddress}</div>
                <div className="text-gray-500">{props.placeCity}</div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
