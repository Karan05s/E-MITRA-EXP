'use server';

/**
 * @fileOverview A flow for generating a structured incident report from a user's description.
 *
 * - generateIncidentReport - A function that generates a formatted report.
 * - GenerateIncidentReportInput - The input type for the function.
 * - GenerateIncidentReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIncidentReportInputSchema = z.object({
  incidentDescription: z
    .string()
    .describe('The user\'s description of what happened.'),
  location: z
    .string()
    .describe('The location where the incident occurred (e.g., "Latitude: 23.25, Longitude: 77.41" or "Near New Market, Bhopal").'),
});

export type GenerateIncidentReportInput = z.infer<
  typeof GenerateIncidentReportInputSchema
>;

const GenerateIncidentReportOutputSchema = z.object({
  report: z
    .string()
    .describe('A well-formatted, clear, and concise incident report ready to be shared.'),
});

export type GenerateIncidentReportOutput = z.infer<
  typeof GenerateIncidentReportOutputSchema
>;

export async function generateIncidentReport(
  input: GenerateIncidentReportInput
): Promise<GenerateIncidentReportOutput> {
  return reportIncidentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIncidentReportPrompt',
  input: {schema: GenerateIncidentReportInputSchema},
  output: {schema: GenerateIncidentReportOutputSchema},
  prompt: `You are an assistant helping a tourist file an incident report.
Your task is to convert the user's description of an event into a clear, structured, and formal report.
The report should be easy to read and understand for authorities or trusted contacts.

Use the following information provided by the user:
- Location of Incident: {{{location}}}
- User's Description: {{{incidentDescription}}}

Based on this, generate a report with the following structure:

**Incident Report**

**Date & Time:** [State "Current Date & Time"]
**Location:** [Use the provided location]

**Summary of Incident:**
[Provide a brief, one-sentence summary of the event.]

**Details:**
[Concisely elaborate on the user's description. Use bullet points if it makes the details clearer. Stick to the facts provided by the user.]

**Suggested Action:**
[Recommend a course of action, such as "Requesting immediate assistance from local authorities." or "For informational purposes for trusted contacts."]

Keep the tone objective and factual. Do not add any information that the user did not provide.
Format the output as a single block of text.`,
});

const reportIncidentFlow = ai.defineFlow(
  {
    name: 'reportIncidentFlow',
    inputSchema: GenerateIncidentReportInputSchema,
    outputSchema: GenerateIncidentReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
