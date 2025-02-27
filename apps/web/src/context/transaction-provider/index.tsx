/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

// import { useUser } from '@/hooks/use-user';
// import { apiclient } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import {
  CheckoutResponse,
  GetEventByIdResponse,
  GetUserByIdResponse,
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Confetti from 'react-dom-confetti';
import { v4 as uuid } from 'uuid';
import { useAuthContext } from '../auth-provider';
import { usePaymentNotifContext } from '../payment-notif-provider';
import { refetchNow } from '../query-provider';

export type TransactionStateType = {
  id: string;
  priceBeforeDiscount: number;
  priceAfterDiscount: number;
  eventId: string;
  buyerId: string;
  totalTicketQuantity: number;
  tickets: {
    transactionId: string;
    ticketId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalDiscount: number;
  usedPoints?: number;
  voucherId?: string;
};

export type TransactionContextType = {
  data?: {
    event: GetEventByIdResponse['event'];
    user: GetUserByIdResponse['user'];
  };

  dataError?: AxiosError;
  dataPending: boolean;
  create: () => void;
  createError?: AxiosError;
  createPending: boolean;

  payload: TransactionStateType;
  addTicket: (ticketId: string) => void;
  substractTicket: (ticketId: string) => void;
  addVoucher: (voucherId: string) => void;
  cancelVoucher: () => void;
  addPointBalance: (amount: number) => void;
  cancelPointBalance: () => void;

  disablePointBalance: boolean;
  disableVoucher: boolean;
};

export const TransactionContext = createContext<TransactionContextType | null>(
  null,
);

export default function TransactionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { updatePaymentNotif } = usePaymentNotifContext();
  const { user, apiclient, status } = useAuthContext();
  const eventId = useParams().eventId as string;
  const transactionId = uuid();
  const [disablePointBalance, setDisablePointBalance] = useState(false);
  const [disableVoucher, setDisableVoucher] = useState(false);

  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    apiclient.patch(`events/id/${eventId}/increment-view`);
  }, []);

  const {
    data,
    error: dataError,
    isPending: dataPending,
  } = useQuery({
    queryKey: ['transaction-context', 'get-event-by-id', eventId, user?.id],
    queryFn: async () => {
      if (user) {
        const [fetchevent, fetchuser] = await Promise.all([
          apiclient.get(`/events/id/${eventId}`),
          apiclient.get(`/users/me`),
        ]);

        return {
          event: fetchevent.data.event as GetEventByIdResponse['event'],
          user: fetchuser.data.user as GetUserByIdResponse['user'],
        };
      } else {
        const fetchevent = await apiclient.get(`/events/id/${eventId}`);
        return {
          event: fetchevent.data.event as GetEventByIdResponse['event'],
          user: {
            pointBalance: 0,
            vouchers: [],
            createdAt: '',
            email: '',
            id: '',
            name: '',
            referralCode: '',
            role: 'CUSTOMER',
            updatedAt: '',
            profilePicture: '',
            referredById: '',
            rating: 0,
          } as GetUserByIdResponse['user'],
        };
      }
    },
    enabled: status !== 'pending',
  });

  const [transactionPayload, setTransactionPayload] =
    useState<TransactionStateType>({
      id: transactionId,
      priceAfterDiscount: 0,
      priceBeforeDiscount: 0,
      eventId: eventId,
      buyerId: user?.id || '',
      totalTicketQuantity: 0,
      tickets: [],
      totalDiscount: 0,
    });

  useEffect(() => {
    setTransactionPayload((prev) => ({ ...prev, buyerId: user?.id || '' }));
  }, [user?.id]);

  const addTicket = useCallback(
    (ticketId: string) => {
      if (dataPending || !data || !data.user) return;
      if (transactionPayload.totalTicketQuantity >= 5) return;

      let tickets = [...transactionPayload.tickets];
      let matchticket = tickets.find(
        (payload) => payload.ticketId === ticketId,
      );
      if (!matchticket) {
        const ticket = data.event.tickets.find((t) => t.id === ticketId);
        matchticket = {
          price: ticket!.price || 0,
          quantity: 1,
          ticketId: ticket!.id,
          transactionId: transactionId,
          name: ticket!.name,
        };
        tickets.push(matchticket);
      } else {
        if (matchticket.quantity >= 5) return;
        matchticket.quantity += 1;
        tickets = tickets.map((ticket) =>
          ticket.ticketId === matchticket!.ticketId ? matchticket! : ticket,
        );
      }

      const priceBeforeDiscount =
        transactionPayload.priceBeforeDiscount + matchticket.price;
      const priceAfterDiscount =
        priceBeforeDiscount - transactionPayload.totalDiscount;
      const totalTicketQuantity = transactionPayload.totalTicketQuantity + 1;

      setTransactionPayload((prev) => ({
        ...prev,
        priceBeforeDiscount: priceBeforeDiscount,
        priceAfterDiscount: priceAfterDiscount,
        totalTicketQuantity: totalTicketQuantity,
        tickets: tickets,
      }));
    },
    [transactionPayload, dataPending, data, transactionId],
  );

  const substractTicket = useCallback(
    (ticketId: string) => {
      if (dataPending || !data || !data.user) return;
      if (transactionPayload.totalTicketQuantity <= 0) return;

      let tickets = [...transactionPayload.tickets];
      const matchticket = tickets.find(
        (payload) => payload.ticketId === ticketId,
      );
      if (!matchticket) return;

      matchticket.quantity -= 1;
      if (matchticket.quantity <= 0) {
        tickets = tickets.filter((ticket) => ticket.ticketId !== ticketId);
      } else {
        tickets = tickets.map((ticket) =>
          ticket.ticketId === matchticket.ticketId ? matchticket : ticket,
        );
      }

      const priceBeforeDiscount =
        transactionPayload.priceBeforeDiscount - matchticket.price;

      let totalDiscount = transactionPayload.totalDiscount;
      let voucherId = transactionPayload.voucherId;
      let usedPoints = transactionPayload.usedPoints;

      if (priceBeforeDiscount < totalDiscount) {
        totalDiscount = 0;
        voucherId = undefined;
        usedPoints = undefined;
      }

      const priceAfterDiscount = priceBeforeDiscount - totalDiscount;
      const totalTicketQuantity = transactionPayload.totalTicketQuantity - 1;

      setTransactionPayload((prev) => ({
        ...prev,
        priceBeforeDiscount: priceBeforeDiscount,
        priceAfterDiscount: priceAfterDiscount,
        totalTicketQuantity: totalTicketQuantity,
        tickets: tickets,
        totalDiscount: totalDiscount,
        voucherId: voucherId,
        usedPoints: usedPoints,
      }));
    },
    [transactionPayload, dataPending, data],
  );

  const addVoucher = useCallback(
    (voucherId: string) => {
      if (dataPending || !data || !data.user) return;

      const matchvoucher = data.user.vouchers.find(
        (voucher) => voucher.id === voucherId,
      );

      if (!matchvoucher)
        throw new Error(
          `voucher id ${voucherId} should exists on data fetched`,
        );

      // if all the price is covered by point balance
      if (
        transactionPayload.usedPoints &&
        transactionPayload.priceAfterDiscount <= 0
      )
        return;

      // handle voucher price > total price
      if (matchvoucher.price > transactionPayload.priceAfterDiscount) {
        matchvoucher.price = transactionPayload.priceAfterDiscount;
      }

      let totalDiscount = transactionPayload.totalDiscount + matchvoucher.price;
      if (transactionPayload.voucherId) {
        const prevVoucher = data.user.vouchers.find(
          (voucher) => voucher.id === transactionPayload.voucherId,
        );
        if (!prevVoucher)
          throw new Error(
            `voucher id ${voucherId} should exists on data fetched`,
          );
        totalDiscount -= prevVoucher.price;
      }

      const priceAfterDiscount =
        transactionPayload.priceBeforeDiscount - totalDiscount;

      // if all the price is covered by voucher
      if (priceAfterDiscount <= 0 && !transactionPayload.usedPoints)
        setDisablePointBalance(true);

      setTransactionPayload((prev) => ({
        ...prev,
        priceAfterDiscount: priceAfterDiscount,
        totalDiscount: totalDiscount,
        voucherId: matchvoucher.id,
      }));
    },
    [transactionPayload, dataPending, data],
  );

  const cancelVoucher = useCallback(() => {
    if (dataPending || !data || !data.user.id) return;

    const usedVoucherId = transactionPayload.voucherId;
    if (!usedVoucherId) return;

    const matchvoucher = data.user.vouchers.find(
      (voucher) => voucher.id === usedVoucherId,
    );
    if (!matchvoucher)
      throw new Error(
        `voucher id ${usedVoucherId} should exists on data fetched`,
      );

    const totalDiscount = transactionPayload.totalDiscount - matchvoucher.price;
    const priceAfterDiscount =
      transactionPayload.priceBeforeDiscount - totalDiscount;

    setDisablePointBalance(false);
    setTransactionPayload((prev) => ({
      ...prev,
      priceAfterDiscount: priceAfterDiscount,
      totalDiscount: totalDiscount,
      voucherId: undefined,
    }));
  }, [transactionPayload, dataPending, data]);

  const addPointBalance = useCallback(
    (amount: number) => {
      if (dataPending || !data || !data.user) return;
      if (amount <= 0 || amount > data.user.pointBalance) {
        throw new Error(
          'point balance added must be greater than zero or less than available point',
        );
      }

      // If all the price is covered by voucher
      if (
        transactionPayload.voucherId &&
        transactionPayload.priceAfterDiscount <= 0
      )
        return;

      if (amount > transactionPayload.priceAfterDiscount) {
        amount = transactionPayload.priceAfterDiscount;
      }

      let totalDiscount = transactionPayload.totalDiscount + amount;
      if (transactionPayload.usedPoints) {
        totalDiscount -= transactionPayload.usedPoints;
      }
      const priceAfterDiscount =
        transactionPayload.priceBeforeDiscount - totalDiscount;

      // If all the price covered by point balance
      if (priceAfterDiscount <= 0 && !transactionPayload.voucherId)
        setDisableVoucher(true);

      setTransactionPayload((prev) => ({
        ...prev,
        priceAfterDiscount: priceAfterDiscount,
        totalDiscount: totalDiscount,
        usedPoints: amount,
      }));
    },
    [data, transactionPayload, dataPending],
  );

  const cancelPointBalance = useCallback(() => {
    if (dataPending || !data || !data.user) return;
    if (!transactionPayload.usedPoints) return;

    const totalDiscount =
      transactionPayload.totalDiscount - transactionPayload.usedPoints;
    const priceAfterDiscount =
      transactionPayload.priceBeforeDiscount - totalDiscount;

    setDisableVoucher(false);
    setTransactionPayload((prev) => ({
      ...prev,
      priceAfterDiscount: priceAfterDiscount,
      totalDiscount: totalDiscount,
      usedPoints: undefined,
    }));
  }, [data, transactionPayload, dataPending]);

  const {
    mutate: createTransaction,
    error: createError,
    isPending: createPending,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await apiclient.post(
        '/transactions/checkout',
        transactionPayload,
      );
      return data as CheckoutResponse;
    },
    onSuccess: async (data) => {
      if (data.status === 'NEED_PAYMENT') {
        updatePaymentNotif();
      } else {
        setShowConfetti(true);
        toast({
          title: '🎉 Payment Success',
          description: 'For more information, check your email for your tikets',
          variant: 'default',
        });
      }

      refetchNow(['transaction-context']);

      setTransactionPayload({
        id: transactionId,
        priceAfterDiscount: 0,
        priceBeforeDiscount: 0,
        eventId: eventId,
        buyerId: user?.id || '',
        totalTicketQuantity: 0,
        tickets: [],
        totalDiscount: 0,
      });
    },
  });
  return (
    <TransactionContext.Provider
      value={{
        data: data,
        dataError: dataError ? (dataError as AxiosError) : undefined,
        dataPending: dataPending,
        create: createTransaction,
        createError: createError ? (createError as AxiosError) : undefined,
        createPending: createPending,
        payload: transactionPayload,
        addTicket: addTicket,
        substractTicket: substractTicket,
        addVoucher: addVoucher,
        addPointBalance: addPointBalance,
        cancelVoucher: cancelVoucher,
        cancelPointBalance: cancelPointBalance,
        disablePointBalance: disablePointBalance,
        disableVoucher: disableVoucher,
      }}
    >
      <>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-50 flex select-none justify-center overflow-hidden"
        >
          <Confetti
            active={showConfetti}
            config={{
              angle: 90,
              spread: 360,
              startVelocity: 40,
              elementCount: 70,
              dragFriction: 0.12,
              duration: 4000,
              stagger: 3,
              width: '10px',
              height: '10px',
              perspective: '500px',
              colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
            }}
          />
        </div>

        {children}
      </>
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (context === null) {
    throw new Error(
      'useTransactionContext must be used within a TransactionContextProvider',
    );
  }
  return context;
}
