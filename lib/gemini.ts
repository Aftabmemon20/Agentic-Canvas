import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
  });
  
  const text = response.text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(text); }
  catch { const m = text.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); throw new Error("Invalid JSON"); }
}

