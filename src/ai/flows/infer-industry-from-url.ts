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
  prompt: `You are an expert business analyst. Your task is to determine the most accurate industry for a company by analyzing its website.

  **Process:**

  1.  **Prioritize Website's Own Description (CRITICAL):**
      - First, conduct a thorough analysis of the website content at the following URL: {{{url}}}
      - **Your primary goal is to find how the company describes itself.** Look at the main landing page, the "About Us" page, and page footers.
      - Trust the company's own words. For example, if it says "manufacturer and exporter of Basic Chemicals, Dyes and Intermediates," the industry is "Chemicals" or "Chemical Manufacturing", not "Pharmaceuticals".

  2.  **External Corroboration (If Needed):**
      - **Only if the website is unclear or ambiguous**, perform a web search to gather external context. Look for its classification in business directories (like LinkedIn), news articles, or its own description on social media profiles.

  3.  **Synthesize and Conclude:**
      - Based on your analysis, with the highest priority given to the company's self-description on its own website, infer the most specific and accurate industry.

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
