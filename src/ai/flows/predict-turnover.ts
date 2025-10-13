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
  reasoning: z.string().describe('A brief, summarized reasoning behind the turnover prediction, including key numbers and the final calculation.'),
});
export type PredictTurnoverOutput = z.infer<typeof PredictTurnoverOutputSchema>;


export async function predictTurnover(input: PredictTurnoverInput): Promise<PredictTurnoverOutput> {
  return predictTurnoverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictTurnoverPrompt',
  input: {schema: PredictTurnoverInputSchema},
  output: {schema: PredictTurnoverOutputSchema},
  prompt: `You are an expert financial analyst specializing in private company valuation. Your task is to predict the annual turnover for a company, synthesizing information from all available data points.

**Company Information:**
- Website: {{{url}}}
- Industry: {{{industry}}}
- Employee Count: {{{employees}}}

**Your Process:**

1.  **Comprehensive Data Search (Highest Priority):**
    - Perform a wide-ranging web search for the company's reported revenue or turnover. Use multiple queries targeting different years and sources, such as:
        - "[Company Name] revenue FY24" (or most recent fiscal year)
        - "[Company Name] turnover latest"
        - "[Company Name] Tofler"
        - "[Company Name] Tracxn"
        - "[Company Name] annual report"
        - Check for reports from rating agencies like CRISIL, ICRA, CARE, Acuite.
    - **This is the most critical step. A directly reported number from a reliable source is the strongest signal.**

2.  **Internal Database and Industry Benchmarking:**
    - Use your inherent knowledge and web search capabilities to find revenue-per-employee benchmarks for the specified industry: '{{{industry}}}'.
    - Analyze financial data of comparable public companies within the same sector.

3.  **Prediction and Justification (CRITICAL):**
    - **If a clear, recent turnover figure is available from Step 1:**
        - **Use that figure as your primary predicted turnover.**
        - State the source clearly in your reasoning (e.g., "Tracxn reports ₹130 Cr for FY24").
    - **If ONLY older or conflicting data exists:**
        - Explain the discrepancy.
        - Formulate a well-reasoned estimate, prioritizing the most reliable data point and explaining why others were discarded.
    - **If NO third-party turnover data is found:**
        - Fall back to a benchmark-based calculation.
        - Calculate the turnover by multiplying the employee count ({{{employees}}}) by a relevant revenue-per-employee figure for the industry.

4.  **Confidence Score:**
    - Provide a confidence score between 0 and 100.
    - High confidence (>85) for a direct, recent number from a reputable source.
    - Medium confidence (50-85) for older data or estimates based on strong benchmarks.
    - Low confidence (<50) if the prediction is based on limited data.

5.  **Reasoning (Concise Summary):**
    - Provide a **brief, summarized summary** of your findings and conclusion.
    - **Clearly state the primary turnover figure you found and its source.**
    - If no direct figure was found, show the simple calculation you used (e.g., "250 employees * ₹5L/employee = ₹12.5 Cr").
    - Briefly explain your final conclusion.

Ensure the output is valid JSON matching the \`PredictTurnoverOutputSchema\` schema, with \`predictedTurnover\` as a number in INR.
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
