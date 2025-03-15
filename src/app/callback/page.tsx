"use client";

export const dynamic = "force-static";

import { useState, useEffect } from "react";
import { getMusicRecommendations, getUnfollowedArtists, getGenreRecommendations } from "@/lib/api";
import  Header  from "@/components/Header";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners"; // Cool spinner
import '../css/callback.css';

export default function Callback() {
  const [searchQuery, setSearchQuery] = useState("Metallica");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [matchedArtist, setMatchedArtist] = useState<string | null>(null);
  const [genreRecommendations, setGenreRecommendations] = useState<string[]>([]);
  const [genreError, setGenreError] = useState<string | null>(null);
  const [artistError, setArtistError] = useState<string | null>(null);
  const [artistLoading, setArtistLoading] = useState<boolean>(false);
  const [genreLoading, setGenreLoading] = useState<boolean>(false);
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

  async function recommendBasedOnGenre() {
    try {
      setGenreLoading(true);
      setGenreError(null);
      const unfollowedArtistData = await getUnfollowedArtists();
      const genreData = await getGenreRecommendations(unfollowedArtistData);
      const { recommendedArtists } = genreData;

      setGenreRecommendations(recommendedArtists.slice(0, 10));
    } catch (err: unknown) {
      setGenreError(err instanceof Error ? err.message : String(err));
    } finally {
      setGenreLoading(false);
    }
  }

  async function fetchRecommendations() {
    if (!searchQuery.trim()) return;
    setArtistLoading(true);
    setArtistError(null);

    try {
      const data = await getMusicRecommendations(searchQuery);
      setRecommendations(data.artists || []);
      setMatchedArtist(data.matched_artist || null);
    } catch (err: unknown) {
      setArtistError(err instanceof Error ? err.message : String(err));
    } finally {
      setArtistLoading(false);
    }
  }

  return (
    <div>
    <Header />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row items-center justify-center min-h-screen p-8 gap-8"
    >
      {/* Left Side - Unfollowed Artist Recommendations */}
      <div className="glass-box">
        <h2 className="text-xl font-semibold mb-4 text-center">Recommendations from Unfollowed Artists</h2>
        <button
          onClick={recommendBasedOnGenre}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
        >
          Get me recommendations from artists I don’t follow
        </button>

        {genreLoading ? (
          <ClipLoader color="#10b981" loading={genreLoading} size={50} className="mt-4" />
        ) : genreError ? (
          <p className="mt-4 text-red-500">Error: {genreError}</p>
        ) : (
          <ul className="list-disc text-left mt-4">
            {genreRecommendations.length > 0 ? (
              genreRecommendations.map((artist, index) => (
                <motion.li
                  key={index}
                  className="text-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {artist}
                </motion.li>
              ))
            ) : (
              <p>No genre-based recommendations found.</p>
            )}
          </ul>
        )}
      </div>

      {/* Separator */}
      <div className="w-full md:w-[2px] h-[2px] md:h-full bg-gray-300"></div>

      {/* Right Side - Search-Based Recommendations */}
      <div className="glass-box">
        <h2 className="text-xl font-semibold mb-4 text-center">Search for Music Recommendations</h2>

        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-80 rounded-md text-white"
            placeholder="Search for an artist..."
          />
          <button
            onClick={fetchRecommendations}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>

        {/* Matched Artist Display */}
        {matchedArtist && (
          <motion.p
            className="mt-4 text-lg font-semibold text-green-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Matched Artist: {matchedArtist}
          </motion.p>
        )}

        {artistLoading ? (
          <ClipLoader color="#3b82f6" loading={artistLoading} size={50} className="mt-4" />
        ) : artistError ? (
          <p className="mt-4 text-red-500">Error: {artistError}</p>
        ) : (
          <ul className="list-disc text-left mt-4">
            {recommendations.length > 0 ? (
              recommendations.map((artist, index) => (
                <motion.li
                  key={index}
                  className="text-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {artist}
                </motion.li>
              ))
            ) : (
              <p>No search results found.</p>
            )}
          </ul>
        )}
      </div>
    </motion.div>
  </div>
  );
}
