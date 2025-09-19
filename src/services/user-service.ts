'use server';

import type { User, Position } from '@/types';
import clientPromise from '@/lib/mongodb';
import { Collection, Document } from 'mongodb';

// Define a type for our user document for better type safety
interface UserDocument extends Document, User {
  position: Position;
  createdAt: Date;
}

// Helper function to get the users collection
async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const client = await clientPromise;
  const db = client.db('e_mitra'); // You can change your DB name here
  return db.collection<UserDocument>('users');
}


/**
 * Fetches a user's data and last known location by their ID from MongoDB.
 * @param userId The unique ID of the user to fetch.
 * @returns An object containing the user and their position, or nulls if not found.
 */
export async function getUserById(
  userId: string
): Promise<{ user: User | null; position: Position | null }> {
  try {
    const users = await getUsersCollection();
    const result = await users.findOne({ id: userId });

    if (result) {
      const { _id, createdAt, ...user } = result;
      return { user: user as User, position: result.position };
    }
  } catch (error) {
     console.error('Error fetching user by ID:', error);
  }
  return { user: null, position: null };
}

/**
 * Adds a new user to the MongoDB database.
 */
export async function registerUserInDb(
  user: User,
  position: Position | null
) {
  try {
    const users = await getUsersCollection();
    const existingUser = await users.findOne({ id: user.id });

    if (existingUser) {
      console.log('User already exists:', user.id);
      return;
    }

    const userDocument: UserDocument = {
      ...user,
      position: position || { latitude: 23.2599, longitude: 77.4126 }, // Default to Bhopal center
      createdAt: new Date(),
    };

    await users.insertOne(userDocument);
    console.log('Registered user in MongoDB:', user.name, 'with ID:', user.id);
  } catch (error) {
     console.error('Error registering user:', error);
  }
}

/**
 * Removes a user from the MongoDB database.
 */
export async function removeUserFromDb(userId: string) {
  try {
    const users = await getUsersCollection();
    const result = await users.deleteOne({ id: userId });

    if (result.deletedCount > 0) {
      console.log('Removed user from MongoDB:', userId);
    } else {
      console.log('Attempted to remove user, but ID not found:', userId);
    }
  } catch (error) {
    console.error('Error removing user:', error);
  }
}

/**
 * Updates a user's position in the MongoDB database.
 */
export async function updateUserPositionInDb(
  userId: string,
  position: Position
) {
  try {
    const users = await getUsersCollection();
    await users.updateOne(
      { id: userId },
      { $set: { position: position } }
    );
  } catch (error) {
    console.error('Error updating user position:', error);
  }
}

/**
 * Fetches all active users from the MongoDB database.
 */
export async function getAllActiveUsers(): Promise<User[]> {
  try {
    const users = await getUsersCollection();
    // Sort by creation date descending to get the most recent users
    const userDocs = await users.find().sort({ createdAt: -1 }).toArray();
    // Exclude database-specific fields before returning
    return userDocs.map(doc => {
        const { _id, position, createdAt, ...user } = doc;
        return user as User;
    });
  } catch (error) {
    console.error('Error fetching all active users:', error);
    return [];
  }
}

// We no longer need this as user data is persisted in Mongo
export async function getLoggedInUserFromLocalStorage(): Promise<User | null> {
  return null;
}
