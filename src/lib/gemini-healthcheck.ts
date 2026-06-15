import { ai } from "@/ai/genkit";

const GEMINI_MODEL = "googleai/gemini-2.5-flash";

let geminiHealthcheckPromise: Promise<void> | null = null;

function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
}

export function ensureGeminiIsConfigured(): Promise<void> {
  if (!geminiHealthcheckPromise) {
    geminiHealthcheckPromise = (async () => {
      const apiKey = getGeminiApiKey();

      if (!apiKey) {
        throw new Error(
          "Gemini API key is missing. Add GEMINI_API_KEY to .env.local, then restart the dev server."
        );
      }

      try {
        const response = await ai.generate({
          model: GEMINI_MODEL,
          prompt: "Reply with OK.",
        });

        if (!response.text) {
          throw new Error("Gemini health check returned an empty response.");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new Error(
          `Gemini API check failed. Confirm that the Gemini API is enabled for the Google Cloud project tied to this key, billing is enabled if required, and the key is valid. Original error: ${message}`
        );
      }
    })();
  }

  return geminiHealthcheckPromise;
}