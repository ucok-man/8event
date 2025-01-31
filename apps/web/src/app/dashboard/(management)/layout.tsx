import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ManagementLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Navbar />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
