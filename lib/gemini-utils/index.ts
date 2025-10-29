import { GoogleGenAI } from "@google/genai";

// apiKey is defined in .env
export const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export function safeParseAIResponse(response: string) {
  try {
    const treated_response = response.replace(/```json|```/g, "").trim();
    return JSON.parse(treated_response);
  } catch (err) {
    console.warn("Falha ao fazer parse do JSON: ", err);
    return null;
  }
}
