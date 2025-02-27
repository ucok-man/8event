import { cn, formatRupiah } from '@/lib/utils';
import { CircleDollarSign } from 'lucide-react';

type Props = {
  price: number;
  containerClass?: string;
  iconClass?: string;
};

export default function EventTicketPrice({
  price,
  containerClass,
  iconClass,
}: Props) {
  return (
    <div className={cn('flex items-start gap-3', containerClass)}>
      <CircleDollarSign
        className={cn('mt-1 h-5 w-5 text-brand-rose-500', iconClass)}
      />
      <div className="text-gray-700">
        {price > 0 && (
          <>
            <div className="font-medium">{formatRupiah(price)}</div>
            <div className="text-gray-500 text-sm">Start from</div>
          </>
        )}
        {price <= 0 && (
          <>
            <div className="font-medium rounded-lg bg-brand-blue-600 text-white w-fit px-2 py-[0.5px] pb-[0.8px] text-sm">
              Free
            </div>
            <div className="text-gray-500 text-sm">Start from</div>
          </>
        )}
      </div>
    </div>
  );
}
