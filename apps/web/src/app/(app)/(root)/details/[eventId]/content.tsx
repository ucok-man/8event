'use client';

import ErrorState from '@/components/shared/error-state';
import PendingState from '@/components/shared/pending-state';
import { useTransactionContext } from '@/context/transaction-provider';
import { notFound, useRouter } from 'next/navigation';
import EventDetail from './event-detail';
import FloatingCart from './floating-cart';
import FloatingCartMobile from './floating-cart-mobile';

export default function Content() {
  const router = useRouter();
  const transactionctx = useTransactionContext();
  const { data, dataPending, dataError } = transactionctx;

  if (dataPending) return <PendingState containerClass="min-h-screen" />;
  if (dataError && dataError.status === 404) return notFound();
  if (dataError && dataError.status !== 404) {
    return (
      <ErrorState
        containerClass="min-h-screen"
        ctaTitle="Go Home"
        ctaAction={() => router.push('/')}
      />
    );
  }

  return (
    <div className="flex size-full flex-row lg:gap-6">
      <EventDetail event={data!.event} {...transactionctx} />

      <div className="hidden lg:block">
        <FloatingCart {...transactionctx} />
      </div>
      <div className="block lg:hidden">
        <FloatingCartMobile {...transactionctx} />
      </div>
    </div>
  );
}
