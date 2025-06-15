'use server';

/**
 * @fileOverview An AI agent that analyzes the emotional tone of text.
 *
 * - analyzeEmotionalTone - A function that handles the emotional tone analysis process.
 * - AnalyzeEmotionalToneInput - The input type for the analyzeEmotionalTone function.
 * - AnalyzeEmotionalToneOutput - The return type for the analyzeEmotionalTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmotionalToneInputSchema = z.object({
  text: z.string().describe('The text to analyze for emotional tone.'),
});
export type AnalyzeEmotionalToneInput = z.infer<
  typeof AnalyzeEmotionalToneInputSchema
>;

const AnalyzeEmotionalToneOutputSchema = z.object({
  dominantEmotion: z
    .string() // Consider making this an enum for specific emotions.
    .describe('The dominant emotion detected in the text.'),
  emotionIntensity: z
    .number() // Or a string like "high", "medium", "low"
    .describe('The intensity of the dominant emotion (0-1).'),
  emotionalBreakdown: z
    .record(z.string(), z.number())
    .describe(
      'A breakdown of all emotions detected and their corresponding scores.'
    ),
});
export type AnalyzeEmotionalToneOutput = z.infer<
  typeof AnalyzeEmotionalToneOutputSchema
>;

export async function analyzeEmotionalTone(
  input: AnalyzeEmotionalToneInput
): Promise<AnalyzeEmotionalToneOutput> {
  return analyzeEmotionalToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmotionalTonePrompt',
  input: {schema: AnalyzeEmotionalToneInputSchema},
  output: {schema: AnalyzeEmotionalToneOutputSchema},
  prompt: `You are an advanced AI trained in detecting human emotions from text.
  Analyze the following text and determine the predominant emotion, its intensity, and a detailed breakdown of all emotions present.

  Text: {{{text}}}

  Provide the output in JSON format, following the schema defined. Make sure the emotionalBreakdown sums to 1.0.`,
});

const analyzeEmotionalToneFlow = ai.defineFlow(
  {
    name: 'analyzeEmotionalToneFlow',
    inputSchema: AnalyzeEmotionalToneInputSchema,
    outputSchema: AnalyzeEmotionalToneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
