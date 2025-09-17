'use server';

// This is a hacky way to read from localStorage on the "server"
// by defining a server action that can only run in the browser context.
// In a real app, you would have a proper database and API.

import type { User } from '@/types';

export async function getLoggedInUserFromLocalStorage(): Promise<User | null> {
  // This function will be executed on the client-side when called from a server component,
  // allowing access to localStorage.
  try {
    const item = localStorage.getItem('e-mitra-user');
    if (item) {
      return JSON.parse(item) as User;
    }
  } catch (e) {
    console.error('Could not access localStorage:', e);
  }
  return null;
}
