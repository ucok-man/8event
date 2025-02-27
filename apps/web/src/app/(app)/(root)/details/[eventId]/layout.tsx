import TransactionContextProvider from '@/context/transaction-provider';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function EventDetailLayout({ children }: Props) {
  return <TransactionContextProvider>{children}</TransactionContextProvider>;
}
