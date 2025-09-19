'use server';
/**
 * @fileOverview A conversational AI flow for the E-Mitra chatbot.
 *
 * - chat - A function that takes conversation history and returns a response.
 * - ChatMessage - The type for a single message in the conversation history.
 */

import { ai } from '@/ai/genkit';
import type { ChatMessage } from '@/types';
import { MessageData } from 'genkit/generate';

export { type ChatMessage } from '@/types';

export async function chat(history: ChatMessage[]): Promise<string> {
  const systemPrompt = `You are Mitra, a friendly and empathetic personal safety assistant. Your primary goal is to help users feel safe and provide them with relevant, actionable, and clear information and support.

Keep your responses concise, well-structured, and easy to understand. Use formatting like lists or bold text where it improves clarity.
If a user seems to be in distress, provide calming and reassuring language. Prioritize their immediate safety and suggest calling emergency services if necessary.
When asked for safety tips (e.g., for solo travel, new cities), provide a practical, bulleted list of 3-5 key recommendations.
If asked about topics outside of personal safety, politely steer the conversation back to your purpose.`;

  // The last message is the new prompt, the rest is history.
  const prompt = history[history.length - 1].content;
  const historyMessages: MessageData[] = history.slice(0, -1).map((message) => ({
    role: message.role,
    content: [{ text: message.content }],
  }));

  // Check for the specific hardcoded question.
  if (prompt.trim().toLowerCase() === 'what are some tips for solo travelers?') {
    return `Solo travel offers a unique chance for personal growth and freedom. To make the most of your trip, focus on three key areas:

1. **Smart Planning**: Research your destination, book essential accommodations and flights in advance, and inform a trusted person of your itinerary. Keep digital copies of important documents and notify your bank about your travel plans.

2. **Safety First**: Always trust your gut instincts. Stay aware of your surroundings, be cautious with alcohol, and avoid looking like a vulnerable tourist. Use a money belt or secure bag for your valuables.

3. **Embrace the Experience**: Leave room for spontaneity. Be open to meeting new people through tours or social activities, but also enjoy the solitude. Don't be afraid to dine alone and fully immerse yourself in the local culture.`;
  }

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
