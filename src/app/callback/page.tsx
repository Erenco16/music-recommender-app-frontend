"use client";
// forces static export for the /calllback route
export const dynamic = "force-static"

import { useState, useEffect } from "react";
import { getMusicRecommendations, getUnfollowedArtists, getGenreRecommendations } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Callback() {
  const [searchQuery, setSearchQuery] = useState("Metallica"); // Default search
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const expiresIn = params.get("expires_in");

    // If we receive a new token, store it
    if (accessToken && expiresIn) {
      const expirationTime = Date.now() + parseInt(expiresIn) * 1000;

      localStorage.setItem("spotify_access_token", accessToken);
      localStorage.setItem("spotify_token_expiration", expirationTime.toString());

      // Remove hash from the URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if the stored token is expired
    const storedToken = localStorage.getItem("spotify_access_token");
    const storedExpiration = localStorage.getItem("spotify_token_expiration");

    if (!storedToken || !storedExpiration || Date.now() > parseInt(storedExpiration)) {
      // Token is missing or expired -> Redirect to login page
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_token_expiration");
      router.replace("/");
    }
  }, [router]);
  
/* eslint-disable */

  async function recommendBasedOnGenre() {
    try {
      const unfollowedArtistData = await getUnfollowedArtists();
      console.log("Unfollowed Artist Data:", unfollowedArtistData);
      const genreRecommendations = await getGenreRecommendations(unfollowedArtistData);
      setRecommendations(genreRecommendations.artists || []);
      console.log("Genre Recommendations:", recommendations);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }
/* eslint-enable */

  async function fetchRecommendations() {
    console.log("Fetching recommendations...");
    recommendBasedOnGenre();
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