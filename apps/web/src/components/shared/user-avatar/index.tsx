'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuthContext } from '@/context/auth-provider';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { LogOut, Menu, Shield, Ticket, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProfileTab from './profile-tab';
import SecurityTab from './scurity-tab';
import VoucherTab from './voucher-tab';

export default function UserAvatar() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { user, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'voucher'
  >('profile');

  useEffect(() => {
    if (!modalOpen) {
      setSidebarOpen(false);
      setActiveTab('profile');
    }
  }, [modalOpen]);

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'voucher', label: 'My Voucher', icon: Ticket },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <Dialog open={modalOpen} onOpenChange={(val) => setModalOpen(val)}>
      <DialogTrigger asChild>
        <Avatar className="w-7 h-7 cursor-pointer border border-brand-blue-500">
          <AvatarImage src={user?.profilePicture} alt={user?.name} />
          <AvatarFallback>
            {user?.name
              .split(' ')
              .map((name) => name[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent
        className="max-w-none bg-transparent border-none shadow-none px-4 focus-visible:border-none focus-visible:ring-0 focus-visible:outline-none"
        closeClass="hidden"
      >
        <DialogTitle className="hidden" />

        <div className="relative overflow-x-hidden w-full max-w-2xl mx-auto rounded-lg shadow-lg grainy-light">
          {/* Content */}
          <div className="flex ">
            {/* Sidebar */}
            <div
              className={cn(
                'absolute inset-y-0 left-0 transform -translate-x-full opacity-0 transition-all duration-300 ease-in-out w-64 grainy-light border-r z-50',
                sidebarOpen && 'translate-x-0 opacity-100',
              )}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Account</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="size-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(
                          item.id as 'profile' | 'security' | 'voucher',
                        );
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        'flex items-center space-x-3 w-full p-2 rounded-md transition-colors',
                        activeTab === item.id
                          ? 'bg-brand-blue-800 text-white'
                          : 'hover:bg-brand-blue-100/60',
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative text-brand-blue-800">
              {/* Header */}
              <div className="flex items-center justify-between px-6 h-14 sticky top-0 bg-gradient-to-r from-blue-800 to-brand-blue-900 text-white">
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Menu className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-semibold">Account</h2>
                <button onClick={() => setModalOpen(false)}>
                  <X className="size-5" />
                </button>
              </div>

              {/* Content Tab */}
              <div className="p-6 h-[500px] text-gray-700">
                {activeTab === 'profile' && <ProfileTab />}

                {activeTab === 'voucher' && <VoucherTab />}

                {activeTab === 'security' && <SecurityTab />}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end px-6 h-14 sticky bottom-0 bg-gradient-to-r from-blue-800 to-brand-blue-900 text-white">
                <button
                  className="flex gap-3"
                  onClick={async () => {
                    setModalOpen(false);
                    await logout();
                    router.push('/');
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
