'use client';

import ButtonRose from '@/components/shared/button-rose';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { USER_POPOVER_LINK } from '@/constants';
import { useAuthContext } from '@/context/auth-provider';
import { useCreateEventContext } from '@/context/create-event-provider';
import { cn } from '@/lib/utils';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { CalendarClockIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NavInfo from './navinfo';

export default function Navbar() {
  const router = useRouter();
  const { payload, setStorageToDefault } = useCreateEventContext();
  const { status, user, logout } = useAuthContext();
  const currentpath = usePathname();

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

        <div className="relative flex h-20 items-center justify-between w-full px-6 sm:px-8 lg:px-12">
          <div className="max-md:flex max-md:gap-1 max-md:items-center">
            <SidebarTrigger className="md:hidden size-7 text-brand-blue-600" />
            <NavInfo className="max-sm:text-xl max-md:text-2xl whitespace-nowrap" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <ButtonRose
                isLink={false}
                icon={<CalendarClockIcon className="size-5 max-sm:hidden" />}
                iconPosition="left"
                label="Create Event"
                className="rounded-md font-medium py-1 sm:py-2 max-sm:px-2 text-sm hover:bg-brand-blue-600/95 bg-brand-blue-600 max-sm:gap-0"
                type="button"
                onClick={onClick}
              />
            </div>
            {status !== 'pending' && (
              <Popover>
                <PopoverTrigger>
                  <Avatar className="md:size-9 size-8 relative cursor-pointer border border-brand-blue-500">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name
                        .split(' ')
                        .map((name) => name[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-56 p-2 grainy-dark" align="end">
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar className="w-8 h-8 relative top-1 border border-brand-blue-500">
                      <AvatarImage
                        src={user?.profilePicture}
                        alt={user?.name}
                      />
                      <AvatarFallback>
                        {user?.name
                          .split(' ')
                          .map((name) => name[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <nav className="space-y-1 text-gray-500 font-medium">
                    {USER_POPOVER_LINK.map((val, idx) => (
                      <Link
                        key={idx}
                        href={val.link}
                        className={cn(
                          'flex items-center space-x-2 rounded-md p-2 hover:bg-brand-blue-100/60 hover:text-brand-blue-900 transition-colors duration-200 text-sm',
                          currentpath === val.link &&
                            'bg-brand-blue-100/60 text-brand-blue-900',
                        )}
                      >
                        <val.icon className="h-4 w-4" />
                        <span>{val.label}</span>
                      </Link>
                    ))}
                  </nav>
                  <Separator className="my-2" />
                  <button
                    onClick={async () => {
                      await logout();
                      localStorage.removeItem('create-event-step');
                      router.push('/members/auth/signin');
                    }}
                    className="flex w-full items-center space-x-2 rounded-md p-2 hover:bg-accent transition-colors duration-200 text-sm text-brand-blue-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
