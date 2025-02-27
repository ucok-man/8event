'use client';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

type Props = {
  profile?: string;
  name: string;
  explainer?: boolean;
  containerClass?: string;
  imageClass?: string;
  nameClass?: string;
};
// TODO: add hover tooltip to show rating
export default function EventCreatorAvatar({
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
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar
              className={cn('size-4 border border-brand-blue-600', imageClass)}
            >
              <AvatarImage src={profile} />
              <AvatarFallback>
                {name
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">{/* TODO: add creator ratings */}</div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <div className="flex flex-col">
          {explainer && <p className="text-xs italic">Created By</p>}
          <p className={cn('text-sm', nameClass)}>{name}</p>
        </div>
      </div>
    </div>
  );
}
