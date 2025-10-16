'use server';
/**
 * @fileOverview Predicts company turnover based on a weighted, flexible, and self-adjusting prediction model.
 *
 * - predictTurnover - A function that predicts turnover using a detailed equation.
 * - PredictTurnoverInput - The input type for the predictTurnover function.
 * - PredictTurnoverOutput - The return type for the predictTurnover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const IndustryBenchmarkSchema = z.object({
  industry: z.string(),
  turnover: z.number(),
  employees: z.number(),
  company_name: z.string().optional(),
});

const PredictTurnoverInputSchema = z.object({
  url: z.string().describe('The URL of the company website.'),
  industry: z.string().optional().describe('An optional, user-provided industry to override AI inference.'),
  employees: z.number().optional().describe('An optional, user-provided employee count to override AI inference.'),
  benchmarkData: z.array(IndustryBenchmarkSchema).optional().describe('Optional curated benchmark data from the database.'),
});
export type PredictTurnoverInput = z.infer<typeof PredictTurnoverInputSchema>;

const SourceSchema = z.object({
  name: z.string().describe('The name of the data point, e.g., "Most Recently Reported Revenue".'),
  value: z.string().describe('The value found for the data point.'),
});

const CalculationComponentSchema = z.object({
  description: z.string().describe("Descriptive label for the calculation component, e.g., 'Third party revenue data adjusted by Industry Average growth till FY25'"),
  calculation: z.string().describe("The calculation for this component, e.g., '56,99,96,160 * 0.50'"),
  value: z.number().describe("The resulting value of the component calculation."),
});

const PredictTurnoverOutputSchema = z.object({
  predictedTurnover: z.number().describe('The predicted annual turnover in INR for FY25.'),
  confidenceScore: z.number().describe('A confidence score for the prediction, from 0 to 100.'),
  inferredIndustry: z.string().describe('The industry inferred by the AI.'),
  inferredEmployees: z.number().describe('The employee count inferred by the AI.'),
  reasoning: z.string().describe('A structured output showing the model, working, and a summary of the reasoning. This is NOT displayed in the UI but is used for debugging.'),
  equation: z.string().describe('The final mathematical equation used for the prediction. e.g., "(1456000000 * 0.833) + (250000000 * 0.167) = 1420000000"'),
  sources: z.array(SourceSchema).describe('An array of objects detailing the data points and their values.'),
  calculationBreakdown: z.array(CalculationComponentSchema).describe("A structured breakdown of the final turnover calculation, with descriptive labels."),
});
export type PredictTurnoverOutput = z.infer<typeof PredictTurnoverOutputSchema>;


export async function predictTurnover(input: PredictTurnoverInput): Promise<PredictTurnoverOutput> {
  return predictTurnoverFlow(input);
}

const predictTurnoverPrompt = ai.definePrompt({
  name: 'predictTurnoverPrompt',
  input: {schema: PredictTurnoverInputSchema},
  output: {schema: PredictTurnoverOutputSchema},
  prompt: `
You are a highly experienced financial analyst executing a comprehensive research and calculation process to predict the current fiscal year (FY25) turnover (revenue) for the target company. Your process MUST be rigorous and transparent.

Input URL: {{{url}}}
{{#if industry}}
Provided Industry: {{{industry}}} (Use this industry and skip identification. Set inferredIndustry to this value.)
{{/if}}
{{#if employees}}
Provided Employee Count: {{{employees}}} (Use this for Variable B. Set inferredEmployees to this value.)
{{/if}}
{{#if benchmarkData}}
Reference Database: You have been provided with the following curated benchmark data from public companies. Use this as a strong reference point to compare the data on employees and revenue you will be collecting for the target company. You must normalize the reference data against the target company's scale.
{{/if}}

Target Prediction Period: Focus on finding data as close to the current Fiscal Year FY25 as possible.

Phase 1: Dynamic Profiling and Sourcing
Identify Industry: {{#if industry}}Use the provided industry: '{{{industry}}}' and set inferredIndustry.{{else}}Analyze the website at {{{url}}} to determine the company's primary industry and sub-sector. Prioritize the company's own description on its "About Us" or "Products" page. Set the result to the 'inferredIndustry' output field.{{/if}}

Source Constants: Based **only** on the identified industry, perform web searches to find the following five required constants for FY25. Search for terms like "average annual growth rate for [industry] in India", "average revenue per employee for [industry] in India" etc. 
- Industry Annual Growth Rate (Percentage used to project Ra).
- Revenue Per Employee (RPE) (for Rb benchmark, in INR/employee).
- Average Revenue Per Product Line (for Rc benchmark, in INR).
- Average Rent-to-Revenue Ratio (for Rd benchmark, as a decimal percentage, e.g., 0.025).
- Fixed Annual Rent Cost per Location: Use a fixed INR 1.5 Cr (1,50,00,000 INR) per location.

Phase 2: Mandatory Data Collection
You must perform dedicated web searches to find a data point for all four components. Note the initial weights.
**CRITICAL RESEARCH DIRECTIVE**: Prioritize data from Indian financial data platforms like **Tracxn, Tofler, InstaFinancials, and Zauba Corp**. Also search Indian credit rating agency reports from **CRISIL, ICRA, CARE, and ACUITE**. Always use the **most recently reported** fiscal year data (e.g., prefer FY24 data over FY22).

Variable Data to Find (Initial Weight)
A. Most Recently Reported Revenue (Ra) (50%): Find the **most recently reported** Annual Turnover (Revenue) and its corresponding Fiscal Year. Use the provided benchmarkData as a primary reference if a company match is found.
B. Employee Benchmark (Rb) (20%): {{#if employees}}Use the provided count of {{{employees}}} and set inferredEmployees.{{else}}First, thoroughly analyze the company website (About Us, Our Team pages) for an employee count. If not found, perform targeted web searches using the same platforms listed above. If you find a range, take the average. Set the result to the 'inferredEmployees' output field. Do not infer 0 unless the company is explicitly a one-person entity.{{/if}}
C. Product Lines (Rc) (20%): Analyze the company's website ({{{url}}}) to count the number of distinct major Product Lines or service Categories. The primary source for this is the website itself and most likely found under the products or services page.
D. Locations (Rd) (10%): Search for the company's "locations", "offices", or "manufacturing plants" to count key domestic/primary operational locations this would mainly be on the companies contact us page.

Phase 3: Calculation and Weight Adjustment
**CRITICAL CALCULATION RULE**: Before any calculation, you MUST convert all found values into base units of INR. For example, "130 Cr" becomes 1300000000. If you find an employee range like "11-50", you must use the average (30.5, rounded to 31) for calculation.
- Adjust Weights: Sum the initial weights of all *found* variables. If any variable was not found, redistribute its weight proportionally across the remaining found variables. The final sum of adjusted weights must be 1.00 (100%).
- Calculate Estimated Revenue (Ri): All calculations must be in base units of INR (not Cr or L).
  - Ra = (Found Revenue) * (1 + Industry Growth Rate)
  - Rb = (Found Employee Count) * RPE
  - Rc = (Found Product Line Count) * Avg. Rev./Line
  - Rd = ((Found Location Count) * 15000000) / Rent-to-Revenue Ratio
- Compute Final Predicted Turnover: Apply the adjusted weights to the calculated Ri values for only the *found* variables.
  - Predicted Turnover = ∑{for each Found Variable i} (Ri * Adjusted Weight_i)

Phase 4: Structured Output
- **reasoning**: For debugging only. Keep this concise. Show constants, calculated Ri values, and a summary.
- **equation**: Place ONLY the final weighted calculation string here. Example: "(1456000000 * 0.833) + (250000000 * 0.167) = 1420000000"
- **sources**: For each Constant and Variable found, create an entry in the 'sources' array.
- **calculationBreakdown**: Create a structured breakdown for the final calculation. For EACH component used in the final sum:
  - description: A descriptive label. e.g. "Third party revenue data adjusted by Industry Average growth till FY25" for Ra, or "Revenue estimated based on the number of employees for the company" for Rb.
  - calculation: The string showing the calculation for that component, e.g., "1,30,00,00,000 * 1.12".
  - value: The numerical result of that component's calculation *before* weighting, e.g. 1456000000.
  You will then apply the weights to these values for the final 'predictedTurnover'.

Ensure the overall output is valid JSON matching the PredictTurnoverOutputSchema schema, with 'predictedTurnover' as a number in INR.
  `,
});

const predictTurnoverFlow = ai.defineFlow(
  {
    name: 'predictTurnoverFlow',
    inputSchema: PredictTurnoverInputSchema,
    outputSchema: PredictTurnoverOutputSchema,
  },
  async input => {
    const {output} = await predictTurnoverPrompt(input);
    return output!;
  }
);

    