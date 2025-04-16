// src/lib/auth.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export const SPOTIFY_API_URL = "https://api.spotify.com";




async function getSpotifyAccessToken() {
  return localStorage.getItem("spotify_access_token");
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {

  console.log("Fetching API:", `${API_URL}${endpoint}`);
  console.log("Options:", JSON.stringify(options, null, 2));

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      "Content-Type": "application/json",
    },
  });

  console.log("Raw Response Object:", res);

  // Ensure response is a valid object before parsing JSON
  if (!res || typeof res.json !== "function") {
    console.error("Invalid response format detected:", res);
    throw new Error("Invalid response format from fetchWithAuth");
  }

  const jsonData = await res.json();
  console.log("Parsed JSON Data:", jsonData);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} - ${jsonData.message || "Unknown error"}`);
  }

  return jsonData;
}


export async function fetchFromSpotify(endpoint: string, options: RequestInit = {}) {
  const token = await getSpotifyAccessToken();

  const res = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}