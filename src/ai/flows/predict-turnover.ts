'use server';
/**
 * @fileOverview Predicts company turnover based on URL, industry, and employee count.
 *
 * - predictTurnover - A function that predicts turnover.
 * - PredictTurnoverInput - The input type for the predictTurnover function.
 * - PredictTurnoverOutput - The return type for the predictTurnover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getBenchmarkData } from '@/app/actions';

const PredictTurnoverInputSchema = z.object({
  url: z.string().describe('The URL of the company website.'),
  industry: z.string().describe('The industry of the company.'),
  employees: z.number().describe('The estimated number of employees.'),
});
export type PredictTurnoverInput = z.infer<typeof PredictTurnoverInputSchema>;

const PredictTurnoverOutputSchema = z.object({
  predictedTurnover: z.number().describe('The predicted annual turnover in INR.'),
  confidenceScore: z.number().describe('A confidence score for the prediction, from 0 to 100.'),
  reasoning: z.string().describe('A brief, summarized reasoning behind the turnover prediction, including key numbers and the final calculation.'),
});
export type PredictTurnoverOutput = z.infer<typeof PredictTurnoverOutputSchema>;

export const getBenchmarkDataTool = ai.defineTool(
    {
      name: 'getBenchmarkData',
      description: 'Retrieves internal benchmark data for public companies from the database, including turnover, employee count, and industry.',
      inputSchema: z.object({}),
      outputSchema: z.any(),
    },
    async () => {
        return await getBenchmarkData();
    }
);


export async function predictTurnover(input: PredictTurnoverInput): Promise<PredictTurnoverOutput> {
  return predictTurnoverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictTurnoverPrompt',
  input: {schema: PredictTurnoverInputSchema},
  output: {schema: PredictTurnoverOutputSchema},
  tools: [getBenchmarkDataTool],
  prompt: `You are an expert financial analyst specializing in private company valuation. Your task is to predict the annual turnover (in INR) for a given company as of this year.

  **Company Information:**
  - Website: {{{url}}}
  - Industry: {{{industry}}}
  - Employee Count: {{{employees}}}

  **Your Process (in order of priority):**

  1.  **Prioritize Direct Financial Data:** First and foremost, perform a targeted web search for the company's reported turnover or revenue. Use queries like "[Company Name] turnover", "[Company Name] revenue", and check financial data providers like **Tracxn, Tofler, CRISIL, ICRA, CARE, Acuite and other public business directories**. If you find a figure, prioritize it.

  2.  **Internal & External Benchmark Analysis:**
      a.  **Internal Data First:** Use the \`getBenchmarkData\` tool to retrieve the internal reference database of public companies. Compare the target company to similar companies within the same industry ({{{industry}}}).
      b.  **External Web Search:** Supplement your internal data by performing a web search to find reliable financial benchmarks for the specified industry ({{{industry}}}). Focus on finding the average "revenue per employee" for companies in this sector in India.

  3.  **Turnover Calculation:**
      - **If you found direct data from Step 1:** Use this as your baseline. Adjust the baseline turnover based on the industry growth rate and/or data from your benchmarks to estimate the turnover for this year.
      - **If you did NOT find direct data:** Calculate a baseline prediction by multiplying the employee count ({{{employees}}}) by the average revenue per employee you found in Step 2.
      - **Adjust the benchmark:** Use the information gathered from the internal database (2a) and the external search for "revenue per employee" (2b) to refine your baseline and come up with the final \`predictedTurnover\`.

  4.  **Confidence Score:** Provide a confidence score between 0 and 100 based on the quality of data you found. High confidence for direct turnover data, medium for strong benchmarks, low for pure estimation.

  5.  **Reasoning (SUMMARIZE THIS SECTION):** This is critical. Provide a **brief and concise** explanation of your process.
      - **Summarize your findings:** State key numbers found (e.g., "Found turnover of ₹130 Cr on Tracxn for FY22").
      - **Show your work:** Briefly explain the calculation. For example: "Based on a revenue per employee of ₹50L in the {{{industry}}} sector, the calculation is 250 employees * ₹50L/employee = ₹125 Cr."
      - Keep the entire reasoning to a few short, clear sentences.

  Ensure the output is valid JSON matching the PredictTurnoverOutputSchema schema, with \`predictedTurnover\` as a number in INR.
  `,
});

const predictTurnoverFlow = ai.defineFlow(
  {
    name: 'predictTurnoverFlow',
    inputSchema: PredictTurnoverInputSchema,
    outputSchema: PredictTurnoverOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
