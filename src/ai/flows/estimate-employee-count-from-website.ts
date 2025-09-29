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
  prompt: `You are an expert business analyst specializing in estimating company size based on public web data.

  Your task is to analyze the website at the provided URL: {{{websiteUrl}}} and provide a realistic estimate of the company's employee count.

  Perform a thorough analysis of the website, looking for signals of company size. Your reasoning should consider factors like:
  - **Team & Careers:** Check for "About Us", "Team", or "Careers" pages. The number of open positions or listed team members is a strong signal.
  - **Products & Services:** A large and complex portfolio of products or services suggests a larger team is needed for development, sales, and support.
  - **Locations:** Mentions of multiple offices or international locations indicate a larger, more distributed workforce.
  - **Website Quality & Complexity:** A highly polished, custom-designed website with many pages and features (e.g., e-commerce, user accounts) often correlates with a larger company than a simple template-based site.
  - **Client & Partner Logos:** A long list of well-known clients or partners can suggest a company with significant operational capacity.
  - **Language and Tone:** Is the language geared towards enterprise clients or small businesses? This can hint at the scale of their operations.

  Based on these factors, provide an estimated employee count. Avoid single-digit estimates unless the website explicitly looks like a personal portfolio or a solo venture. Provide detailed reasoning for your estimate, referencing specific observations from the website.

  Ensure the output is valid JSON matching the EstimateEmployeeCountFromWebsiteOutputSchema schema.
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
