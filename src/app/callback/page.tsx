"use client";

export const dynamic = "force-static";

import { useState, useEffect } from "react";
import { getMusicRecommendations, getUnfollowedArtists, getGenreRecommendations } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Callback() {
  const [searchQuery, setSearchQuery] = useState("Metallica");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [genreRecommendations, setGenreRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (accessToken && expiresIn) {
      const expirationTime = Date.now() + parseInt(expiresIn) * 1000;
      localStorage.setItem("spotify_access_token", accessToken);
      localStorage.setItem("spotify_token_expiration", expirationTime.toString());
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const storedToken = localStorage.getItem("spotify_access_token");
    const storedExpiration = localStorage.getItem("spotify_token_expiration");

    if (!storedToken || !storedExpiration || Date.now() > parseInt(storedExpiration)) {
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_token_expiration");
      router.replace("/");
    }
  }, [router]);

  /* eslint-disable */
  async function recommendBasedOnGenre() {
    try {
      setLoading(true);
      setError(null);
      const unfollowedArtistData = await getUnfollowedArtists();
      console.log("Unfollowed Artist Data:", unfollowedArtistData);

      const genreData = await getGenreRecommendations(unfollowedArtistData);
      const { matchedGenres, recommendedArtists } = await getGenreRecommendations(unfollowedArtistData);
      console.log("Matched Genres:", matchedGenres);
      console.log("Recommended Artists:", recommendedArtists);
      console.log("Genre Recommendations:", genreData);
      if (recommendedArtists) {
        setGenreRecommendations(recommendedArtists.slice(0, 10)); // Only 10 artists
      } else {
        setGenreRecommendations([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }
  /* eslint-enable */

  async function fetchRecommendations() {
    if (!searchQuery.trim()) return;
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
<div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-8 gap-8">
  {/* Left Side - Unfollowed Artist Recommendations */}
  <div className="w-full md:w-1/2 p-6 flex flex-col items-center">
    <h2 className="text-xl font-semibold mb-4 text-center">Recommendations from Unfollowed Artists</h2>
    <button
      onClick={recommendBasedOnGenre}
      className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
    >
      Get me recommendations from artists I don’t follow
    </button>

    {loading && <p className="mt-4">Loading...</p>}
    {error && <p className="mt-4 text-red-500">Error: {error}</p>}

    <ul className="list-disc text-left mt-4">
      {genreRecommendations.length > 0 ? (
        genreRecommendations.slice(0, 10).map((artist, index) => (
          <li key={index} className="text-lg">{artist}</li>
        ))
      ) : (
        !loading && <p>No genre-based recommendations found.</p>
      )}
    </ul>
  </div>

  {/* Separator (Vertical for large screens, Horizontal for small screens) */}
  <div className="w-full md:w-[2px] h-[2px] md:h-full bg-gray-300"></div>

  {/* Right Side - Search-Based Recommendations */}
  <div className="w-full md:w-1/2 p-6 flex flex-col items-center">
    <h2 className="text-xl font-semibold mb-4 text-center">Search for Music Recommendations</h2>
    
    <div className="flex flex-col items-center gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 w-80"
        placeholder="Search for an artist..."
      />
      <button
        onClick={fetchRecommendations}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>

    {loading && <p className="mt-4">Loading...</p>}
    {error && <p className="mt-4 text-red-500">Error: {error}</p>}

    <ul className="list-disc text-left mt-4">
      {recommendations.length > 0 ? (
        recommendations.map((artist, index) => (
          <li key={index} className="text-lg">{artist}</li>
        ))
      ) : (
        !loading && <p>No search results found.</p>
      )}
    </ul>
  </div>
</div>
  );
}
