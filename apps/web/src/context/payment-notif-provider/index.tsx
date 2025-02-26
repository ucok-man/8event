/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { toast } from '@/hooks/use-toast';
import { GetTransactionByUserId } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// import { usePathname } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  // useEffect,
  useRef,
  useState,
} from 'react';
import { useAuthContext } from '../auth-provider';
import { queryclient } from '../query-provider';

export type PaymentNotifContextValue = {
  isPending: boolean;
  isPaymentToastShowed: boolean;
  showPaymentToast: () => void;
  closePaymentToast: () => void;
  updatePaymentNotif: () => void;
  showsnap: () => void;
  hidesnap: () => void;

  pendingTransaction: GetTransactionByUserId['transaction'] | null;
};

const PaymentNotifContext = createContext<PaymentNotifContextValue | null>(
  null,
);

type Props = {
  children: ReactNode;
};

export default function PaymentNotifProvider({ children }: Props) {
  const { user, apiclient, status } = useAuthContext();

  const snapinit = useRef<boolean>(false);
  // const pathname = usePathname();
  const [isPaymentToastShowed, setIsPaymentToastShowed] =
    useState<boolean>(false);
  const [pendingTransaction, setPendingTransaction] = useState<
    GetTransactionByUserId['transaction'] | null
  >(null);

  // get transaction
  const { error, isPending, refetch } = useQuery({
    queryKey: ['payment-notif', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await apiclient.get(
        `/transactions/uid/${user?.id}?status=WAITING_PAYMENT`,
      );
      if (data.transaction) {
        setPendingTransaction(data.transaction);
        setIsPaymentToastShowed(true);
      }
      if (!data.transaction) {
        setPendingTransaction(null);
        setIsPaymentToastShowed(false);
      }

      console.log({ log: 'payment notif is runing', data: data });

      return data.transaction as GetTransactionByUserId['transaction'];
    },
    enabled: status !== 'pending', // This ensures the query runs only when user is loaded
  });

  if (error && error instanceof AxiosError) {
    if (error.status === 404 && pendingTransaction && isPaymentToastShowed) {
      setPendingTransaction(null);
      setIsPaymentToastShowed(false);
    }

    if (error.status! >= 500) {
      toast({
        title: 'Failed to Get Transaction Data',
        description: `Failed to get transaction with user id ${user?.id}`,
        variant: 'destructive',
      });
    }
  }

  // update transaction isPayed
  const { mutate: updateTransaction } = useMutation({
    mutationFn: async (transactionId: string) => {
      await apiclient.patch(`/transactions/id/${transactionId}`, {
        isPayed: true,
      });
    },

    onSuccess: () => updatePaymentNotif(),
    onError: () => {
      toast({
        title: 'Failed to Update Transaction Data',
        description: `Failed to update transaction state`,
        variant: 'destructive',
      });
    },
  });

  const updatePaymentNotif = useCallback(() => {
    queryclient.invalidateQueries({
      queryKey: ['payment-notif'],
    });
    refetch();
  }, [refetch]);

  // useEffect(() => {
  //   if (isPaymentToastShowed) {
  //     updatePaymentNotif();
  //   }
  // }, [pathname, isPaymentToastShowed, updatePaymentNotif]);

  // useEffect(() => {
  //   if (!isPending && data && !error) {
  //     setIsPaymentToastShowed(true);
  //     setPendingTransaction(data);
  //   }

  //   if (!isPending && !error && !data) {
  //     setIsPaymentToastShowed(false);
  //     setPendingTransaction(null);
  //   }
  // }, [data, isPending, error]);

  const showPaymentToast = useCallback(() => {
    setIsPaymentToastShowed(true);
  }, []);

  const closePaymentToast = useCallback(() => {
    setIsPaymentToastShowed(false);
  }, []);

  const showsnap = useCallback(() => {
    if (snapinit.current === false) {
      window.snap.embed(pendingTransaction?.snaptoken, {
        embedId: 'snap-container',
        onSuccess: function (result: any) {
          updateTransaction(result.order_id);
          updatePaymentNotif();
        },
      });
      snapinit.current = true;
    }
  }, [pendingTransaction]);

  const hidesnap = useCallback(() => {
    if (snapinit.current === true) {
      window.snap.hide();
      snapinit.current = false;
    }
  }, []);

  console.log({
    log: 'Current state of transaction context',
    state: pendingTransaction,
  });

  return (
    <PaymentNotifContext.Provider
      value={{
        isPending,
        showsnap,
        hidesnap,
        isPaymentToastShowed,
        showPaymentToast,
        closePaymentToast,
        updatePaymentNotif,
        pendingTransaction,
      }}
    >
      {children}
    </PaymentNotifContext.Provider>
  );
}

export function usePaymentNotifContext() {
  const context = useContext(PaymentNotifContext);
  if (!context) {
    throw new Error(
      'usePaymentNotifContext must be used within an PaymentNotifProvider',
    );
  }
  return context;
}
