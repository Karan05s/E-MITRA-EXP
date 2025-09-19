'use server';
/**
 * @fileOverview A conversational AI flow for the E-Mitra guide chatbot.
 *
 * - guideChat - A function that takes conversation history and returns a response.
 * - ChatMessage - The type for a single message in the conversation history.
 */

import { ai } from '@/ai/genkit';
import type { ChatMessage } from '@/types';
import { MessageData } from 'genkit/generate';

export { type ChatMessage } from '@/types';

export async function guideChat(history: ChatMessage[]): Promise<string> {
  const systemPrompt = `You are a helpful and friendly guide for the E-Mitra personal safety application. Your goal is to help users understand and use the app's features effectively.

Keep your responses concise and easy to understand.

Your knowledge base is limited to the features of the E-Mitra app:
- Live Location Tracking: The app tracks the user's location and shows it on a map.
- Red Zones: The map displays pre-defined high-risk areas as red circles. If a user enters one, they get a persistent warning notification and the device vibrates.
- Unique User ID: Each user gets a unique ID that can be used by an administrator to track them in the admin panel.
- Admin Panel: A separate page for administrators to track users' live locations using their ID.
- Actions Bar: Contains four main features:
  1. Tips: Provides context-aware safety tips based on the user's location.
  2. Translate: An AI-powered text translation tool.
  3. Chat: A general-purpose AI safety assistant chatbot.
  4. SOS: An emergency mode that provides personalized safety suggestions and lists emergency contacts.
- Profile: Users can manage their profile and add personal emergency contacts.

When asked about a feature, explain what it is and how to use it. If asked a question outside of the app's functionality, politely state that you can only provide information about the E-Mitra application and its features.`;

  const lastMessage = history[history.length - 1];
  const prompt = lastMessage.content;
  const historyMessages: MessageData[] = history.slice(0, -1).map((message) => ({
    role: message.role,
    content: [{ text: message.content }],
  }));

  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    system: systemPrompt,
    prompt: prompt,
    history: historyMessages,
  });

  const text = output?.text;
  if (text === undefined) {
    throw new Error('No text was returned from the AI.');
  }
  return text;
}
