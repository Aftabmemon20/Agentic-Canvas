// 100% Free Local Logic Generator & Concept Engine
// Operates with zero AI API costs, zero token limits, and instant 0ms latency.

export function generateLocalFallbackVisual(topic: string) {
  const normalized = topic.toLowerCase().trim();
  const words = topic.trim().split(/\s+/);
  const capitalized = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  // Default to a 3-step generic process if not recognized
  return {
    title: capitalized,
    diagram_type: "dynamic_graph",
    explanation: `${capitalized} is an important concept. It operates through structured steps, core principles, and foundational mechanisms. Understanding its components allows for a clear grasp of how it functions in practice.`,
    theme: "blue",
    mermaid_chart: `graph TD\n  A[Core Principle] --> B[Mechanism & Process]\n  B --> C[Final Outcome]`,
    nodes: [
      { id: "1", label: `Core Principle`, sublabel: "Fundamental definition", color: "blue" },
      { id: "2", label: "Mechanism & Process", sublabel: "Component interactions", color: "purple" },
      { id: "3", label: "Final Outcome", sublabel: "Summary & results", color: "teal" }
    ],
    edges: [
      { id: "e1-2", from: "1", to: "2", label: "leads to", animated: true },
      { id: "e2-3", from: "2", to: "3", label: "results in", animated: true }
    ],
    animations: [
      { action: "pulse", target: "1", timestamp: 0, description: `Initializing ${capitalized}` },
      { action: "flow", target: "e1-2", timestamp: 1500, description: "Processing core principles" },
      { action: "highlight", target: "2", timestamp: 3000, description: "Executing mechanism" },
      { action: "flow", target: "e2-3", timestamp: 4500, description: "Finalizing outcome" },
      { action: "highlight", target: "3", timestamp: 6000, description: "Completed" }
    ],
    facts: [
      `Key Concept: ${capitalized}`,
      "Operates sequentially through defined stages",
      "Essential foundation for analytical understanding"
    ]
  };
}
