"use client"; // Indicar que es un Client Component

import { useState } from 'react';

// Definimos el tipo Track basado en la estructura que la API de Spotify devuelve
interface Artist {
  name: string;
}

interface Track {
  id: string;
  name: string;
  artists: Artist[];
}

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

const getSpotifyAccessToken = async () => {
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await result.json();
  return data.access_token;
};

const searchTrack = async (query: string): Promise<Track> => {
  const accessToken = await getSpotifyAccessToken();

  const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await result.json();
  return data.tracks.items[0]; // Devuelve el primer resultado de la búsqueda
};

const getRecommendations = async (trackId: string): Promise<Track[]> => {
  const accessToken = await getSpotifyAccessToken();

  const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await result.json();
  return data.tracks; // Devuelve las canciones recomendadas
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<Track[]>([]);

  const handleSearch = async () => {
    try {
      const track = await searchTrack(query);
      const recommendedTracks = await getRecommendations(track.id);
      setRecommendations(recommendedTracks);
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
    }
  };

  return (
    <main className="h-screen bg-gradient-to-b from-green-600 to-black flex flex-col items-center justify-center">
      <h1 className="text-white text-6xl font-bold mb-8">MUSIC.IA</h1>

      <div className="flex items-center justify-center mb-6">
        <span className="text-xl mr-4 text-white">Quiero escuchar algo como:</span>
        <input
          type="text"
          name="inputbox"
          placeholder=""
          className="text-white text-6xl bg-transparent border-b-2 border-white focus:border-yellow-300 focus:outline-none placeholder:text-gray-300 px-2 py-1 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className=" ml-4 bg-yellow-400 text-black-900 font-bold py-2 px-4 rounded hover:bg-yellow-300 transition duration-300"
          onClick={handleSearch}
        >
          Suggest
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-white text-2xl">Recomendaciones:</h2>
          <ul className="text-white">
            {recommendations.map((track) => (
              <li key={track.id}>
                {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
