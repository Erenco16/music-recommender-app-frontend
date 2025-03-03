"use client";

import { useState } from "react";
import { getMusicRecommendations } from "@/lib/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("Metallica"); // Default search
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchRecommendations() {
    if (!searchQuery.trim()) return; // Prevent empty searches
    setLoading(true);
    setError(null);

    try {
      const data = await getMusicRecommendations(searchQuery);
      setRecommendations(data.artists || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Music Recommendations</h1>

      {/* Search Box */}
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-80"
          placeholder="Search for an artist..."
        />

        {/* Search Button */}
        <button
          onClick={fetchRecommendations}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {/* Loading and Error Messages */}
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      {/* Recommendations List */}
      <ul className="list-disc text-left mt-4">
        {recommendations.length > 0 ? (
          recommendations.map((artist, index) => (
            <li key={index} className="text-lg">{artist}</li>
          ))
        ) : (
          !loading && <p>No recommendations found.</p>
        )}
      </ul>
    </div>
  );
}
