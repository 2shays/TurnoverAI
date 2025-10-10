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
  prompt: `You are an expert business analyst. Your task is to determine the most accurate and *standardized* industry for a company by analyzing its website and external classifications.

  **Process:**

  1.  **Identify Primary Product/Service (CRITICAL):**
      - First, conduct a thorough analysis of the website content at the following URL: {{{url}}}
      - **Your primary goal is to determine what the company *actually sells or does* to generate revenue.** Look at the main landing page, the "Products/Services" section, and client case studies.
      - ***Focus on the core activity***: Is it selling software, manufacturing goods, providing consulting, or logistics? The industry should reflect this core revenue-generating activity.

  2.  **Prioritize Standardized External Classification:**
      - **Perform a web search for the company's official industry code or classification.** Use queries like "[Company Name] NIC code", "[Company Name] NAICS", or "[Company Name] SIC code". Also check business directory classifications like LinkedIn, Tracxn, or business registry filings.
      - **If an official or widely-accepted standardized classification (e.g., 'Software Publishing', 'Chemical Manufacturing') is found, use that as the basis for the \`Industry\` name.**

  3.  **Synthesize and Conclude:**
      - **Only if an official classification is unavailable**, infer the most specific and accurate industry based on the primary product/service identified in Step 1.
      - ***Avoid vague terms*** (e.g., "Technology"). Instead, use specific terms like "Enterprise Software Development," "FinTech," or "Logistics Services." *If a company self-describes as "Leading-edge Tech Solutions," but their core product is a mobile app for food delivery, the industry should be "Food Delivery/eCommerce" or "Software/App Development," not "Technology."*

  URL: {{{url}}}
  Industry:"`,
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
