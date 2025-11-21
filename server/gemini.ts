import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";
import type { HealthMetric, HealthInsight, Recommendation } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

interface AnalysisResult {
  lifeScore: number;
  metrics: HealthMetric[];
  insights: HealthInsight[];
  recommendations: Recommendation[];
  summary: string;
}

export async function analyzeHealthDocument(filePath: string, mimeType: string): Promise<AnalysisResult> {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileBytes = fs.readFileSync(filePath);
    
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured");
    }
    
    const systemPrompt = `You are an expert medical AI assistant analyzing health documents and blood test results. 
Your task is to:
1. Extract all health metrics, biomarkers, and test results from the document
2. Categorize each metric's status as: excellent, good, attention, or critical
3. Calculate an overall Life Score (0-100) based on all health indicators
4. Provide key health insights highlighting important findings
5. Generate personalized lifestyle recommendations for diet, exercise, sleep, and stress management

Provide a comprehensive analysis in JSON format.`;

    const userPrompt = `Analyze this health document thoroughly. Extract all biomarkers, lab values, and health metrics. 
For each metric found:
- Determine if it's excellent (optimal), good (normal), needs attention (borderline), or critical (abnormal)
- Note the normal reference range
- Categorize it (e.g., Blood Count, Lipid Profile, Liver Function, Kidney Function, Metabolic, etc.)

Calculate a Life Score (0-100) where:
- 80-100 = Excellent health (most metrics optimal)
- 60-79 = Good health (metrics mostly normal)
- 40-59 = Fair health (some concerning values)
- 0-39 = Needs attention (multiple critical values)

Provide insights about the most important findings and actionable lifestyle recommendations.

Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{
  "lifeScore": number,
  "summary": "string - 2-3 sentence overall health summary",
  "metrics": [
    {
      "name": "string",
      "value": "string",
      "unit": "string",
      "status": "excellent" | "good" | "attention" | "critical",
      "normalRange": "string",
      "category": "string"
    }
  ],
  "insights": [
    {
      "category": "string",
      "title": "string",
      "description": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "recommendations": [
    {
      "category": "diet" | "exercise" | "sleep" | "stress" | "general",
      "title": "string",
      "actions": ["string"],
      "priority": "low" | "medium" | "high"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: [
        {
          inlineData: {
            data: fileBytes.toString("base64"),
            mimeType: mimeType,
          },
        },
        userPrompt,
      ],
    });

    const rawJson = response.text;
    console.log("Gemini AI Analysis Response:", rawJson);

    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    const data: AnalysisResult = JSON.parse(rawJson);
    
    if (!data.lifeScore || !data.metrics || !data.summary) {
      throw new Error("Invalid analysis response structure");
    }

    return data;
  } catch (error) {
    console.error("Error analyzing health document:", error);
    
    return {
      lifeScore: 50,
      summary: "Analysis could not be completed due to an error. Please try uploading the document again or contact support if the issue persists.",
      metrics: [],
      insights: [{
        category: "Error",
        title: "Analysis Error",
        description: "Unable to analyze document at this time",
        severity: "high" as const,
      }],
      recommendations: [{
        category: "general" as const,
        title: "Please Re-upload",
        actions: ["Try uploading the document again", "Ensure the document is clear and readable", "Contact support if the issue continues"],
        priority: "medium" as const,
      }],
    };
  }
}
