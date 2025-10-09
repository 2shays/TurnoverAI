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
  prompt: `You are an expert business analyst. Your task is to determine the industry of a company by analyzing its website and external information.

  First, do a thorough analysis of the website content at the following URL: {{{url}}}
  - Analyze the main landing page content, including headings and key sections.
  - Review the "About Us", "Services", and "Products" pages if they exist.
  - Look for keywords, product descriptions, and mission statements.

  Next, perform a web search to gather external context about the company. Look for its classification in business directories (like LinkedIn), news articles, or its own description on social media profiles.

  Based on your combined analysis of the website's content and the external web search, infer the most specific and accurate industry for the company.
  
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
