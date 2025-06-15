"use server";
import { analyzeEmotionalTone, type AnalyzeEmotionalToneOutput } from "@/ai/flows/analyze-emotional-tone";

export interface EmotionAnalysisResult extends AnalyzeEmotionalToneOutput {
  timestamp: string;
}
export interface EmotionAnalysisError {
  error: string;
  timestamp: string;
}


export async function getEmotionAnalysis(text: string): Promise<EmotionAnalysisResult | EmotionAnalysisError> {
  const timestamp = new Date().toISOString();
  if (!text.trim()) {
    return { error: "Text input cannot be empty.", timestamp };
  }
  try {
    const result = await analyzeEmotionalTone({ text });
    return { ...result, timestamp };
  } catch (e) {
    console.error("Error analyzing emotion:", e);
    // Check if e is an Error instance to safely access message
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to analyze emotion: ${errorMessage}. Please try again.`, timestamp };
  }
}
