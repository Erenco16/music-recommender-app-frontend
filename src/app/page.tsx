"use client";

import { useEffect, useState } from "react";
import { getMusicRecommendations } from "@/lib/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("Metallica"); // Default search
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      setError(null);

      try {
        const data = await getMusicRecommendations(searchQuery);
        setRecommendations(data.artists || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [searchQuery]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Music Recommendations</h1>
      
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mb-4 w-80"
        placeholder="Search for an artist..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <ul className="list-disc text-left">
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
