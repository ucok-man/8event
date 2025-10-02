import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import AuthProvider from '@/context/auth-provider';
import QueryProvider from '@/context/query-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from 'next';
import { fontDMSans, fontMontserrat } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: '8Event',
  description: 'Event Platform',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html className="grainy-light">
      <head>
        <script
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={`${process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}`}
          defer
        ></script>
      </head>

      <QueryProvider>
        <AuthProvider>
          <body>
            <div
              className={`${fontDMSans.variable} ${fontMontserrat.variable} font-dmsans antialiased`}
            >
              <TooltipProvider>
                <main className="relative">{children}</main>
                <ReactQueryDevtools initialIsOpen={false} />
              </TooltipProvider>
              <Toaster />
            </div>
          </body>
        </AuthProvider>
      </QueryProvider>
    </html>
  );
}
