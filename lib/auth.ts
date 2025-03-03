// src/lib/auth.ts
export const API_URL = "https://st7zxdu7ti.execute-api.eu-north-1.amazonaws.com";
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
