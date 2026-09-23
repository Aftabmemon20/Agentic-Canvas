import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Candidate models in priority order for resilience against 503 demand spikes and rate limits
const FALLBACK_MODELS = Array.from(
  new Set(
    [
      process.env.GEMINI_MODEL,
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ].filter(Boolean) as string[]
  )
);

async function callModelWithRetry(modelName: string, prompt: string, maxRetries = 2): Promise<string> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
      if (response && response.text) {
        return response.text;
      }
      throw new Error("Empty response from AI model");
    } catch (err: any) {
      lastError = err;
      const errorStr = typeof err?.message === "string" ? err.message : JSON.stringify(err);
      const isTransient =
        err?.status === 503 ||
        errorStr.includes("503") ||
        errorStr.includes("high demand") ||
        errorStr.includes("UNAVAILABLE") ||
        err?.status === 429 ||
        errorStr.includes("429");

      if (isTransient && attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt);
        console.warn(`[Gemini] ${modelName} temporary issue (${err?.status || "503"}). Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function generateVisual(topic: string) {

  const prompt = `You are an expert visual learning classifier and interactive simulation designer.
Topic: "${topic}"

Return ONLY raw JSON, no markdown code blocks.
We use a unified dynamic_graph diagram_type for all topics.
Provide a sequence of animations that explain the topic step-by-step.

Universal Schema:
{
  "title": "Short title (max 6 words)",
  "diagram_type": "dynamic_graph",
  "explanation": "3 clear sentences. Sentence 1: What it is. Sentence 2: How it works. Sentence 3: Why it matters.",
  "theme": "blue" | "teal" | "amber" | "purple" | "coral" | "green",
  
  "nodes": [
    { "id": "1", "label": "Node Label", "sublabel": "Detailed description", "color": "blue" }
  ],
  "edges": [
    { "id": "e1-2", "from": "1", "to": "2", "label": "optional label", "animated": true }
  ],
  "animations": [
    { "action": "pulse", "target": "1", "timestamp": 0, "description": "Highlighting start node" },
    { "action": "flow", "target": "e1-2", "timestamp": 1500, "description": "Data flows to node 2" },
    { "action": "highlight", "target": "2", "timestamp": 3000, "description": "Node 2 processes data" }
  ],
  "facts": ["short punchy fact 1", "short punchy fact 2", "short punchy fact 3"]
}

Rules:
- 4-10 nodes for detailed standard node views. Structure the graph intelligently (cycles for Water Cycle, trees for hierarchies, etc.).
- 3 punchy one-line facts for every topic.
- Break down the explanation into sequential animations using the 'animations' array. Ensure edge ids in animations match the edges' id field.
- DO NOT INCLUDE markdown wrappers like \`\`\`json. Return raw json.`;

  let lastError: any;
  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`[Gemini] Requesting visual with model: ${model}`);
      const rawText = await callModelWithRetry(model, prompt);
      const text = rawText.replace(/```json|```/g, "").trim();
      try {
        return JSON.parse(text);
      } catch {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) return JSON.parse(m[0]);
        throw new Error("Invalid JSON returned by model");
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model ${model} failed, falling back:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini models are currently experiencing high demand. Please try again shortly.");
}

