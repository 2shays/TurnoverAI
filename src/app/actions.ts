"use server";

import { z } from "zod";
import { predictTurnover } from "@/ai/flows/predict-turnover";
import { ensureGeminiIsConfigured } from "@/lib/gemini-healthcheck";
import { loadBenchmarkData } from "@/lib/benchmark-data";


const SourceSchema = z.object({
  name: z.string(),
  value: z.string(),
});

const CalculationComponentSchema = z.object({
  description: z.string(),
  calculation: z.string(),
  value: z.number(),
  weight: z.number(),
});

const PredictionResultSchema = z.object({
  predictedTurnover: z.number(),
  confidence: z.number(),
  confidenceReasoning: z.string(),
  inferredIndustry: z.string(),
  inferredEmployees: z.number(),
  reasoning: z.string(),
  equation: z.string(),
  url: z.string(),
  sources: z.array(SourceSchema),
  calculationBreakdown: z.array(CalculationComponentSchema),
});

export type PredictionResult = z.infer<typeof PredictionResultSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type CalculationComponent = z.infer<typeof CalculationComponentSchema>;


export async function getPrediction(
  url: string,
  manualEmployees?: number,
  manualIndustry?: string,
): Promise<PredictionResult> {
  if (!url) {
    throw new Error("URL is required to get a prediction.");
  }
  try {
    await ensureGeminiIsConfigured();

    const benchmarkData = await loadBenchmarkData().catch(error => {
      console.error('Error loading benchmark CSV data:', error);
      return [];
    });
    
    const turnoverPrediction = await predictTurnover({
        url,
        industry: manualIndustry,
        employees: manualEmployees,
        benchmarkData: Array.isArray(benchmarkData) ? benchmarkData.map(item => ({
          company_name: item.company_name,
          turnover: item.turnover,
          employees: item.employees,
          industry: item.industry,
        })) : [],
    });

    return {
      predictedTurnover: turnoverPrediction.predictedTurnover,
      confidence: turnoverPrediction.confidenceScore,
      confidenceReasoning: turnoverPrediction.confidenceReasoning,
      inferredIndustry: turnoverPrediction.inferredIndustry,
      inferredEmployees: turnoverPrediction.inferredEmployees,
      reasoning: turnoverPrediction.reasoning,
      equation: turnoverPrediction.equation,
      url,
      sources: turnoverPrediction.sources,
      calculationBreakdown: turnoverPrediction.calculationBreakdown,
    };
  } catch (error) {
    console.error("Error in getPrediction action:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("Failed to generate prediction. Please try another URL.");
  }
}
