'use server';

import type { User, Position } from '@/types';

// This is a temporary in-memory "database" for the prototype.
// It will be cleared every time the server restarts.
const users: Map<
  string,
  { user: User; position: Position | null; createdAt: Date }
> = new Map();

/**
 * Fetches a user's data and last known location by their ID from memory.
 * @param userId The unique ID of the user to fetch.
 * @returns An object containing the user and their position, or null if not found.
 */
export async function getUserByIdFromDb(
  userId: string
): Promise<{ user: User; position: Position | null } | null> {
  return users.get(userId) || null;
}

/**
 * Adds a new user to the in-memory store.
 */
export async function registerUserInDb(
  user: User,
  position: Position | null
): Promise<void> {
  if (users.has(user.id)) {
    console.log('User already exists:', user.id);
    return;
  }
  users.set(user.id, { user, position, createdAt: new Date() });
  console.log('Registered user in memory:', user.name, 'with ID:', user.id);
}

/**
 * Removes a user from the in-memory store.
 */
export async function removeUserFromDb(userId: string): Promise<void> {
  if (users.delete(userId)) {
    console.log('Removed user from memory:', userId);
  } else {
    console.log('Attempted to remove user, but ID not found:', userId);
  }
}

/**
 * Updates a user's position in the in-memory store.
 */
export async function updateUserPositionInDb(
  userId: string,
  position: Position
): Promise<void> {
  const data = users.get(userId);
  if (data) {
    data.position = position;
  }
}

/**
 * Fetches all active users from the in-memory store.
 */
export async function getAllActiveUsersFromDb(): Promise<User[]> {
  const allUsers = Array.from(users.values());
  // Sort by creation date descending to get the most recent users
  allUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return allUsers.map((data) => data.user);
}
