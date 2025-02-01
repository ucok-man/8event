import { Home, LayoutDashboard, Settings, User } from 'lucide-react';

export const SIDEBAR_LINK = [
  {
    grouplabel: 'Dashboard',
    items: [
      {
        label: 'Overview',
        link: '/dashboard/overview',
        icon: Home,
      },
      {
        label: 'My Events',
        link: '/dashboard/my-events',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    grouplabel: 'Account',
    items: [
      {
        label: 'Profile',
        link: '/dashboard/profile',
        icon: User,
      },
      {
        label: 'Settings',
        link: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];
