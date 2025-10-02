/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  // Create axios instances with credentials
  const apiclient = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      withCredentials: true, // Important: sends cookies
    });
  }, []);

  const refreshclient = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      withCredentials: true, // Important: sends cookies for refresh token
    });
  }, []);

  const [user, setUser] = useState<LoginUser | null>(null);
  const [status, setStatus] = useState<UserStatus>('pending');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Use ref to track ongoing refresh to prevent race conditions
  const refreshPromiseRef = useRef<Promise<string> | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  /**
   * logout: Clear user session and token on client side.
   */
  const logout = useCallback(async () => {
    try {
      // Backend clears the http-only cookie
      await apiclient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    }

    setUser(null);
    setAccessToken(null);
    setStatus('unauthenticated');
    refreshPromiseRef.current = null;
    isRefreshingRef.current = false;
  }, [apiclient]);

  /**
   * fetchUser: Attempt to get the current user profile.
   */
  const fetchUser = useCallback(
    async (options?: AxiosRequestConfig) => {
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
        // Don't logout automatically - let the interceptor handle token refresh
        // Only set to unauthenticated if refresh also fails
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setStatus('unauthenticated');
          setUser(null);
          setAccessToken(null);
        } else {
          // Network error or other issue - don't change auth state drastically
          // Just set status back to what it likely was
          setStatus((prev) => (prev === 'pending' ? 'unauthenticated' : prev));
        }
      }
    },
    [apiclient],
  );

  /**
   * login: Obtain the access token, store it, then fetch user info.
   * Backend sets refresh token as http-only cookie automatically.
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

        // Backend returns access token and sets refresh token cookie
        setAccessToken(data.accessToken);

        // Fetch user with the new access token
        await fetchUser({
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });
      } catch (error) {
        await logout();
        throw error as AxiosError; // Rethrow so UI can handle
      }
    },
    [apiclient, fetchUser, logout],
  );

  /**
   * Attach access token to ALL requests (including auth endpoints for logout).
   * The backend will ignore it for login/register but needs it for logout.
   */
  useEffect(() => {
    const requestInterceptor = apiclient.interceptors.request.use(
      (config) => {
        // Add token to all requests if available
        if (accessToken && config.headers) {
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
   * refreshAccessToken: Uses the http-only cookie to get a new access token.
   * Prevents multiple concurrent refresh requests.
   */
  const refreshAccessToken = useCallback(async (): Promise<string> => {
    // If refresh is already in progress, return the existing promise
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    // Prevent multiple refresh attempts
    if (isRefreshingRef.current) {
      throw new Error('Refresh already in progress');
    }

    isRefreshingRef.current = true;

    // Create new refresh promise
    refreshPromiseRef.current = (async () => {
      try {
        // This uses the http-only cookie automatically (withCredentials: true)
        const { data } = await refreshclient.get('/auth/refresh-token');
        const newToken = data.accessToken as string;
        setAccessToken(newToken);
        return newToken;
      } catch (err) {
        // Refresh token is invalid or expired
        await logout();
        throw err;
      } finally {
        // Clear the promise and flag after completion
        refreshPromiseRef.current = null;
        isRefreshingRef.current = false;
      }
    })();

    return refreshPromiseRef.current;
  }, [refreshclient, logout]);

  /**
   * Response interceptor: If 401, attempt to refresh token and retry the request.
   * Skip refresh for auth endpoints (except refresh-token itself handled separately).
   */
  useEffect(() => {
    const responseInterceptor = apiclient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if it's a 401 error and not already retried
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._isRetry && // Prevent infinite loops
          !originalRequest.url?.includes('/auth/login') &&
          !originalRequest.url?.includes('/auth/register')
        ) {
          originalRequest._isRetry = true;

          try {
            const newToken = await refreshAccessToken();
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiclient(originalRequest);
          } catch (refreshError) {
            // Refresh failed, user needs to login again
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      apiclient.interceptors.response.eject(responseInterceptor);
    };
  }, [apiclient, refreshAccessToken]);

  /**
   * On mount, attempt to get a new access token using existing refresh token cookie.
   * If successful, fetch user data.
   */
  useEffect(() => {
    let isMounted = true;

    const initialFetch = async () => {
      try {
        // Try to refresh using the http-only cookie
        const { data } = await refreshclient.get('/auth/refresh-token');

        if (!isMounted) return;

        const newToken = data.accessToken as string;
        setAccessToken(newToken);

        // Fetch user with the new token
        const userResponse = await apiclient.get('/users/me', {
          headers: { Authorization: `Bearer ${newToken}` },
        });

        if (!isMounted) return;

        setUser({
          id: userResponse.data.user.id,
          email: userResponse.data.user.email,
          name: userResponse.data.user.name,
          profilePicture: userResponse.data.user.profilePicture,
          role: userResponse.data.user.role,
        });
        setStatus('authenticated');
      } catch (error) {
        if (!isMounted) return;
        // No valid session exists, just set to unauthenticated
        setStatus('unauthenticated');
      }
    };

    initialFetch();

    return () => {
      isMounted = false;
    };
    // Empty dependency array is correct - only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
