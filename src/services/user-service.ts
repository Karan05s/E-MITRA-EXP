'use server';

import type { User, Position } from '@/types';
import { getLoggedInUserFromLocalStorage } from './local-storage-service';

// Simulate a database of users and their last known locations.
const mockUserDatabase: Record<string, { user: User; position: Position }> = {
  '123456789012': {
    user: {
      id: '123456789012',
      name: 'Priya Sharma',
      mobile: '9876543210',
    },
    // Location: Van Vihar National Park, Bhopal
    position: {
      latitude: 23.2323,
      longitude: 77.368,
    },
  },
  '987654321098': {
    user: {
      id: '987654321098',
      name: 'Amit Patel',
      mobile: '8765432109',
    },
    // Location: DB City Mall, Bhopal
    position: {
      latitude: 23.235,
      longitude: 77.435,
    },
  },
};

/**
 * Simulates fetching a user's data and last known location by their ID.
 * @param userId The unique ID of the user to fetch.
 * @returns An object containing the user and their position, or nulls if not found.
 */
export async function getUserById(
  userId: string
): Promise<{ user: User | null; position: Position | null }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data = mockUserDatabase[userId];

  if (data) {
    return { user: data.user, position: data.position };
  }

  // To make it feel more dynamic, let's check the localStorage of the current browser.
  // This is a HACK for the prototype to allow tracking the currently logged-in user.
  // In a real app this would query a central database.
  const loggedInUser = await getLoggedInUserFromLocalStorage();
  if (loggedInUser && loggedInUser.id === userId) {
      return {
          user: loggedInUser,
          // For the prototype, we can't get their real-time location,
          // so we'll return a static location as if we looked it up.
          position: { latitude: 23.2599, longitude: 77.4126 } // Bhopal center
      }
  }


  return { user: null, position: null };
}
