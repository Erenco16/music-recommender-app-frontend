"use client"; // Ensures it's a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./css/home.css";

const Home = () => {
  const router = useRouter();
  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure it's a client-side render

    if (typeof window === "undefined") return;

    // Check if user already has a valid access token
    const accessToken = localStorage.getItem("spotify_access_token");
    const expirationTime = localStorage.getItem("spotify_token_expiration");

    if (accessToken && expirationTime) {
      const now = Date.now();

      if (now < parseInt(expirationTime)) {
        console.log("Valid token found. Redirecting to /callback...");
        router.replace("/callback");
        return;
      } else {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expiration");
      }
    }

    // Fetch environment variables on the client
    const client_id = process.env.NEXT_PUBLIC_REACT_APP_SPOTIFY_CLIENT_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_REACT_APP_SPOTIFY_REDIRECT_URI;
    if (!client_id || !redirect_uri) {
      console.log("Missing Spotify environment variables");
      return;
    }

    const auth_endpoint = "https://accounts.spotify.com/authorize";
    const state = Math.random().toString(36).substring(2, 15); // FIXED: Generate state only on client
    const scope = "user-read-private user-read-email user-top-read user-follow-read";
    const response_type = "token";

    const url = `${auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&response_type=${response_type}&scope=${scope}`;
    setSpotifyAuthUrl(url);
  }, [router]);

  if (!isClient) return null; // FIXED: Prevent server-rendered mismatch

  return (
    <div className="main-container">
      <h1>Display your artists!</h1>
      <h2>In order to see your artists, you need to click the button below.</h2>
      {spotifyAuthUrl && (
        <a href={spotifyAuthUrl}>
          <button className="spotify-btn">Log into Spotify</button>
        </a>
      )}
    </div>
  );
};

export default Home;
