// src/lib/api.ts
import { fetchWithAuth } from "./auth";

export async function getMusicRecommendations(searchQuery: string) {
  return await fetchWithAuth(`/recommend?search=${encodeURIComponent(searchQuery)}`);
}
