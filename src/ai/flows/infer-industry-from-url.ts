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
  prompt: `You are an expert business analyst. Your task is to determine the most accurate and standardized industry for a company by analyzing its website and external classifications.

  **Process:**

  1.  **Identify Primary Product/Service (CRITICAL):**
      - First, conduct a thorough analysis of the website content at the following URL: {{{url}}}
      - **Your primary goal is to determine the *specific products or services* that generate the bulk of the company's revenue.** Look at the main landing page, the "Products/Services" section, and client case studies.
      - **Use the list of actual products (e.g., 'Dyes and Chemicals', 'OTSA', 'ONAPSA') to infer the specific industry.** *If the company produces chemicals for textiles/dyes, classify it as 'Specialty Chemicals/Dyes and Intermediates', NOT 'Pharmaceuticals', even if it produces some drug intermediates.*

  2.  **Prioritize Standardized External Classification:**
      - Perform a web search for the company's official industry code or classification. Use queries like "[Company Name] NIC code", "[Company Name] NAICS", or "[Company Name] SIC code". Also check business directory classifications like LinkedIn, Tracxn, or business registry filings.
      - **If an official classification is found (e.g., 'Manufacture of basic chemicals'), use this as the primary, standardized industry name.**

  3.  **Synthesize and Conclude:**
      - Based on your analysis, infer the most specific and accurate industry.
      - *Avoid vague terms (e.g., "Technology", "Manufacturing"). Use specific terms like "Basic Chemicals Manufacturing," "Specialty Dyes and Intermediates," or "Enterprise Software Development."*

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
