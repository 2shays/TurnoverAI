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
  reasoning: z.string().describe('The detailed reasoning behind the turnover prediction, referencing the benchmarks used.'),
});
export type PredictTurnoverOutput = z.infer<typeof PredictTurnoverOutputSchema>;

export async function predictTurnover(input: PredictTurnoverInput): Promise<PredictTurnoverOutput> {
  return predictTurnoverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictTurnoverPrompt',
  input: {schema: PredictTurnoverInputSchema},
  output: {schema: PredictTurnoverOutputSchema},
  prompt: `You are an expert financial analyst specializing in private company valuation. Your task is to predict the annual turnover (in INR) for a company given its website URL, industry, and employee count.

  **Company Information:**
  - Website: {{{url}}}
  - Industry: {{{industry}}}
  - Employee Count: {{{employees}}}

  **Your Process:**

  1.  **Industry Benchmark Analysis:** Perform a web search to find reliable financial benchmarks for the specified industry ({{{industry}}}). Focus on finding the average "revenue per employee" or "turnover per employee" for companies in this sector. Look for data from financial reports, market analysis websites (like Statista, Gartner, or industry-specific associations), and business data providers. Prioritize recent data (last 1-2 years).

  2.  **Company-Specific Context:** Briefly analyze the company's website ({{{url}}}) to get a qualitative sense of its scale and market position. Does it appear to be a high-end/premium player or a volume-based business? Is it a startup or an established company? This context will help you adjust your final estimate.

  3.  **Turnover Calculation:**
      - Start with a baseline prediction by multiplying the estimated employee count ({{{employees}}}) by the average revenue per employee you found for the industry.
      - Adjust this baseline prediction up or down based on your qualitative analysis of the company's website. For example, if the company seems more premium than average, you might adjust the turnover slightly upward.
      - The final output for 'predictedTurnover' must be a single number in INR.

  4.  **Confidence Score:** Provide a confidence score between 0 and 100. Base this score on:
      - The quality and availability of the industry benchmark data you found. (High confidence if you found multiple, consistent sources for revenue per employee).
      - The clarity of the company's business model from its website. (High confidence if it's very clear what they sell and who their customers are).

  5.  **Reasoning:** Clearly explain the steps you took. State the average revenue per employee benchmark you used and cite the source if possible. Explain how you adjusted the baseline prediction based on the website context.

  Ensure the output is valid JSON matching the PredictTurnoverOutputSchema schema.
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
