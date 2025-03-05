// src/lib/auth.ts
export const API_URL = "https://st7zxdu7ti.execute-api.eu-north-1.amazonaws.com";
export const SPOTIFY_API_URL = "https://api.spotify.com";
export const COGNITO_TOKEN_URL = process.env.NEXT_PUBLIC_COGNITO_TOKEN_URL!;
export const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
export const CLIENT_SECRET = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET!;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
  // Check if token is still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(COGNITO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Cognito");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000; // Convert expiry to milliseconds
  return cachedToken;
}

async function getSpotifyAccessToken() {
  return localStorage.getItem("spotify_access_token");
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getAccessToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
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