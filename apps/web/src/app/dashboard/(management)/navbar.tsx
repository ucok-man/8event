'use client';

import ButtonRose from '@/components/shared/button-rose';
import { CalendarClockIcon } from 'lucide-react';
import NavInfo from './navinfo';

export default function Navbar() {
  return (
    <div className="grainy-light border-b">
      <div className="relative">
        <div className="absolute inset-0 border backdrop-blur-xl" />

        <div className="relative flex h-20 items-center justify-between w-full px-8 lg:px-12">
          <div>
            <NavInfo />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <ButtonRose
                isLink
                icon={<CalendarClockIcon className="size-5" />}
                iconPosition="left"
                label="Create Event"
                link="/dashboard/configure/upload-banner"
                className="rounded-md font-medium py-2 text-sm hover:bg-brand-blue-600/95 bg-brand-blue-600"
              />
            </div>
            <div>[PROFILE]</div>
          </div>
        </div>
      </div>
    </div>
  );
}
