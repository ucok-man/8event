import { useAuthContext } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useOrganizer() {
  const context = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (context.status === 'pending') return; // Wait for auth check

    if (!context.user || context.user.role !== 'ORGANIZER') {
      router.replace('/members/auth/signin'); // Redirect unauthorized users
    }
  }, [context, router]);

  return context;
}
