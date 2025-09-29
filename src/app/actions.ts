"use server";

import { z } from "zod";
import { inferIndustryFromUrl } from "@/ai/flows/infer-industry-from-url";
import { estimateEmployeeCountFromWebsite } from "@/ai/flows/estimate-employee-count-from-website";
import { supabase } from "@/lib/supabaseClient";


const PredictionResultSchema = z.object({
  predictedTurnover: z.number(),
  confidence: z.number(),
  inferredIndustry: z.string(),
  inferredEmployees: z.number(),
  url: z.string(),
});

export type PredictionResult = z.infer<typeof PredictionResultSchema>;

export type Industry = {
  value: string;
  label: string;
}

export async function getIndustries(): Promise<Industry[]> {
    const { data, error } = await supabase
      .from('industries')
      .select('name');

    if (error) {
        console.error("Supabase error fetching industries:", error);
        return [];
    }

    return data.map(item => ({ value: item.name, label: item.name }));
}


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


    const { data: publicCompanies, error: dbError } = await supabase
      .from('turnover')
      .select('turnover, employees');

    if (dbError || !publicCompanies || publicCompanies.length === 0) {
        console.error("Supabase error:", dbError);
        throw new Error("Could not retrieve company data. Please check the Supabase connection and ensure the 'turnover' table is populated correctly.");
    }

    // Calculate average revenue per employee from public data
    const totalRevenue = publicCompanies.reduce((acc, c) => acc + c.turnover, 0);
    const totalEmployees = publicCompanies.reduce((acc, c) => acc + c.employees, 0);
    
    if (totalEmployees === 0) {
      throw new Error("Total employees in the reference data is zero, cannot calculate revenue per employee.");
    }

    const avgRevenuePerEmployee = totalRevenue / totalEmployees;

    // New simplified prediction model
    const predictedTurnover = inferredEmployees * avgRevenuePerEmployee;
    
    // Confidence score from prototype
    const confidence = Math.min(95, 60 + Math.floor(Math.log(inferredEmployees) * 5) + Math.min(20, url.length));

    return {
      predictedTurnover,
      confidence,
      inferredIndustry: inferredIndustryName!,
      inferredEmployees,
      url,
    };
  } catch (error) {
    console.error("Error in getPrediction action:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    // Fallback to a default error state or rethrow
    throw new Error("Failed to generate prediction. Please try another URL.");
  }
}
