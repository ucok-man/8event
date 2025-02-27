'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';

type Props = {
  steps: {
    title: string;
    baseroute: string;
    link: string;
  }[];
};

export default function StepNavigation({ steps }: Props) {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const currentstep = steps.findIndex(
      (step) => step.baseroute === currentPath,
    );
    setCurrentStep(currentstep);
  }, [currentPath, steps]);

  if (currentPath === 'success') {
    return <div></div>;
  }

  return (
    <div>
      <div className="relative flex flex-col justify-between md:flex-row">
        {steps.map((step, i) => {
          const isNotLastElement = i !== steps.length - 1;
          const isLastElement = i === steps.length - 1;
          const isCurrentOrPreviousStep = i <= currentStep;
          const isCurrentStep = i === currentStep;

          return (
            <div
              key={step.link}
              className={cn(
                'group mb-4 flex items-center md:mb-0',
                isNotLastElement && 'w-full',
                isLastElement && 'shrink-0',
              )}
            >
              <Link
                href={step.link}
                className="z-20 flex items-center gap-3"
                prefetch={true}
              >
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full border transition-colors duration-200 shrink-0',
                    {
                      'border-none bg-brand-rose-600 text-brand-white-100':
                        isCurrentOrPreviousStep,
                      'border-brand-rose-600/75': !isCurrentOrPreviousStep,
                    },
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    'text-base transition-colors duration-200 font-semibold md:hidden lg:block',
                    isCurrentStep
                      ? 'text-brand-rose-600'
                      : isCurrentOrPreviousStep && 'text-brand-rose-600',
                  )}
                >
                  {step.title}
                </span>
              </Link>
              {isNotLastElement && (
                <div className="mx-2 h-px grow bg-red-500/20 max-md:hidden md:w-12 md:shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
