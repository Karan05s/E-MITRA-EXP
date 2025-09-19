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

  const lastMessage = history[history.length - 1];
  const prompt = lastMessage.content;
  const historyMessages: MessageData[] = history.slice(0, -1).map((message) => ({
    role: message.role,
    content: [{ text: message.content }],
  }));
  
  const cleanPrompt = prompt.trim().toLowerCase();

  // Check for the specific hardcoded questions first.
  if (cleanPrompt === 'what are some tips for solo travelers?') {
    return `Solo travel offers a unique chance for personal growth and freedom. To make the most of your trip, focus on three key areas:

1. **Smart Planning**: Research your destination, book essential accommodations and flights in advance, and inform a trusted person of your itinerary. Keep digital copies of important documents and notify your bank about your travel plans.

2. **Safety First**: Always trust your gut instincts. Stay aware of your surroundings, be cautious with alcohol, and avoid looking like a vulnerable tourist. Use a money belt or secure bag for your valuables.

3. **Embrace the Experience**: Leave room for spontaneity. Be open to meeting new people through tours or social activities, but also enjoy the solitude. Don't be afraid to dine alone and fully immerse yourself in the local culture.`;
  } 
  
  if (cleanPrompt === 'how do i stay safe in a new city?') {
    return `**Be Aware**: Stay alert, avoid distractions, and research unsafe areas beforehand.

**Secure Valuables**: Keep cash and documents safe. Don't flash expensive items.

**Blend In**: Dress like a local and avoid looking like an obvious tourist.

**Use Reputable Transport**: Opt for licensed taxis or trusted ride-share services.`;
  } 
  
  if (cleanPrompt === 'what should i do if i feel unsafe?') {
    return `**Trust Your Gut**: If a situation feels wrong, it is.

**Remove Yourself**: Calmly walk away and enter a public, crowded place like a store or cafe.

**Make a Scene**: If necessary, yell for help to draw attention and deter an aggressor.

**Don't Resist**: Your safety is more important than your belongings. In a mugging, hand over what is demanded.`;
  }

  // If no hardcoded question matches, use the generative AI.
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    system: systemPrompt,
    prompt: prompt, // Use the original, unmodified prompt
    history: historyMessages,
  });

  const text = output?.text;
  if (text === undefined) {
    throw new Error('No text was returned from the AI.');
  }
  return text;
}
