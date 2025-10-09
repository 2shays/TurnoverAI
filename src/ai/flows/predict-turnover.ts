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

export async function predictTurnover(input: PredictTurnoverInput): Promise<PredictTurnoverOutput> {
  return predictTurnoverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictTurnoverPrompt',
  input: {schema: PredictTurnoverInputSchema},
  output: {schema: PredictTurnoverOutputSchema},
  prompt: `You are an expert financial analyst specializing in private company valuation. You have access to an internal reference database containing turnover, employee count, and industry information for a set of companies. Your task is to predict the annual turnover (in INR) for a given company.

  **Company Information:**
  - Website: {{{url}}}
  - Industry: {{{industry}}}
  - Employee Count: {{{employees}}}

  **Your Process (in order of priority):**

  1.  **Prioritize Direct Financial Data:** First and foremost, perform a targeted web search for the company's reported turnover or revenue. Use queries like "[Company Name] turnover", "[Company Name] revenue", and check financial data providers like **Tracxn, Tofler, and other public business directories**. If you find a credible, recent turnover figure in INR, this should be the primary basis of your prediction.

  2.  **Internal & External Benchmark Analysis:** If and only if you cannot find a direct turnover figure, you will use benchmark analysis.
      a.  **Internal Data First:** Compare the target company to similar companies within the same industry ({{{industry}}}) from your internal reference database. Use their turnover and employee counts to establish a strong baseline.
      b.  **External Web Search:** Supplement your internal data by performing a web search to find reliable financial benchmarks for the specified industry ({{{industry}}}). Focus on finding the average "revenue per employee" for companies in this sector in India.

  3.  **Turnover Calculation:**
      - **If you found direct data in Step 1:** Use that number as your primary \`predictedTurnover\`. You may then slightly adjust it based on the company's website context (e.g., if it looks like a premium vs. a low-cost player).
      - **If you did NOT find direct data:** Calculate a baseline prediction by synthesizing the data from your internal database (2a) and the external "revenue per employee" benchmarks (2b). The employee count ({{{employees}}}) will be a key multiplier here.

  4.  **Confidence Score:** Provide a confidence score between 0 and 100.
      - **High Confidence (80-100):** You found a recent, specific turnover figure from a reliable third-party source (like Tracxn, Tofler).
      - **Medium Confidence (50-79):** You did not find a direct figure but found strong, consistent "revenue per employee" benchmarks from both your internal data and external web search for the specific industry.
      - **Low Confidence (0-49):** You could not find specific turnover data or reliable industry benchmarks, and the prediction is based on broad estimates.

  5.  **Reasoning:** This is critical. **Clearly explain your process.**
      - If you found third-party data, state the source and the figure (e.g., "Found a turnover of ₹130 Cr on Tracxn.").
      - If you used benchmarks, state the internal and external references you used (e.g., "Compared to similar companies in our database and used an external revenue-per-employee benchmark of X...").
      - Briefly mention how the company's website ({{{url}}}) supported or influenced your final decision.

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
