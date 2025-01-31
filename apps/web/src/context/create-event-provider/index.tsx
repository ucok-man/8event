/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  BannerError,
  BannerPayload,
  CreateEventStepPayload,
  EventError,
  EventPayload,
  TicketError,
  TicketPayload,
} from './type';

type CreateEventContextType = {
  payload: CreateEventStepPayload;
  updateBannerPayload: (cb: (payload: BannerPayload) => BannerPayload) => void;
  updateBannerError: (cb: (payload: BannerError) => BannerError) => void;
  updateCreateEventPayload: (
    cb: (payload: EventPayload) => EventPayload,
  ) => void;
  updateCreateEventError: (cb: (error: EventError) => EventError) => void;
  updateCreateTicketPayload: (
    cb: (payload: TicketPayload) => TicketPayload,
  ) => void;
  updateCreateTicketError: (cb: (error: TicketError) => TicketError) => void;
  setStorageToDefault: () => void;
};

export const CreateEventContext = createContext<CreateEventContextType | null>(
  null,
);

export default function CreateEventContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [payload, setPayload] = useState<CreateEventStepPayload>(() =>
    readStorage(),
  );

  const updateBannerPayload = useCallback(
    (cb: (payload: BannerPayload) => BannerPayload) => {
      let updated = cb(payload.uploadBanner?.data);
      // if (updated && Object.keys(updated).length < 1) {
      //   updated = undefined;
      // }
      setPayload((prev) => {
        const updatedPayload: CreateEventStepPayload = {
          ...prev,
          uploadBanner: {
            data: updated,
            error: prev.uploadBanner.error,
          },
        };
        writeStorage(updatedPayload);
        return updatedPayload;
      });
    },
    [],
  );

  const updateBannerError = useCallback(
    (cb: (payload: BannerError) => BannerError) => {
      let updated = cb(payload.uploadBanner.error);
      if (updated && Object.keys(updated).length < 1) {
        updated = undefined;
      }
      setPayload((prev) => {
        const updatedPayload: CreateEventStepPayload = {
          ...prev,
          uploadBanner: {
            data: prev.uploadBanner.data,
            error: updated,
          },
        };
        writeStorage(updatedPayload);
        return updatedPayload;
      });
    },
    [],
  );

  const updateCreateEventPayload = useCallback(
    (cb: (payload: EventPayload) => EventPayload) => {
      let updated = cb(payload?.createEvent?.data);
      // if (updated && Object.keys(updated).length < 1) {
      //   updated = undefined;
      // }

      setPayload((prev) => {
        const updatedPayload: CreateEventStepPayload = {
          ...prev,
          createEvent: {
            data: updated,
            error: prev.createEvent.error,
          },
        };
        writeStorage(updatedPayload);
        return updatedPayload;
      });
    },
    [payload],
  );

  const updateCreateEventError = useCallback(
    (cb: (error: EventError) => EventError) => {
      let updated = cb(payload?.createEvent?.error);
      if (updated && Object.keys(updated).length < 1) {
        updated = undefined;
      }

      setPayload((prev) => {
        const updatedPayload: CreateEventStepPayload = {
          ...prev,
          createEvent: {
            data: prev.createEvent.data,
            error: updated,
          },
        };
        writeStorage(updatedPayload);
        return updatedPayload;
      });
    },
    [payload],
  );

  const updateCreateTicketPayload = useCallback(
    (cb: (payload: TicketPayload) => TicketPayload) => {
      let updated = cb(payload?.createTicket?.data);
      // if (updated && updated.length < 1) {
      //   updated = undefined;
      // }
      setPayload((prev) => {
        const updatedPayload: CreateEventStepPayload = {
          ...prev,
          createTicket: {
            data: updated,
            error: prev.createTicket.error,
          },
        };
        writeStorage(updatedPayload);
        return updatedPayload;
      });
    },
    [payload],
  );

  const updateCreateTicketError = useCallback(
    (cb: (error: TicketError) => TicketError) => {
      let updated = cb(payload?.createTicket?.error);
      if (updated && Object.keys(updated).length < 1) {
        updated = undefined;
      }

      setPayload((prev) => {
        const updatedPayload: CreateEventStepPayload = {
          ...prev,
          createTicket: {
            data: prev.createTicket.data,
            error: updated,
          },
        };
        writeStorage(updatedPayload);
        return updatedPayload;
      });
    },
    [payload],
  );

  const setStorageToDefault = useCallback(() => {
    writeStorage(LOCAL_STORAGE_DEFAULT_VALUE);
  }, []);

  return (
    <CreateEventContext.Provider
      value={{
        payload,
        updateBannerError,
        updateBannerPayload,
        updateCreateEventPayload,
        updateCreateEventError,
        updateCreateTicketPayload,
        updateCreateTicketError,
        setStorageToDefault,
      }}
    >
      {children}
    </CreateEventContext.Provider>
  );
}

export function useCreateEventContext() {
  const context = useContext(CreateEventContext);
  if (context === null) {
    throw new Error(
      'useCreateEventContext must be used within a CreateEventContextProvider',
    );
  }
  return context;
}

/* ---------------------------------------------------------------- */
/*                              HELPER                              */
/* ---------------------------------------------------------------- */

const LOCAL_STORAGE_KEY = 'create-event-step';
const LOCAL_STORAGE_DEFAULT_VALUE: CreateEventStepPayload = {
  uploadBanner: {
    data: { bannerUrl: '' },
  },
  createEvent: {
    data: {
      name: '',
      category: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      isEventOnline: false,
      description: '',
    },
  },
  createTicket: {
    data: [],
  },
};

function writeStorage(data: CreateEventStepPayload) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
}

function readStorage() {
  if (typeof window === 'undefined') {
    return LOCAL_STORAGE_DEFAULT_VALUE; // Avoid SSR issues
  }
  const datastr = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (datastr) return JSON.parse(datastr);

  writeStorage(LOCAL_STORAGE_DEFAULT_VALUE);
  return LOCAL_STORAGE_DEFAULT_VALUE;
}
