import { cn } from '@/lib/utils';
import { Icons } from '../icons';

type Props = {
  textClass?: string;
};

export default function Logo({ textClass }: Props) {
  return (
    <div className="relative bottom-1 flex flex-row items-center justify-center gap-2">
      <div className="transition-transform duration-200 hover:scale-110">
        <Icons.Logo className="size-12 text-indigo-600 drop-shadow-lg" />
      </div>
      <div
        className={cn(
          'text-4xl font-extrabold relative top-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-montserrat max-sm:hidden',
          textClass,
        )}
      >
        <span className="uppercase tracking-wide">Event</span>
      </div>
    </div>
  );
}

// export const Logo {

// }
