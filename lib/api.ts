// filepath: /Users/godfather/Library/CloudStorage/OneDrive-Personal/MacProjects/music-recommender-app-frontend/lib/api.ts
import { fetchWithAuth, fetchFromSpotify } from "./auth";

export async function getMusicRecommendations(searchQuery: string) {
  return await fetchWithAuth(`/recommend?search=${encodeURIComponent(searchQuery)}`, {});
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getGenreRecommendations(genreData: any) {
  try {
    console.log("Sending Genre Data:", JSON.stringify(genreData, null, 2));

    // The response from fetchWithAuth is already parsed JSON
    const data = await fetchWithAuth(`/recommend/genre`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("spotify_access_token")}`,
      },
      body: JSON.stringify(genreData),
    });

    console.log("Final Parsed Data:", data);

    // No need to call `.json()` again
    return {
      matchedGenres: data.matched_genres || [],
      recommendedArtists: data.recommended_artists?.map((artist: any) => artist.name) || [],
    };
  } catch (error) {
    console.error("Error fetching genre recommendations:", error);
    return { matchedGenres: [], recommendedArtists: [] };
  }
}




/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getUnfollowedArtists() {
  return await fetchFromSpotify("/v1/me/following?type=artist");
}