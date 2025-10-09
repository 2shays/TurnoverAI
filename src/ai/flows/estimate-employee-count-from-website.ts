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

  Your task is to provide a realistic estimate of a company's employee count.

  First, perform a thorough analysis of the website at the provided URL: {{{websiteUrl}}}.
  
  Then, perform a web search to find external information about the company to corroborate your findings. Look for company profiles, news articles, or business directory listings that mention employee numbers.

  Consider factors like:
  - **Team & Careers:** Check for "About Us", "Team", or "Careers" pages on the primary website. The number of open positions or listed team members is a strong signal. The About section may have mentioned the companies employee numbers in the description either as a number, range or approximation.
  - **External Profiles:** Use your web search to find the company's employee number from other third party sites.
  - **Products & Services:** A large and complex portfolio of products or services suggests a larger team.
  - **Locations:** Mentions of multiple offices or international locations indicate a larger workforce.
  - **Client & Partner Logos:** A long list of well-known clients can suggest a company with significant operational capacity.

  Your final estimate should firstly use any information you've found directly on the company website. If there is no direct information on the company website, based on a combination of these factors, provide a single, most likely estimated employee count. 

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
