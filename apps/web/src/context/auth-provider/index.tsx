/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { toast } from '@/hooks/use-toast';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
// import { usePaymentNotifContext } from '../payment-notif-provider';

export type UserStatus = 'authenticated' | 'pending' | 'unauthenticated';

export interface LoginUser {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: 'CUSTOMER' | 'ORGANIZER';
}

export type AuthContextValue = {
  user: LoginUser | null;
  apiclient: AxiosInstance;
  status: UserStatus;
  login: (
    payload: { email: string; password: string },
    role: 'CUSTOMER' | 'ORGANIZER',
  ) => Promise<void>;
  logout: () => Promise<void>;
  update: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  // const { updatePaymentNotif } = usePaymentNotifContext();

  // Create a single axios instance with credentials
  const apiclient = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      withCredentials: true,
    });
  }, []);

  const refreshclient = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      withCredentials: true,
    });
  }, []);

  const [user, setUser] = useState<LoginUser | null>(null);
  const [status, setStatus] = useState<UserStatus>('pending');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  /**
   * logout: Clear user session and token on client side.
   */
  const logout = useCallback(async () => {
    if (accessToken) {
      try {
        await apiclient.post('/auth/logout');
      } catch (error) {
        toast({
          title: 'Failed to logout',
          description:
            'Sorry, we are having problems on our server. Please try again!',
          variant: 'destructive',
        });
      }
    }
    setUser(null);
    setAccessToken(null);
    setStatus('unauthenticated');
    // updatePaymentNotif();
  }, [accessToken, apiclient]);

  /**
   * fetchUser: Attempt to get the current user profile.
   *            If it fails (e.g. 401), we logout.
   */
  const fetchUser = useCallback(
    async (options?: AxiosRequestConfig, note?: string) => {
      try {
        setStatus('pending');
        const { data } = await apiclient.get('/users/me', options);
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          profilePicture: data.user.profilePicture,
          role: data.user.role,
        });
        setStatus('authenticated');
      } catch (error) {
        await logout();
      }
    },
    [apiclient, logout],
  );

  /**
   * login: Obtain the access token, store it, then fetch user info.
   */
  const login = useCallback(
    async (
      payload: { email: string; password: string },
      role: 'CUSTOMER' | 'ORGANIZER',
    ) => {
      try {
        setStatus('pending');
        const { data } = await apiclient.post('/auth/login', {
          ...payload,
          role: role,
        });
        setAccessToken(data.accessToken);

        // Fetch user with a one-time header override (Bearer token)
        await fetchUser({
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });
        // updatePaymentNotif();
      } catch (error) {
        await logout();
        throw error as AxiosError; // Rethrow so UI can handle
      }
    },
    [apiclient, fetchUser, logout],
  );

  /**
   * Attach access token to requests except for login and register endpoints.
   */
  useEffect(() => {
    const requestInterceptor = apiclient.interceptors.request.use(
      (config) => {
        if (!config?.url?.startsWith('/auth')) {
          return config;
        }
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      apiclient.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken, apiclient]);

  /**
   * refreshAccessToken: If a refresh is not already in progress, send a refresh request.
   * All concurrent 401 failures await this promise.
   */
  const refreshAccessToken = async (): Promise<string> => {
    try {
      const { data } = await refreshclient.get('/auth/refresh-token');
      const newToken = data.accessToken as string;
      setAccessToken(newToken);
      apiclient.defaults.headers.Authorization = `Bearer ${newToken}`;
      return newToken;
    } catch (err) {
      await logout();
      throw err;
    }
  };

  /**
   * Response interceptor: If 401, attempt to refresh token and retry the request.
   */
  useEffect(() => {
    const responseInterceptor = apiclient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response?.status === 401 &&
          !error.config.url.startsWith('/auth')
        ) {
          console.log({
            log: 'request failed with 401 attempt to refresh',
            req: error.config.url,
          });
          try {
            const newToken = await refreshAccessToken();
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return apiclient(error.config);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      apiclient.interceptors.response.eject(responseInterceptor);
    };
  }, [apiclient, logout]);

  /**
   * On mount, attempt an immediate refresh so that if a valid session exists (e.g., via cookie),
   * the user gets fetched.
   */
  useEffect(() => {
    const initialFetch = async () => {
      try {
        const { data } = await apiclient.get('/auth/refresh-token');
        const newToken = data.accessToken as string;
        setAccessToken(newToken);
        await fetchUser(
          {
            headers: { Authorization: `Bearer ${newToken}` },
          },
          'initial fetch user',
        );
      } catch (error) {
        await logout();
      }
    };

    initialFetch();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        apiclient,
        login,
        logout,
        update: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
