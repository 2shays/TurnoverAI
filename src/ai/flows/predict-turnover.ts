'use server';
/**
 * @fileOverview Predicts company turnover based on a weighted, flexible, and self-adjusting prediction model.
 *
 * - predictTurnover - A function that predicts turnover using a detailed equation.
 * - PredictTurnoverInput - The input type for the predictTurnover function.
 * - PredictTurnoverOutput - The return type for the predictTurnover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictTurnoverInputSchema = z.object({
  url: z.string().describe('The URL of the company website.'),
  industry: z.string().optional().describe('An optional, user-provided industry to override AI inference.'),
  employees: z.number().optional().describe('An optional, user-provided employee count to override AI inference.'),
});
export type PredictTurnoverInput = z.infer<typeof PredictTurnoverInputSchema>;

const SourceSchema = z.object({
  name: z.string().describe('The name of the data point, e.g., "Most Recently Reported Revenue".'),
  value: z.string().describe('The value found for the data point.'),
  source: z.string().url().optional().describe('The URL where the data was found.'),
});

const PredictTurnoverOutputSchema = z.object({
  predictedTurnover: z.number().describe('The predicted annual turnover in INR for FY25.'),
  confidenceScore: z.number().describe('A confidence score for the prediction, from 0 to 100.'),
  inferredIndustry: z.string().describe('The industry inferred by the AI.'),
  inferredEmployees: z.number().describe('The employee count inferred by the AI.'),
  reasoning: z.string().describe('A structured output showing the model, working, and a summary of the reasoning.'),
  sources: z.array(SourceSchema).describe('An array of objects detailing the data points, their values, and their sources.'),
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
Goal: Execute a comprehensive research and calculation process to predict the current fiscal year (FY25) turnover (revenue) for the target company using a Weighted, Flexible, and Self-Adjusting Prediction Model.

Input URL: {{{url}}}
{{#if industry}}
Provided Industry: {{{industry}}} (Use this industry and skip identification. Set inferredIndustry to this value.)
{{/if}}
{{#if employees}}
Provided Employee Count: {{{employees}}} (Use this for Variable B. Set inferredEmployees to this value.)
{{/if}}

Target Prediction Period: Current Fiscal Year (FY25, assume year ending March 31 of the current calendar year).

Core Constraint: DO NOT use or hallucinate any data point for which reliable, external, and verifiable information cannot be found. For every data point found, you MUST provide the exact, verifiable URL in the 'source' field of the 'sources' array. It is forbidden to invent or guess a URL. If you cannot find a valid, working URL for a data point, you MUST treat that data as "Not Found" and drop the variable from the calculation.

Phase 1: Dynamic Profiling and Sourcing
Identify Industry: {{#if industry}}Use the provided industry: '{{{industry}}}' and set inferredIndustry.{{else}}Analyze the website at {{{url}}} to determine the company's primary industry and sub-sector. Prioritize the company's own description on its "About Us" or "Products" page. Set the result to the 'inferredIndustry' output field.{{/if}}

Source Constants: Based **only** on the identified industry, perform web searches to find the following five required constants for FY25. You MUST find these and their source URL. Search for terms like "average revenue per employee for [industry] in India".
- Industry Annual Growth Rate (Percentage used to project Ra).
- Revenue Per Employee (RPE) (for Rb benchmark, in INR/employee).
- Average Revenue Per Product Line (for Rc benchmark, in INR).
- Average Rent-to-Revenue Ratio (for Rd benchmark, as a decimal percentage, e.g., 0.025).
- Fixed Annual Rent Cost per Location: Use a fixed INR 1.5 Cr (1,50,00,000 INR) per location.

Phase 2: Mandatory Data Collection (4 Components)
You must perform dedicated web searches to find a verifiable data point and its source URL for all four components. Note the initial weights.
**CRITICAL RESEARCH DIRECTIVE**: Prioritize data from Indian financial data platforms like **Tracxn, Tofler, InstaFinancials, and Zauba Corp**. Also search Indian credit rating agency reports from **CRISIL, ICRA, CARE, and ACUITE**. Always use the **most recently reported** fiscal year data (e.g., prefer FY24 data over FY22).

Variable Data to Find (Initial Weight)
A. Most Recently Reported Revenue (Ra) (50%): Find the **most recently reported** Annual Turnover (Revenue) and its corresponding Fiscal Year.
B. Employee Benchmark (Rb) (20%): {{#if employees}}Use the provided count of {{{employees}}} and set inferredEmployees.{{else}}First, thoroughly analyze the company website (About Us, Our Team pages) for an employee count. If not found, perform targeted web searches using the same platforms listed above. If you find a range, take the average. Set the result to the 'inferredEmployees' output field. Do not infer 0 unless the company is explicitly a one-person entity.{{/if}}
C. Product Lines (Rc) (20%): Analyze the company's website ({{{url}}}) to count the number of distinct major Product Lines or service Categories. The source for this is always the input URL.
D. Locations (Rd) (10%): Search for the company's "locations", "offices", or "manufacturing plants" to count key domestic/primary operational locations.

Phase 3: Calculation and Weight Adjustment
**CRITICAL CALCULATION RULE**: Before any calculation, you MUST convert all found values into base units of INR. For example, "130 Cr" becomes 1300000000. If you find an employee range like "11-50", you must use the average (30.5, rounded to 31) for calculation.
- Adjust Weights: Sum the initial weights of all *found* variables. If any variable was not found, redistribute its weight proportionally across the remaining found variables. The final sum of adjusted weights must be 1.00 (100%).
- Calculate Estimated Revenue (Ri): All calculations must be in base units of INR (not Cr or L).
  - Ra = (Found Revenue) × (1 + Industry Growth Rate)
  - Rb = (Found Employee Count) × RPE
  - Rc = (Found Product Line Count) × Avg. Rev./Line
  - Rd = ((Found Location Count) × 15000000) / Rent-to-Revenue Ratio
- Compute Final Predicted Turnover: Apply the adjusted weights to the calculated Ri values for only the *found* variables.
  - Predicted Turnover = ∑{for each Found Variable i} (Ri × Adjusted Weight_i)

Phase 4: Structured Output
- For the 'reasoning' field, provide the final calculation steps in a structured format as shown in the example.
- For the 'sources' array, populate it with all constants and variables found, their values, and the real, verifiable URLs where you found them.

Example for 'reasoning' field:
**Constants:**
- Industry Annual Growth Rate: [Value]
- Revenue Per Employee (RPE): [Value in INR]
- ... and so on for all constants.

**Calculated Estimated Revenue:**
- Ra = [Show calculation, e.g., (1300000000) x (1 + 0.12) = 1456000000]
- Rb = [Show calculation, e.g., 67 * 220000 = 14740000, or "Not calculated (reason)"]
- ... and so on.

**Predicted Turnover:**
- [Show final weighted calculation, e.g., (Ra × 0.833) + (Rd × 0.167) = ...]

**Summary:**
- Used: [List variables used, e.g., Ra, Rd]
- Dropped: [List variables dropped and why, e.g., Rb (employee count not found)]

Example for 'sources' array entry (MUST BE A REAL AND SPECIFIC URL):
{ "name": "Most Recently Reported Revenue", "value": "130 Cr INR as on Mar 31, 2024", "source": "https://tracxn.com/d/companies/r-k-synthesis-limited/__pYETMLc3LVd7gD4drazI0xsoVahd5p6vjBqY2b08U0" }

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
