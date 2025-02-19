import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description: string;
  ctaTitle: string;
  containerClass?: string;
  ctaAction: () => void;
};

export default function EmptyState({
  title,
  description,
  ctaTitle,
  ctaAction,
  containerClass,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        containerClass,
      )}
    >
      <div className="space-y-4">
        {/* Icon */}
        <div className="text-6xl">
          <span role="img" aria-label={title}>
            🤷‍♂️
          </span>
        </div>
        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
          {description}
        </p>
        {/* Call-to-Action Button */}
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={ctaAction}
        >
          {ctaTitle}
        </button>
      </div>
    </div>
  );
}
