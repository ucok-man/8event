import { ReactNode } from 'react';
import Header from './header';

type Props = {
  children: ReactNode;
};

export default function EventDetailLayout({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
