'use client';

import Logo from '@/components/shared/logo';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SIDEBAR_LINK } from './constant';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SidebarContainer>
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <SidebarMenuItem className="h-20 overflow-hidden border-b grainy-dark">
            <div className="relative flex h-full w-full items-center justify-center">
              <Logo />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="grainy-dark">
        {SIDEBAR_LINK.map((group, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupLabel className="font-semibold tracking-tight text-foreground/70 text-sm">
              {group.grouplabel}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, j) => {
                  const isActive = pathname.startsWith(item.link);

                  return (
                    <SidebarMenuItem key={j}>
                      <SidebarMenuButton
                        onClick={() => router.push(item.link)}
                        className={cn(
                          'transition-all duration-200 ease-in-out hover:bg-brand-blue-100/50 text-muted-foreground',
                          isActive &&
                            'bg-brand-blue-100/60 text-brand-blue-900',
                        )}
                      >
                        <item.icon
                          className={cn(
                            'mr-3 size-5 transition-transform duration-200',
                          )}
                        />
                        <span className={cn('font-medium text-base')}>
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </SidebarContainer>
  );
}
