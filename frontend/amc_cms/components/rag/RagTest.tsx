"use client";

import React, { useState } from "react";

export default function RagTest() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/rag/search/retrieval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("検索APIが失敗しました");
      }

      const data = await res.json();
      setResults(data.documents || []);
    } catch (err: any) {
      setError(err.message || "不明なエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">🔍 RAG検索テスト</h1>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="検索クエリを入力"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          検索
        </button>
      </div>

      {isLoading && <p>検索中...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((doc, index) => (
            <div key={index} className="p-3 border rounded shadow">
              <h2 className="font-semibold">{doc.title}</h2>
              <p className="text-sm text-gray-600">Score: {doc.score}</p>
              <p className="mt-2 whitespace-pre-wrap">{doc.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
