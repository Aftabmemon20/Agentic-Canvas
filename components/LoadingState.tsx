"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Understanding your topic…",
  "Choosing the best diagram type…",
  "Building the visual…",
  "Almost ready…",
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      {/* Skeleton header */}
      <div className="mb-5">
        <div className="h-3 w-16 bg-gray-100 rounded mb-2 animate-pulse" />
        <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Skeleton diagram */}
      <div className="flex gap-4 justify-center mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 w-40 rounded-xl animate-pulse"
            style={{
              background: i === 1 ? "#EFF6FF" : i === 2 ? "#F0FDF4" : "#FEF3C7",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Status message */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <svg
          className="animate-spin w-4 h-4 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="transition-all">{MESSAGES[msgIndex]}</span>
      </div>
    </div>
  );
}
