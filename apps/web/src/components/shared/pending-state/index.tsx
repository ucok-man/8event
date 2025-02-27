import { cn } from '@/lib/utils';

type Props = {
  containerClass?: string;
};

export default function PendingState({ containerClass }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        containerClass,
      )}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Spinner */}
        <svg
          className="animate-spin h-16 w-16 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>

        {/* Loading Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Loading Data
        </h2>

        {/* Loading Description */}
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
          Please wait while we prepare your data. This may take a moment...
        </p>
      </div>
    </div>
  );
}
