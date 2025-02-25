'use client';

import { usePaymentNotifContext } from '@/context/payment-notif-provider';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function PaymentToast() {
  const { isPaymentToastShowed } = usePaymentNotifContext();
  if (!isPaymentToastShowed) return null;
  return (
    <div className="fixed max-lg:w-full max-lg:top-20 lg:bottom-4 lg:right-4">
      <motion.div
        className="min-h-[72px] w-[82%] lg:w-[386px] rounded-lg grainy-light p-4 pr-6 shadow-lg border animate-alternate-grainy max-lg:mx-auto"
        style={{
          zIndex: 1000,
        }}
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: 400 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-1">
          <h2 className="text-sm font-bold">Payment Alert!</h2>
          <p className="text-xs text-gray-500">
            You have incomplete transaction,{' '}
            <Link
              className="text-brand-blue-600 underline underline-offset-2 cursor-pointer"
              href={'/payment'}
            >
              Proccess it Now!
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
