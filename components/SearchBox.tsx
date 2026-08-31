"use client";
import { useState, useEffect } from "react";

interface Props {
  onResult: (data: any) => void;
  onLoading: (loading: boolean) => void;
  onError: (msg: string) => void;
  externalTopic?: string;
}

export default function SearchBox({ onResult, onLoading, onError, externalTopic }: Props) {
  const [topic, setTopic] = useState("");

  // When user clicks an example pill, fill the input and auto-submit
  useEffect(() => {
    if (externalTopic) {
      setTopic(externalTopic);
      handleSubmit(externalTopic);
    }
  }, [externalTopic]);

  const handleSubmit = async (overrideTopic?: string) => {
    const query = overrideTopic || topic;
    if (!query.trim()) return;

    onLoading(true);
    onError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      onResult(data);
    } catch (err: any) {
      onError(err.message || "Failed to generate. Please try again.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="flex gap-3 w-full max-w-2xl">
      <input
        className="flex-1 border border-gray-200 rounded-xl px-5 py-3.5 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white shadow-sm placeholder:text-gray-400"
        placeholder="Type any topic… e.g. photosynthesis, TCP, black holes"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button
        onClick={() => handleSubmit()}
        disabled={!topic.trim()}
        className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
      >
        Visualise →
      </button>
    </div>
  );
}
