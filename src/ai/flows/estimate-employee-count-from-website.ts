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
  prompt: `You are an expert in estimating the number of employees a company has based on its website.

  Analyze the content and complexity of the website at the following URL: {{{websiteUrl}}}.

  Consider factors such as:
  - Website complexity (number of pages, features, etc.)
  - Content volume (amount of text, images, etc.)
  - Assumed growth signals (mentions of hiring, new products, etc.)
  - Domain reputation (age, authority, etc.)

  Provide an estimate of the number of employees and a detailed reasoning for your estimate.
  Include explanation of how the estimate was created.

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
