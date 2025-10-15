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
    const turnoverPrediction = await predictTurnover({
        url,
        industry: manualIndustry,
        employees: manualEmployees,
    });

    return {
      predictedTurnover: turnoverPrediction.predictedTurnover,
      confidence: turnoverPrediction.confidenceScore,
      inferredIndustry: turnoverPrediction.inferredIndustry,
      inferredEmployees: turnoverPrediction.inferredEmployees,
      reasoning: turnoverPrediction.reasoning,
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

export async function getBenchmarkData() {
  const { data, error } = await supabase.from('turnover').select('*');
  if (error) {
    console.error('Error fetching benchmark data:', error);
    return { error: error.message };
  }
  return data;
}
