"use server";

import { z } from "zod";
import { inferIndustryFromUrl } from "@/ai/flows/infer-industry-from-url";
import { estimateEmployeeCountFromWebsite } from "@/ai/flows/estimate-employee-count-from-website";
import { publicCompanyData, type IndustryKey } from "@/lib/public-company-data";

const PredictionResultSchema = z.object({
  predictedTurnover: z.number(),
  confidence: z.number(),
  inferredIndustry: z.string(),
  inferredEmployees: z.number(),
  inferredTraffic: z.number(),
  industryKey: z.string(),
  url: z.string(),
});

export type PredictionResult = z.infer<typeof PredictionResultSchema>;

function getIndustryKey(industry: string): IndustryKey {
    const lowerIndustry = industry.toLowerCase();
    if (lowerIndustry.includes('tech') || lowerIndustry.includes('software') || lowerIndustry.includes('saas') || lowerIndustry.includes('ai')) {
        return 'tech';
    }
    if (lowerIndustry.includes('retail') || lowerIndustry.includes('e-commerce') || lowerIndustry.includes('shop')) {
        return 'retail';
    }
    if (lowerIndustry.includes('manufacturing') || lowerIndustry.includes('industrial')) {
        return 'manufacturing';
    }
    return 'default';
}

function estimateTraffic(url: string, industryKey: IndustryKey): number {
    const cleanedUrl = url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const lengthFactor = cleanedUrl.length;
    const dotCount = cleanedUrl.split('.').length - 1;

    let traffic = 0;
    
    if (industryKey === 'tech') {
        traffic = Math.min(2000000, (lengthFactor * 7000) + (dotCount * 30000));
    } else if (industryKey === 'retail') {
        traffic = Math.min(5000000, (lengthFactor * 10000) + (dotCount * 50000));
    } else { 
        traffic = Math.min(500000, (lengthFactor * 5000) + (dotCount * 10000));
    }
    
    traffic = Math.max(1000, traffic);
    // Removed Math.random() to prevent hydration errors
    traffic = Math.round(traffic);

    return traffic;
}


export async function getPrediction(url: string): Promise<PredictionResult> {
  try {
    const [industryResult, employeeResult] = await Promise.all([
      inferIndustryFromUrl({ url }),
      estimateEmployeeCountFromWebsite({ websiteUrl: url }),
    ]);

    const inferredIndustryName = industryResult.industry;
    const industryKey = getIndustryKey(inferredIndustryName);
    const industryData = publicCompanyData[industryKey];

    const employees = employeeResult.employeeCount;
    const traffic = estimateTraffic(url, industryKey);

    // Simulated Prediction Model from prototype
    const employeeContribution = employees * industryData.revenuePerEmployee * 0.3;
    const trafficContribution = (traffic / industryData.avgWebTraffic) * industryData.baseRevenue * 0.7;
    const turnover = industryData.baseRevenue * 0.1 + employeeContribution * 0.8 + trafficContribution * 0.8;
    
    const predictedTurnover = Math.max(0, turnover);

    // Confidence score from prototype
    const confidence = Math.min(95, 65 + Math.min(30, url.length));

    return {
      predictedTurnover,
      confidence,
      inferredIndustry: industryData.name,
      inferredEmployees: employees,
      inferredTraffic: traffic,
      industryKey,
      url,
    };
  } catch (error) {
    console.error("Error in getPrediction action:", error);
    // Fallback to a default error state or rethrow
    throw new Error("Failed to generate prediction. Please try another URL.");
  }
}
