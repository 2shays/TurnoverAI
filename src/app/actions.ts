"use server";

import { z } from "zod";
import { inferIndustryFromUrl } from "@/ai/flows/infer-industry-from-url";
import { estimateEmployeeCountFromWebsite } from "@/ai/flows/estimate-employee-count-from-website";
import { predictTurnover } from "@/ai/flows/predict-turnover";


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
    let inferredIndustryName = manualIndustry;
    if (!inferredIndustryName) {
      const industryResult = await inferIndustryFromUrl({ url });
      inferredIndustryName = industryResult.industry;
    }
    
    let inferredEmployees = manualEmployees;
    if (!inferredEmployees) {
      const employeeResult = await estimateEmployeeCountFromWebsite({ websiteUrl: url });
      inferredEmployees = employeeResult.employeeCount;
    }

    const turnoverPrediction = await predictTurnover({
        url,
        industry: inferredIndustryName!,
        employees: inferredEmployees,
    });

    return {
      predictedTurnover: turnoverPrediction.predictedTurnover,
      confidence: turnoverPrediction.confidenceScore,
      inferredIndustry: inferredIndustryName!,
      inferredEmployees,
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
