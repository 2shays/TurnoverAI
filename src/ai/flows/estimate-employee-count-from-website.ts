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
  
  Then, perform a web search to find external information about the company to corroborate your findings. Look for LinkedIn company profiles, news articles, or business directory listings that mention employee numbers.

  Your final reasoning should synthesize information from both the company's website and the external sources you find. Consider factors like:
  - **Team & Careers:** Check for "About Us", "Team", or "Careers" pages on the primary website. The number of open positions or listed team members is a strong signal.
  - **External Profiles:** Use your web search to find the company's LinkedIn page and note the employee count listed there. This is a very strong indicator.
  - **Products & Services:** A large and complex portfolio of products or services suggests a larger team.
  - **Locations:** Mentions of multiple offices or international locations indicate a larger workforce.
  - **Website Quality & Complexity:** A simple website might indicate a smaller team, but this can be misleading. Always cross-reference with external search results.
  - **Client & Partner Logos:** A long list of well-known clients can suggest a company with significant operational capacity.

  Based on a combination of these factors, provide a single, most likely estimated employee count. Provide detailed reasoning for your estimate, referencing specific observations from the website and the external sources you discovered in your web search. Avoid single-digit estimates unless all sources strongly indicate a solo venture.

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
