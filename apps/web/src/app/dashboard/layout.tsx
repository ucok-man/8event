import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div>
      <div className="absolute inset-0 w-full h-full -z-10 grainy-light" />
      {children}
    </div>
  );
}
