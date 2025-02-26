import Footer from '@/components/shared/footer';
import PaymentToast from '@/components/shared/payment-toast';
import PaymentNotifProvider from '@/context/payment-notif-provider';
import Navbar from './navbar';

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <PaymentNotifProvider>
      <div>
        <Navbar />
        <div>{children}</div>
        <Footer />
        <PaymentToast />
      </div>
    </PaymentNotifProvider>
  );
}
