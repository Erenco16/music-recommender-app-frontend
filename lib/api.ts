// filepath: /Users/godfather/Library/CloudStorage/OneDrive-Personal/MacProjects/music-recommender-app-frontend/lib/api.ts
import { fetchWithAuth, fetchFromSpotify } from "./auth";

export async function getMusicRecommendations(searchQuery: string) {
  return await fetchWithAuth(`/recommend?search=${encodeURIComponent(searchQuery)}`);
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getGenreRecommendations(genreData: any) {
  return await fetchWithAuth(`/recommend?genre`, {
    method: "POST",
    body: JSON.stringify(genreData),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getUnfollowedArtists() {
  return await fetchFromSpotify("/v1/me/following?type=artist");
}