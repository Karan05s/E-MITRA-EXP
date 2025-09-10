'use server';
/**
 * @fileOverview A conversational AI flow for the E-Mitra chatbot.
 *
 * - chat - A function that takes conversation history and returns a response.
 * - ChatMessage - The type for a single message in the conversation history.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MessageData } from 'genkit/generate';
import type { ChatMessage } from '@/types';

export { type ChatMessage } from '@/types';

export async function chat(history: ChatMessage[]): Promise<string> {
  const messages: MessageData[] = history.map((message) => ({
    role: message.role,
    content: [{ text: message.content }],
  }));

  const { output } = await ai.generate({
    prompt: `You are Mitra, a friendly and empathetic personal safety assistant. Your primary goal is to help users feel safe and provide them with relevant, actionable, and clear information and support.

Keep your responses concise, well-structured, and easy to understand. Use formatting like lists or bold text where it improves clarity.
If a user seems to be in distress, provide calming and reassuring language. Prioritize their immediate safety and suggest calling emergency services if necessary.
When asked for safety tips (e.g., for solo travel, new cities), provide a practical, bulleted list of 3-5 key recommendations.
If asked about topics outside of personal safety, politely steer the conversation back to your purpose.`,
    history: messages,
  });

  const text = output?.text;
  if (text === undefined) {
    throw new Error('No text was returned from the AI.');
  }
  return text;
}
