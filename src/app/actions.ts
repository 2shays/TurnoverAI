"use server";

import { z } from "zod";
import { predictTurnover } from "@/ai/flows/predict-turnover";
import { supabase } from "@/lib/supabaseClient";


const SourceSchema = z.object({
  name: z.string(),
  value: z.string(),
});

const PredictionResultSchema = z.object({
  predictedTurnover: z.number(),
  confidence: z.number(),
  inferredIndustry: z.string(),
  inferredEmployees: z.number(),
  reasoning: z.string(),
  equation: z.string(),
  url: z.string(),
  sources: z.array(SourceSchema),
});

export type PredictionResult = z.infer<typeof PredictionResultSchema>;
export type Source = z.infer<typeof SourceSchema>;

export async function getPrediction(
  url: string,
  manualEmployees?: number,
  manualIndustry?: string,
): Promise<PredictionResult> {
  if (!url) {
    throw new Error("URL is required to get a prediction.");
  }
  try {
    const { data: benchmarkData, error } = await supabase.from('turnover').select('*');
    if (error) {
      console.error('Error fetching benchmark data:', error);
      // We don't want to fail the whole prediction if this fails, so we'll pass an empty array.
    }
    
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
      inferredIndustry: turnoverPrediction.inferredIndustry,
      inferredEmployees: turnoverPrediction.inferredEmployees,
      reasoning: turnoverPrediction.reasoning,
      equation: turnoverPrediction.equation,
      url,
      sources: turnoverPrediction.sources,
    };
  } catch (error) {
    console.error("Error in getPrediction action:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("Failed to generate prediction. Please try another URL.");
  }
}
