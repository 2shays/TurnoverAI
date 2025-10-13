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
  prompt: `You are an expert business analyst. Your primary task is to find the employee count for the company at the URL: {{{websiteUrl}}}

**Process:**

1.  **Prioritize Direct Website Text:**
    - Search the company's website (especially 'About Us' and 'Careers' pages) for an explicit number related to employees, workforce, or team size (e.g., "more than 250 employees").
    - If found, this is your **primary source of truth**.

2.  **External Data Search and Conflict Resolution:**
    - Simultaneously search reputable external data providers (e.g., Tracxn, LinkedIn, Tofler) for an employee count.
    - **Compare the external number to the website number.**
    - **If the website provides a clear, explicit number (e.g., '250+ members of workforce'), use that as your final answer.** The company's own statement is often the most current and authoritative, even if it is a rounded figure.
    - **If an external source provides a significantly different number (e.g., Tracxn reports '67 employees as on Jan 31, 2025'), note this discrepancy in your reasoning.** Explain why you are prioritizing the website's claim (e.g., "The company's website states a larger team size, which is considered more up-to-date than a third-party report.").

3.  **Reasoning:**
    - Provide a concise explanation of your process.
    - **State the number you chose as your final answer.**
    - **Clearly state the source of this number.**
    - **Explicitly mention any conflicting numbers and explain your rationale for selecting the final count.**

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
