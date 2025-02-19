'use client';

import { cn } from '@/lib/utils';

type Props = {
  containerClass?: string;
  ctaTitle: string;
  ctaAction: () => void;
};

export default function ErrorState({
  ctaAction,
  ctaTitle,
  containerClass,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        containerClass,
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Error Icon */}
        <svg
          className="h-12 w-12 text-brand-rose-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-brand-rose-600">
          Oops, something went wrong!
        </h2>

        {/* Description */}
        <p className="text-base text-muted-foreground">
          We encountered some issue, please try again later!
        </p>

        {/* Retry Button */}
        <button
          onClick={ctaAction}
          className="mt-4 px-4 py-2 bg-brand-rose-600 text-white rounded-md shadow hover:bg-brand-rose-700 focus:outline-none focus:ring-2 focus:ring-brand-rose-500"
        >
          {ctaTitle}
        </button>
      </div>
    </div>
  );
}
