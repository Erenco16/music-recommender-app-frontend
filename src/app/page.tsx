"use client";

import { useEffect, useState } from "react";
import "./css/home.css";

const Home = () => {
  const generateRandomString = (length: number): string => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    // Ensure this runs only on the client
    window.localStorage.setItem("token", "");

    // Fetch environment variables in useEffect (client-side)
    const client_id = process.env.NEXT_PUBLIC_REACT_APP_SPOTIFY_CLIENT_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_REACT_APP_SPOTIFY_REDIRECT_URI;
    if (!client_id || !redirect_uri) {
      console.log("Missing Spotify environment variables");
      return;
    }

    const auth_endpoint = "https://accounts.spotify.com/authorize";
    const state = generateRandomString(16);
    const scope = "user-read-private user-read-email user-top-read user-follow-read";
    const response_type = "token";

    const url =
      `${auth_endpoint}?` +
      `client_id=${client_id}` +
      `&redirect_uri=${redirect_uri}` +
      `&state=${state}` +
      `&response_type=${response_type}` +
      `&scope=${scope}`;

    console.log(`Redirect URL: ${redirect_uri}`);
    setSpotifyAuthUrl(url);
  }, []);

  return (
      <div className="main-container">
        <h1>Display your artists!</h1>
        <h2>
          In order to see your artists, you need to click the button below.
        </h2>
        {spotifyAuthUrl && (
          <a href={spotifyAuthUrl}>
            <button className="spotify-btn">Log into Spotify</button>
          </a>
        )}
      </div>
  );
};

export default Home;
