'use server';

import {
  generateSafetySuggestions,
  type GenerateSafetySuggestionsInput,
} from '@/ai/flows/generate-safety-suggestions';
import {
  generateSafetyTips,
  type SafetyTipsInput,
} from '@/ai/flows/context-aware-safety-tips';
import {
  translateText,
  type TranslateTextInput,
} from '@/ai/flows/translate-text';
import {
  registerUserInDb,
  removeUserFromDb,
  updateUserPositionInDb,
  getAllActiveUsersFromDb,
  getUserByIdFromDb,
} from '@/services/user-service';
import type { User, Position } from '@/types';


export async function getSafetySuggestions(
  input: GenerateSafetySuggestionsInput
) {
  try {
    const result = await generateSafetySuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getSafetySuggestions:', error);
    return {
      success: false,
      error: 'Failed to generate personalized safety suggestions.',
    };
  }
}

export async function getContextualSafetyTips(input: SafetyTipsInput) {
  try {
    const result = await generateSafetyTips(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getContextualSafetyTips:', error);
    return { success: false, error: 'Failed to generate contextual safety tips.' };
  }
}

export async function getTranslation(input: TranslateTextInput) {
  try {
    const result = await translateText(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getTranslation:', error);
    return { success: false, error: 'Failed to translate text.' };
  }
}

export async function registerUser(user: User, position: Position | null) {
  try {
    await registerUserInDb(user, position);
    return { success: true };
  } catch (error) {
    console.error('Error in registerUser:', error);
    return { success: false, error: 'Failed to register user.' };
  }
}

export async function removeUser(userId: string) {
   try {
    await removeUserFromDb(userId);
    return { success: true };
  } catch (error) {
    console.error('Error in removeUser:', error);
    return { success: false, error: 'Failed to remove user.' };
  }
}

export async function updateUserPosition(userId: string, position: Position) {
  try {
    await updateUserPositionInDb(userId, position);
    return { success: true };
  } catch (error) {
    console.error('Error in updateUserPosition:', error);
    return { success: false, error: 'Failed to update user position.' };
  }
}

export async function getAllActiveUsers() {
  try {
    const users = await getAllActiveUsersFromDb();
    return { success: true, data: users };
  } catch (error) {
    console.error('Error getting all active users:', error);
    return { success: false, error: 'Failed to retrieve active users.' };
  }
}

export async function getUserById(userId: string) {
  try {
    const data = await getUserByIdFromDb(userId);
    return { success: true, data };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return { success: false, error: 'Failed to retrieve user.' };
  }
}
