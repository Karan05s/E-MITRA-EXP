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

  // First, check our persistent mock database
  let data = mockUserDatabase[userId];

  // If not found, check if the ID matches the currently logged-in user in the browser.
  // This simulates finding a user who was registered in this session.
  if (!data) {
    const loggedInUser = await getLoggedInUserFromLocalStorage();
    if (loggedInUser && loggedInUser.id === userId) {
       // See if we have a stored position for them, otherwise use a default
       const position = mockUserDatabase[userId]?.position || { latitude: 23.2599, longitude: 77.4126 };
       mockUserDatabase[userId] = { user: loggedInUser, position };
       data = mockUserDatabase[userId];
    }
  }

  if (data) {
    return { user: data.user, position: data.position };
  }

  return { user: null, position: null };
}

/**
 * Simulates adding a new user to our database.
 */
export async function registerUserInDb(
  user: User,
  position: Position | null
) {
  if (mockUserDatabase[user.id]) {
    return; // User already exists
  }
  mockUserDatabase[user.id] = {
    user: user,
    position: position || { latitude: 23.2599, longitude: 77.4126 }, // Bhopal center
  };
  console.log('Registered user:', user.name, 'with ID:', user.id);
  console.log('Current DB state:', Object.keys(mockUserDatabase));
}

/**
 * Simulates removing a user from our database.
 */
export async function removeUserFromDb(userId: string) {
  if (mockUserDatabase[userId]) {
    console.log('Removing user:', mockUserDatabase[userId].user.name);
    delete mockUserDatabase[userId];
    console.log('Current DB state:', Object.keys(mockUserDatabase));
  }
}

/**
 * Simulates updating a user's position in the database.
 */
export async function updateUserPositionInDb(
  userId: string,
  position: Position
) {
  if (mockUserDatabase[userId]) {
    mockUserDatabase[userId].position = position;
  }
}
