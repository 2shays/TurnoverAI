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
  prompt: `You are an expert business analyst specializing in extracting key data from company websites.

  **Your primary task is to find the employee count for the company at the URL: {{{websiteUrl}}}**

  **Process:**

  1.  **Prioritize Direct Information (CRITICAL):**
      - First, thoroughly analyze the content of the primary website at {{{websiteUrl}}}.
      - **Your first priority is to find an explicit mention of employee count**. Scour the "About Us", "Our Team", "Company", "Who We Are", or "Careers" pages. Look for phrases like "members of our workforce", "number of employees", "team of X people", etc.
      - **If you find a specific number (e.g., "250 employees", "more than 250 members"), use that number directly as the \`employeeCount\`. This is the most reliable source.**

  2.  **External Corroboration & Fallback:**
      - **Only if you cannot find any mention of employee count on the primary website**, perform a web search to find external information. Look for the company's LinkedIn profile, news articles, or business directory listings that mention employee numbers.
      - If you find a number from a reliable external source, use that.

  3.  **Estimation (Last Resort):**
      - **If and only if both direct analysis and external search yield no numbers**, then you may estimate. Base your estimation on factors like the number of open positions on a "Careers" page, the size of a listed leadership team, the number of office locations, or the scale of products/services.

  4.  **Reasoning:**
      - Clearly state where you found the number (e.g., "Found '250 members of workforce' on the About Us page.").
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
