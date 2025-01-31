'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';
import ButtonRoseOutline from '../button-rose-outline';

type Props = {
  steps: {
    title: string;
    baseroute: string;
    link: string;
  }[];
};

export default function StepNavigationBackButton({ steps }: Props) {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(0);

  const getNextStepLinkOrFirstStep =
    steps[currentStep - 1]?.link || steps[0].link;

  useEffect(() => {
    setCurrentStep(steps.findIndex((step) => step.baseroute === currentPath));
  }, [currentPath, steps]);

  return (
    <div>
      <ButtonRoseOutline
        isLink
        icon={<ChevronLeft className="size-5" />}
        iconPosition="left"
        label="Go Back"
        link={getNextStepLinkOrFirstStep}
      />
    </div>
  );
}
