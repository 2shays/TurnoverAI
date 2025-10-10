'use server';
/**
 * @fileOverview Estimates the employee count of a company based on its website content and complexity.
 *
 * - estimateEmployeeCountFromWebsite - A function that estimates employee count based on a website URL.
 * - EstimateEmployeeCountFromWebsiteInput - The input type for the estimateEmployeeCountFromWebsite function.
 * - EstimateEmployeeCountFromWebsiteOutput - The return type for the estimateEmployeeCountFromWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateEmployeeCountFromWebsiteInputSchema = z.object({
  websiteUrl: z
    .string()
    .describe('The URL of the company website to analyze.'),
});
export type EstimateEmployeeCountFromWebsiteInput = z.infer<typeof EstimateEmployeeCountFromWebsiteInputSchema>;

const EstimateEmployeeCountFromWebsiteOutputSchema = z.object({
  employeeCount: z
    .number()
    .describe('The estimated number of employees at the company.'),
  reasoning: z
    .string()
    .describe('The detailed reasoning behind the employee count estimation.'),
});
export type EstimateEmployeeCountFromWebsiteOutput = z.infer<typeof EstimateEmployeeCountFromWebsiteOutputSchema>;

export async function estimateEmployeeCountFromWebsite(input: EstimateEmployeeCountFromWebsiteInput): Promise<EstimateEmployeeCountFromWebsiteOutput> {
  return estimateEmployeeCountFromWebsiteFlow(input);
}

const estimateEmployeeCountPrompt = ai.definePrompt({
  name: 'estimateEmployeeCountPrompt',
  input: {schema: EstimateEmployeeCountFromWebsiteInputSchema},
  output: {schema: EstimateEmployeeCountFromWebsiteOutputSchema},
  prompt: `You are an expert business analyst specializing in extracting key data from company websites and external structured data sources.

  **Your primary task is to find the employee count for the company at the URL: {{{websiteUrl}}}**

  **Process:**

  1.  **Prioritize Direct Website Text Extraction (CRITICAL):**
      - First, thoroughly analyze the content of the primary website at {{{websiteUrl}}}.
      - **Your first priority is to perform a targeted search within the website's text for *any explicit number* that is immediately followed or preceded by an employee-related term** (e.g., "employees", "members of workforce", "team", "people", "staff", "FTEs"). Look especially on "About Us", "Our Team", and "Careers" pages.
      - **If you find a specific number or a clear minimum threshold (e.g., "more than 250 members"), use this number (or the minimum value, e.g., 250) directly as the \`employeeCount\`. This is the most reliable source when present.**

  2.  **External Structured Data Corroboration & Fallback:**
      - **If the number found in Step 1 is vague (e.g., 'a large team') or not found**, perform a web search for the company's employee count on **LinkedIn** and other major business directories (e.g., **Tracxn, ZoomInfo, business registries**). Use queries like "[Company Name] LinkedIn employees" or "[Company Name] employee count directory".
      - If you find a number from a high-confidence external source, use that. **If the external source conflicts with a specific number from the website text (Step 1), prioritize the explicit website text if it's a recent-looking page, as it often reflects the company's official claim.**

  3.  **Estimation (Last Resort):**
      - **If and only if both direct text analysis and external search yield no reliable number**, then you may estimate. Base your estimation on factors like the number of open positions on a "Careers" page, the size of a listed leadership team, the number of office locations, or the scale of products/services.

  4.  **Reasoning:**
      - Clearly state where you found the number (e.g., "*Found 'more than 250 members of workforce' on the About Us page, using 250 as the count.*" or "Found 250-500 employees on the company's LinkedIn page.").
      - If you had to estimate, explain the factors you used.

  Ensure your output is valid JSON matching the EstimateEmployeeCountFromWebsiteOutputSchema.
  `,
});

const estimateEmployeeCountFromWebsiteFlow = ai.defineFlow(
  {
    name: 'estimateEmployeeCountFromWebsiteFlow',
    inputSchema: EstimateEmployeeCountFromWebsiteInputSchema,
    outputSchema: EstimateEmployeeCountFromWebsiteOutputSchema,
  },
  async input => {
    const {output} = await estimateEmployeeCountPrompt(input);
    return output!;
  }
);
