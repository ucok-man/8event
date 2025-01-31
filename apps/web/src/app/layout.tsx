import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import QueryProvider from '@/context/query-provider';
import type { Metadata } from 'next';
import { fontDMSans, fontMontserrat } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: '',
  description: 'Event Ticketing App',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <QueryProvider>
        <body>
          <div
            className={`${fontDMSans.variable} ${fontMontserrat.variable} font-dmsans antialiased`}
          >
            <TooltipProvider>
              <main className="relative">{children}</main>
            </TooltipProvider>
            <Toaster />
          </div>
        </body>
      </QueryProvider>
    </html>
  );
}
