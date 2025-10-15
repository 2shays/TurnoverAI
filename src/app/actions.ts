"use server";

import { z } from "zod";
import { predictTurnover } from "@/ai/flows/predict-turnover";
import { supabase } from "@/lib/supabaseClient";


const PredictionResultSchema = z.object({
  predictedTurnover: z.number(),
  confidence: z.number(),
  inferredIndustry: z.string(),
  inferredEmployees: z.number(),
  reasoning: z.string(),
  url: z.string(),
});

export type PredictionResult = z.infer<typeof PredictionResultSchema>;

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

    // The new prompt doesn't explicitly return inferred employees/industry.
    // We will need to parse them from the reasoning if needed, or adjust the prompt.
    // For now, we'll return the manual ones if provided, or placeholders.
    const inferredIndustry = manualIndustry || "Inferred by AI";
    const inferredEmployees = manualEmployees || 0; // The AI will infer this, but it's not a direct output field.


    return {
      predictedTurnover: turnoverPrediction.predictedTurnover,
      confidence: turnoverPrediction.confidenceScore,
      inferredIndustry: inferredIndustry,
      inferredEmployees: inferredEmployees,
      reasoning: turnoverPrediction.reasoning,
      url,
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
