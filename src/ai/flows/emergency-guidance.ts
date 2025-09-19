'use server';

/**
 * @fileOverview A simple flow for providing emergency guidance.
 *
 * - emergencyGuidanceFlow - A function that provides a response to a user's query.
 * - EmergencyGuidanceInput - The input type for the function.
 * - EmergencyGuidanceOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EmergencyGuidanceInputSchema = z.object({
  query: z.string().describe('The user\'s question or cry for help.'),
});
export type EmergencyGuidanceInput = z.infer<
  typeof EmergencyGuidanceInputSchema
>;

const EmergencyGuidanceOutputSchema = z.object({
  response: z
    .string()
    .describe('A helpful and calming response to the user.'),
});
export type EmergencyGuidanceOutput = z.infer<
  typeof EmergencyGuidanceOutputSchema
>;

const emergencyGuidancePrompt = ai.definePrompt({
  name: 'emergencyGuidancePrompt',
  input: { schema: EmergencyGuidanceInputSchema },
  output: { schema: EmergencyGuidanceOutputSchema },
  system: `You are an emergency assistant chatbot for tourists called "E-Mitra".
      - Your primary goal is to help users who are in distress or feel unsafe.
      - Be calm, reassuring, and provide clear, concise, and actionable advice.
      - If the user asks for help, a police station, a hospital, or any safe place, advise them to use a map application or ask someone nearby for directions as you cannot access their live location. You can still provide general safety advice.
      - For general conversation, keep your responses brief and focused on safety.`,
  prompt: `The user says: {{{query}}}`,
});

export const emergencyGuidanceFlow = ai.defineFlow(
  {
    name: 'emergencyGuidanceFlow',
    inputSchema: EmergencyGuidanceInputSchema,
    outputSchema: EmergencyGuidanceOutputSchema,
  },
  async (input) => {
    const { output } = await emergencyGuidancePrompt(input);
    return output!;
  }
);
