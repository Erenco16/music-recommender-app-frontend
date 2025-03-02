export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
export const COGNITO_TOKEN_URL = process.env.NEXT_PUBLIC_COGNITO_TOKEN_URL;
export const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
export const CLIENT_SECRET = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET;

async function getAccessToken() {
  const response = await fetch(COGNITO_TOKEN_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Cognito");
  }

  const data = await response.json();
  console.log(data.access_token);
  return data.access_token; // 🔑 Return the token
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await getAccessToken();
  
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}), // Ensures headers exist before spreading
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
  
    return res.json();
  }
  