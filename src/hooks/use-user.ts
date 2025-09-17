'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { removeUser } from '@/app/actions';
import { useDebouncedCallback } from 'use-debounce';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    try {
      const item = window.localStorage.getItem('e-mitra-user');
      const parsedUser = item ? (JSON.parse(item) as User) : null;
      
      if (isMounted) {
        if (parsedUser) {
          setUser(parsedUser);
        } else {
          router.replace('/register');
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      if (isMounted) {
        router.replace('/register');
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    
    return () => {
      isMounted = false;
    }
  }, [router]);

  const logout = useCallback(async () => {
    const currentUser = user;
    // Clear localStorage immediately for a snappy UI response
    window.localStorage.removeItem('e-mitra-user');
    setUser(null);
    router.replace('/register');

    // Then, perform the backend cleanup
    if (currentUser) {
      await removeUser(currentUser.id);
    }
  }, [router, user]);

  return { user, isLoading, logout };
}
