import { SidebarProvider } from '@/components/ui/sidebar';
import CreateEventContextProvider from '@/context/create-event-provider';
import React from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ManagementLayout({ children }: Props) {
  return (
    <CreateEventContextProvider>
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar />
          <div className="flex-1">
            <Navbar />
            <section className="px-8 lg:px-12 text-brand-blue-950">
              {children}
            </section>
          </div>
        </div>
      </SidebarProvider>
    </CreateEventContextProvider>
  );
}
