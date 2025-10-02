'use client';

import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { Separator } from '@/components/ui/separator';
// import { useAuthContext } from '@/context/auth-provider';
import PendingState from '@/components/shared/pending-state';
import { usePaymentNotifContext } from '@/context/payment-notif-provider';
import { useCustomer } from '@/hooks/use-customer';
import { CreditCard } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';
import PaymentProof from './payment-proof';
import TimerPayment from './timer-payment';

export default function PaymentPage() {
  const { status } = useCustomer();
  const { pendingTransaction, isPending } = usePaymentNotifContext();

  useEffect(() => {
    if (!isPending && !pendingTransaction) notFound();
  }, [pendingTransaction, isPending]);

  if (status === 'pending') return null;
  if (isPending) return <PendingState containerClass="min-h-screen" />;

  return (
    <MaxWidthWrapper className="min-h-screen flex flex-col size-full items-center justify-center my-44 md:my-12">
      <div className="max-w-6xl flex items-center w-full text-lg font-semibold space-x-2">
        <CreditCard className="size-6 text-brand-blue-800 shrink-0 mr-4" />
        <h2>Finalize your payment and submit your payment proof here.</h2>
      </div>
      <Separator className="my-8 max-w-6xl" />
      <div className="flex flex-col-reverse md:flex-row size-full max-w-6xl gap-8 grainy-light relative">
        {/* Upload Payment Proof */}
        <PaymentProof />
        {/* Snap Container */}
        <div id="snap-container" className="relative mx-auto z-0">
          <div className="absolute z-30 bg-white h-[24px] w-[320px] top-[26%]"></div>
          {/* <div className="absolute z-30 bg-white -translate-x-1/2 left-[50%] h-[50px] w-[100px] bottom-0 rounded-b-md"></div> */}
        </div>
      </div>

      <TimerPayment />
    </MaxWidthWrapper>
  );
}
