"use client";
import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import VisualCard from "@/components/VisualCard";
import LoadingState from "@/components/LoadingState";

const EXAMPLE_TOPICS = [
  "How TCP works",
  "Photosynthesis",
  "Black holes",
  "How sorting algorithms work",
  "The water cycle",
  "How vaccines work",
];

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState("");

  const handleResult = (data: any) => {
    setError(null);
    setResult(data);
  };

  const handleError = (msg: string) => {
    setError(msg);
    setResult(null);
  };

  const handleExample = (topic: string) => {
    setCurrentTopic(topic);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-4 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
          Powered by Gemini AI
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          Learn anything visually
        </h1>
        <p className="text-gray-500 text-lg max-w-md">
          Type any topic and get an instant visual diagram with a clear explanation
        </p>
      </div>

      {/* Search */}
      <SearchBox
        onResult={handleResult}
        onLoading={setLoading}
        onError={handleError}
        externalTopic={currentTopic}
      />

      {/* Example topics */}
      {!result && !loading && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-2xl">
          {EXAMPLE_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => handleExample(t)}
              className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Output */}
      <div className="mt-10 w-full flex flex-col items-center gap-6">
        {loading && <LoadingState />}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-5 py-3 rounded-xl">
            {error}
          </div>
        )}

        {!loading && result && <VisualCard data={result} />}
      </div>

      {/* Footer */}
      <p className="mt-16 text-xs text-gray-400">
        Results are cached — repeated topics load instantly
      </p>
    </main>
  );
}
