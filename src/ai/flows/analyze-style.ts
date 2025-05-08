'use server';
/**
 * @fileOverview Analyzes the style attributes of an image.
 *
 * - analyzeStyle - A function that handles the style analysis process.
 * - AnalyzeStyleInput - The input type for the analyzeStyle function.
 * - AnalyzeStyleOutput - The return type for the analyzeStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStyleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeStyleInput = z.infer<typeof AnalyzeStyleInputSchema>;

const AnalyzeStyleOutputSchema = z.object({
  colorPalette: z
    .array(z.string())
    .describe('The main colors present in the image, as hex codes.'),
  clothingTypes:
    z.array(z.string()).describe('The types of clothing in the image.'),
  overallAesthetic: z
    .string()
    .describe('A description of the overall aesthetic of the image.'),
});
export type AnalyzeStyleOutput = z.infer<typeof AnalyzeStyleOutputSchema>;

export async function analyzeStyle(input: AnalyzeStyleInput): Promise<AnalyzeStyleOutput> {
  return analyzeStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStylePrompt',
  input: {schema: AnalyzeStyleInputSchema},
  output: {schema: AnalyzeStyleOutputSchema},
  prompt: `You are a fashion and style expert. Analyze the provided image and identify the key style attributes.

    Specifically, extract the color palette, identify the types of clothing, and describe the overall aesthetic.

    Image: {{media url=photoDataUri}}
    `,
});

const analyzeStyleFlow = ai.defineFlow(
  {
    name: 'analyzeStyleFlow',
    inputSchema: AnalyzeStyleInputSchema,
    outputSchema: AnalyzeStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
