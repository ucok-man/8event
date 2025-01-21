import type { Metadata } from 'next';
import { inter } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: '',
  description: 'Event Ticketing App',
};

type Props = {
  children: React.ReactNode
}

export default function RootLayout({children}: Props) {
  return (
    <div className={`${inter.className}`, "antialiased"}>{children}</div>
  )
}
