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
  prompt: `You are an expert business analyst specializing in estimating company size and revenue based on publicly available digital footprints.

  Your task is to analyze the website at the provided URL: {{{websiteUrl}}}.

  Based on a thorough analysis of the website's content, structure, and apparent business model, provide a thoughtful estimate of the company's employee count.

  Your reasoning should consider factors like:
  - The quality and complexity of the website (e.g., custom design, number of pages, advanced features like user accounts or e-commerce).
  - The company's products or services and their likely market (e.g., enterprise B2B software vs. a local consumer service).
  - Language and content (e.g., 'careers' pages, mentions of multiple office locations, investor relations sections, press releases).
  - The overall perceived maturity and scale of the operation as suggested by its online presence.

  Provide your estimated employee count and a detailed reasoning that explains how you arrived at your conclusion, referencing specific observations from the website.

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
