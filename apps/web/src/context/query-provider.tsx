'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const queryclient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      gcTime: 0,
    },
  },
});

export const refetchNow = (querykey: string[]) => {
  querykey.forEach((key) => {
    queryclient.invalidateQueries({
      queryKey: [key],
    });
    queryclient.refetchQueries({
      queryKey: [key],
    });
  });
};

type Props = {
  children: React.ReactNode;
};

export default function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
  );
}
