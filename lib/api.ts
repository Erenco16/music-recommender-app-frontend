// filepath: /Users/godfather/Library/CloudStorage/OneDrive-Personal/MacProjects/music-recommender-app-frontend/lib/api.ts
import { fetchWithAuth, fetchFromSpotify } from "./auth";

export async function getMusicRecommendations(searchQuery: string) {
  return await fetchWithAuth(`/main/recommend?search=${encodeURIComponent(searchQuery)}`);
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getGenreRecommendations(genreData: any) {
  return await fetchWithAuth(`/main/recommend?genre`, {
    method: "POST", // or GET, depending on your API
    credentials: "include", // Ensures cookies/authorization headers are sent
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("spotify_access_token")}`, // Replace with actual token
    },
    body: JSON.stringify(genreData) // Adjust request body as needed
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getUnfollowedArtists() {
  return await fetchFromSpotify("/v1/me/following?type=artist");
}