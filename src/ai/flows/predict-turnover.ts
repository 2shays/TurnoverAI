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
  reasoning: z.string().describe('The detailed reasoning behind the turnover prediction, referencing any third-party data found and the benchmarks used.'),
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

  1.  **Prioritize Direct Financial Data:** First and foremost, perform a targeted web search for the company's reported turnover or revenue. Use queries like "[Company Name] turnover", "[Company Name] revenue", and check financial data providers like **Tracxn, Tofler, CRISIL, ICRA, CARE, Acuite and other public business directories**.
  
  2.  **Internal & External Benchmark Analysis:** Use the \`getBenchmarkData\` tool to retrieve the internal reference database of public companies.
      a.  **Internal Data First:** Compare the target company to similar companies within the same industry ({{{industry}}}) from the internal reference database you just fetched.
      b.  **External Web Search:** Supplement your internal data by performing a web search to find reliable financial benchmarks for the specified industry ({{{industry}}}). Focus on finding the average "revenue per employee" and "growth rate" for companies in this sector in India.

  3.  **Turnover Calculation:**
      - **If you found direct data from Step 1:** Use this as a baseline and if you found multiple data points combine them into one single baseline but prioritise the most recent data point. Check the year of the data you found (if it's combined use the most recent date), adjust the baseline turnover based on the industry growth rate found in (2b) to **estimate the baseline for this year**.
      - **If you did NOT find direct data:** Calculate a baseline prediction by multiplying the employee count ({{{employees}}}) by the average revenue per employee you found in Step 2.
      - **Adjust the benchmark:** Use the information gathered from the internal database (2a) and the external search for "revenue per employee" (2b). Using this information adjust the benchmark to come up with the \`predictedTurnover\`.

  4.  **Confidence Score:** Provide a confidence score between 0 and 100.
      - **High Confidence (80-100):** You found recent, direct turnover data for the target company from reliable sources.
      - **Medium Confidence (50-79):** You did not find a direct figure but found strong, consistent "revenue per employee" benchmarks from both your internal data and external web search for the specific industry.
      - **Low Confidence (0-49):** You could not find specific turnover data or reliable industry benchmarks, and the prediction is based on broad estimates.

  5.  **Reasoning:** This is critical. **Clearly explain your process.**
      - State what data you found from external sources like Tracxn or Tofler.
      - State what data you used from the internal database via the getBenchmarkData tool.
      - Explain how you arrived at the final \`predictedTurnover\` number, ensuring the final value is in INR.

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
