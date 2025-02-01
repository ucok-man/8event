import { Icons } from '../icons';

type Props = {
  className?: string;
};

export default function Logo({}: Props) {
  return (
    <div className="flex flex-row items-center justify-center gap-2 relative bottom-1">
      <div className="transition-transform transform hover:scale-110 duration-200">
        <Icons.Logo className="size-12 text-indigo-600 drop-shadow-lg" />
      </div>
      <div className="text-4xl font-extrabold relative top-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-montserrat max-sm:hidden">
        <span className="uppercase tracking-wide">Event</span>
      </div>
    </div>
  );
}
