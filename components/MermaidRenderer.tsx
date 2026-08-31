"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
});

export default function MermaidRenderer({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !chart) return;
    const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

    mermaid.render(id, chart).then(({ svg }) => {
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    }).catch((err) => {
      console.warn("Mermaid render error:", err);
    });
  }, [chart]);

  return (
    <div className="w-full bg-slate-950 p-5 rounded-xl border border-slate-800 flex justify-center overflow-x-auto">
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}
