"use client";
import DynamicRenderer from "./DynamicRenderer";
import IconifyIcon from "./IconifyIcon";

export default function VisualCard({ data }: { data: any }) {
  if (!data) return null;

  // Sometimes AI wraps response in a "data" property
  const visualData = data.data && typeof data.data === 'object' && !Array.isArray(data.data) ? data.data : data;

  return (
    <div className="w-full max-w-3xl bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 pt-5 pb-3 border-b border-gray-50 flex justify-between items-start">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{visualData.diagram_type?.replace("_", " ")}</span>
          <h2 className="text-xl font-semibold text-gray-900 mt-0.5">{visualData.title}</h2>
        </div>
        {data.cached && <span className="text-xs bg-green-50 text-green-600 border border-green-100 px-2 py-1 rounded-full">⚡ Cached</span>}
      </div>

      <div className="px-4 py-5 space-y-4">
        {visualData.diagram_type === "dynamic_graph" && <DynamicRenderer data={visualData} />}
      </div>

      <div className="px-6 pb-5">
        <div className="bg-gray-50 rounded-xl px-5 py-4 mb-3">
          <p className="text-gray-600 text-sm leading-relaxed">{visualData.explanation}</p>
        </div>
        {visualData.facts?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visualData.facts.map((f: string, i: number) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <IconifyIcon icon="mdi:lightbulb-outline" className="w-3.5 h-3.5 text-blue-600" />
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}