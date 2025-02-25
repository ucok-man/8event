'use client';

import ButtonRose from '@/components/shared/button-rose';
import { useCreateEventContext } from '@/context/create-event-provider';
import { CalendarClockIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NavInfo from './navinfo';

export default function Navbar() {
  const router = useRouter();
  const { payload, setStorageToDefault } = useCreateEventContext();

  const onClick = () => {
    if (payload.createEvent.data.id) {
      setStorageToDefault();
    }
    router.push('/members/configure/upload-banner');
  };

  return (
    <div className="grainy-light border-b">
      <div className="relative">
        <div className="absolute inset-0 border backdrop-blur-xl" />

        <div className="relative flex h-20 items-center justify-between w-full px-8 lg:px-12">
          <div className="max-sm:hidden">
            <NavInfo />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <ButtonRose
                isLink={false}
                icon={<CalendarClockIcon className="size-5" />}
                iconPosition="left"
                label="Create Event"
                className="rounded-md font-medium py-2 text-sm hover:bg-brand-blue-600/95 bg-brand-blue-600"
                type="button"
                onClick={onClick}
              />
            </div>
            <div>[PROFILE]</div>
          </div>
        </div>
      </div>
    </div>
  );
}
