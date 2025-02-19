'use client';

import { cn } from '@/lib/utils';

type Props = {
  profile?: string;
  name: string;
  explainer?: boolean;
  containerClass?: string;
  imageClass?: string;
  nameClass?: string;
};
// TODO: add hover tooltip to show rating
export default function OrganizerBadgeTooltip({
  profile,
  name,
  containerClass,
  imageClass,
  nameClass,
  explainer = false,
}: Props) {
  return (
    <div
      className={cn(
        'flex gap-2 items-center place-content-end',
        containerClass,
      )}
    >
      <div className="flex items-center gap-2">
        <img
          src={profile ? profile : '/avatar.png'}
          alt="avatar"
          className={cn(
            'rounded-full size-4 overflow-hidden object-center border border-brand-blue-600',
            imageClass,
          )}
        />
        <div className="flex flex-col">
          {explainer && <p className="text-xs italic">Created By</p>}
          <p className={cn('text-sm', nameClass)}>{name}</p>
        </div>
      </div>
    </div>
  );
}
