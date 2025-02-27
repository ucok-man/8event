import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../icons';

export default function Notification() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <span className="absolute text-[10px] rounded-full font-mono bg-brand-rose-700 text-white p-0.5 px-1 font-bold -top-1 -left-1">
            10
          </span>
          <Icons.Bell className="size-7 text-white" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="grainy-light w-[320px] max-h-[320px] overflow-y-auto overflow-x-hidden">
        {/* List of notification */}
        <div>
          <h2>Complete Your Payment</h2>
        </div>
      </PopoverContent>
    </Popover>
  );
}
