'use client';

import Timer from '@/components/shared/timer';
import { usePaymentNotifContext } from '@/context/payment-notif-provider';

export default function TimerPayment() {
  const { pendingTransaction } = usePaymentNotifContext();

  return (
    <div className="my-8">
      {pendingTransaction && <Timer target={pendingTransaction.expiredAt!} />}
    </div>
  );
}
