'use server';

/**
 * @fileOverview An emergency chat flow that assists users in distress.
 *
 * - `emergencyChat`: Handles the conversation, using tools to find nearby safe places.
 * - `EmergencyChatInput`: The input type for the emergencyChat function.
 * - `EmergencyChatOutput`: The return type for the emergencyChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ChatMessage, Position } from '@/types';
import { findNearbyPlaces } from '@/services/google-maps-service';

// Define the tool for finding nearby places
const findNearbyPlacesTool = ai.defineTool(
  {
    name: 'findNearbyPlaces',
    description:
      'Finds nearby places of a specific type (like "police" or "hospital") based on the user\'s current location and returns the one with the shortest walking distance.',
    inputSchema: z.object({
      placeType: z
        .string()
        .describe('The type of place to search for. E.g., "police", "hospital".'),
      userPosition: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    }),
    outputSchema: z.object({
      name: z.string().describe("The name of the place found."),
      vicinity: z.string().describe("The address or general vicinity of the place."),
      location: z.object({
        lat: z.number(),
        lng: z.number(),
      }).describe("The geographic coordinates of the place."),
      distanceText: z.string().describe("The walking distance to the place (e.g., '1.5 km')."),
      durationText: z.string().describe("The estimated walking time to the place (e.g., '20 mins')."),
      url: z.string().describe("A Google Maps URL to get directions to the place."),
    }).nullable(),
  },
  async (input) => {
    // This check should ideally not be needed if the AI respects the tool's availability,
    // but it's a good safeguard.
    if (!input.userPosition) return null;
    return findNearbyPlaces(input.placeType, input.userPosition);
  }
);


const EmergencyChatInputSchema = z.object({
  history: z.array(z.custom<ChatMessage>()).optional(),
  userPosition: z.custom<Position>().nullable(),
});
export type EmergencyChatInput = z.infer<typeof EmergencyChatInputSchema>;

export type EmergencyChatOutput =
  | { type: 'text'; content: string }
  | { type: 'tool-result'; result: NonNullable<Awaited<ReturnType<typeof findNearbyPlaces>>> };

export async function emergencyChat(
  input: EmergencyChatInput
): Promise<EmergencyChatOutput> {
  const { history = [], userPosition } = input;
  const lastUserMessage = history[history.length - 1];

  if (!lastUserMessage || lastUserMessage.role !== 'user') {
    throw new Error('The last message must be from the user.');
  }

  const prompt = lastUserMessage.content;
  const historyMessages = history.slice(0, -1);

  // Conditionally configure tools based on whether the user's location is available.
  const toolConfig = userPosition
    ? {
        tools: [findNearbyPlacesTool],
        toolChoice: [
          {
            tool: findNearbyPlacesTool,
            context: {
              userPosition: {
                latitude: userPosition.latitude,
                longitude: userPosition.longitude,
              },
            },
          },
        ],
      }
    : undefined;

  const systemPrompt = `You are an emergency assistant chatbot for tourists called "E-Mitra".
      - Your primary goal is to help users who are in distress or feel unsafe.
      - Be calm, reassuring, and provide clear, concise, and actionable advice.
      ${
        userPosition
          ? `- If the user asks for help, a police station, a hospital, or any safe place, you MUST use the 'findNearbyPlaces' tool to find the nearest one.
      - When you use the tool, briefly mention the result to the user in a caring tone, but do not just repeat the tool's output. For example: "I found a police station nearby for you. It's called [Name] and it's about a [Duration] walk away. I'm showing you the map now. Please head there safely."
      - If the tool returns no results, inform the user calmly that you couldn't find a place nearby and suggest they call emergency services (like 112 in India).`
          : `- The user's location is not available. You CANNOT find nearby places for them.
      - If the user asks for a police station, hospital, or directions, you must inform them that you cannot look up places without their location. Advise them to use a map application or ask someone nearby for directions. You can still provide general safety advice.`
      }
      - For general conversation, keep your responses brief and focused on safety.`;


  const llmResponse = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: prompt,
    history: historyMessages.map(msg => ({
      role: msg.role,
      content: [{ text: msg.content }]
    })),
    toolConfig: toolConfig,
    system: systemPrompt,
  });

  const toolRequest = llmResponse.toolRequest();
  if (toolRequest) {
    const toolResult = await toolRequest.run();
    if (toolResult) {
      // The tool returns a single result, so we take the first one.
      return {
        type: 'tool-result',
        result: toolResult.outputs[0] as any,
      };
    }
  }

  return { type: 'text', content: llmResponse.text() };
}
