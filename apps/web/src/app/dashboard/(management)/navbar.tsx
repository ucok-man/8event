'use client';

import ButtonRose from '@/components/shared/button-rose';
import { CalendarClockIcon } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="flex w-full items-center justify-between border-b px-8 py-6">
      <div>[PAGE INFO]</div>
      <div className="flex items-center gap-4">
        <div>
          <ButtonRose
            isLink
            icon={<CalendarClockIcon className="size-5" />}
            iconPosition="left"
            label="Create Event"
            link="/dashboard/configure/upload-banner"
            className="rounded-md font-medium py-2 text-sm"
          />
        </div>
        <div>[PROFILE]</div>
      </div>
    </div>
  );
}
