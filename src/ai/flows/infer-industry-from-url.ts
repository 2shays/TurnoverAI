// This file is machine-generated - edit at your own risk.
'use server';
/**
 * @fileOverview Infers the industry of a company from its website URL.
 *
 * - inferIndustryFromUrl - A function that infers the industry from a URL.
 * - InferIndustryFromUrlInput - The input type for the inferIndustryFromUrl function.
 * - InferIndustryFromUrlOutput - The return type for the inferIndustryFromUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InferIndustryFromUrlInputSchema = z.object({
  url: z.string().describe('The URL of the company website.'),
});
export type InferIndustryFromUrlInput = z.infer<typeof InferIndustryFromUrlInputSchema>;

const InferIndustryFromUrlOutputSchema = z.object({
  industry: z.string().describe('The inferred industry of the company.'),
});
export type InferIndustryFromUrlOutput = z.infer<typeof InferIndustryFromUrlOutputSchema>;

export async function inferIndustryFromUrl(input: InferIndustryFromUrlInput): Promise<InferIndustryFromUrlOutput> {
  return inferIndustryFromUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inferIndustryFromUrlPrompt',
  input: {schema: InferIndustryFromUrlInputSchema},
  output: {schema: InferIndustryFromUrlOutputSchema},
  prompt: `You are an expert in determining the industry of a company based on its website URL.

  Analyze the URL provided and infer the most likely industry the company operates in.

  URL: {{{url}}}
  Industry:`,
});

const inferIndustryFromUrlFlow = ai.defineFlow(
  {
    name: 'inferIndustryFromUrlFlow',
    inputSchema: InferIndustryFromUrlInputSchema,
    outputSchema: InferIndustryFromUrlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
