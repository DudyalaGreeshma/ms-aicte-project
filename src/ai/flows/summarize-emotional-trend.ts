// 'use server'

/**
 * @fileOverview Summarizes emotional trends over time.
 *
 * - summarizeEmotionalTrend - A function that summarizes emotional trends.
 * - SummarizeEmotionalTrendInput - The input type for the summarizeEmotionalTrend function.
 * - SummarizeEmotionalTrendOutput - The return type for the summarizeEmotionalTrend function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmotionalTrendInputSchema = z.array(z.object({
  emotion: z.string().describe('The detected emotion.'),
  timestamp: z.string().describe('The timestamp of the emotion detection.'),
})).describe('An array of emotional data points with emotion and timestamp.');

export type SummarizeEmotionalTrendInput = z.infer<typeof SummarizeEmotionalTrendInputSchema>;

const SummarizeEmotionalTrendOutputSchema = z.object({
  summary: z.string().describe('A summary of the emotional trends over time.'),
});

export type SummarizeEmotionalTrendOutput = z.infer<typeof SummarizeEmotionalTrendOutputSchema>;

export async function summarizeEmotionalTrend(input: SummarizeEmotionalTrendInput): Promise<SummarizeEmotionalTrendOutput> {
  return summarizeEmotionalTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmotionalTrendPrompt',
  input: {schema: SummarizeEmotionalTrendInputSchema},
  output: {schema: SummarizeEmotionalTrendOutputSchema},
  prompt: `You are an AI assistant that analyzes emotional trends over time from a series of emotion data points and provides a summary of the overall emotional trend.

Analyze the following emotional data points:

{{#each this}}
- Emotion: {{emotion}}, Timestamp: {{timestamp}}
{{/each}}

Provide a concise summary of the emotional trends observed over time.
`,
});

const summarizeEmotionalTrendFlow = ai.defineFlow(
  {
    name: 'summarizeEmotionalTrendFlow',
    inputSchema: SummarizeEmotionalTrendInputSchema,
    outputSchema: SummarizeEmotionalTrendOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
