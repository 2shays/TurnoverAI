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

const PredictTurnoverOutputSchema = z.object({
  predictedTurnover: z.number().describe('The predicted annual turnover in INR for FY25.'),
  confidenceScore: z.number().describe('A confidence score for the prediction, from 0 to 100.'),
  reasoning: z.string().describe('A structured output showing the model, working, and a summary of the reasoning.'),
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
Provided Industry: {{{industry}}} (Use this industry and skip identification)
{{/if}}
{{#if employees}}
Provided Employee Count: {{{employees}}} (Use this for Variable B)
{{/if}}

Target Prediction Period: Current Fiscal Year (FY25, assume year ending March 31 of the current calendar year).

Core Constraint: DO NOT use or hallucinate any data point (A, B, C, or D) for which reliable, external, and verifiable information cannot be found. If a variable's data is missing, it must be dropped and its weight must be redistributed proportionally among the remaining, found variables.

Phase 1: Dynamic Profiling and Sourcing
Identify Industry: {{#if industry}}Use the provided industry: '{{{industry}}}'.{{else}}Determine the primary industry and sub-sector of the company at the URL.{{/if}}

Source Constants: Based only on the identified industry, dynamically source the following five required constants for the current fiscal year (FY25):

Industry Annual Growth Rate (Percentage used to project Ra).
Revenue Per Employee (RPE) (for Rb benchmark, in Cr/employee).
Average Revenue Per Product Line (for Rc benchmark, in Cr).
Average Rent-to-Revenue Ratio (for Rd benchmark, as a decimal percentage, e.g., 0.025).
Fixed Annual Rent Cost per Location: Use a fixed INR 1.5 Cr/location.

Phase 2: Mandatory Data Collection (4 Components)
Attempt to find a verifiable data point for all four components. Note the initial weights.

Variable Data to Find Initial Weight
A. Confirmed Revenue (Ra) Last reported Annual Turnover (Revenue) and its corresponding Fiscal Year (e.g., FY24). Initial weight=50%
B. Employee Benchmark (Rb0) {{#if employees}}Use the provided count of {{{employees}}}.{{else}}Most recent reported total number of employees from the website or reliable external source.{{/if}} Initial weight=20%
C. Product Lines (Rc) Count of distinct major Product Lines or Categories listed on the company's public profiles or website. Initial weight=20%
D. Locations (Rd) Count of key domestic/primary manufacturing or registered office locations. Initial weight=10%

Phase 3: Calculation and Weight Adjustment
Adjust Weights: Sum the initial weights of all found variables. If any variable was not found (e.g., Rb is missing, initial weight 20%), redistribute its weight proportionally across the remaining found variables. The final sum of the adjusted weights must equal 1.00 (100%).

Calculate Estimated Revenue (Ri):

Ra=(Confirmed Revenue)x(1+Industry Growth Rate)
Rb=(Employee Count)xRPE
Rc=(Product Line Count)xAvg. Rev./Line
Rd=((Location Count)x1.5)/Rent-to-Revenue Ratio
​
Compute Final Predicted Turnover: Apply the adjusted weights to the calculated Ri values for only the found variables:

Predicted Turnover= ∑{Found Variables}(Ri×Adjusted Weighti)

Phase 4: Structured Output
Present the result in the exact format below, ensuring the dynamic constants and the weight adjustment logic are clearly detailed in the working. The final 'reasoning' output must contain all three sections.

**Prediction Model and Working**
(Show the final adjusted weights, the sourced industry constants, and the full calculation table).

**Short Summary and Reasoning**
(Explain the final number and explicitly state which variables were used and, if necessary, which were dropped and why).

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
