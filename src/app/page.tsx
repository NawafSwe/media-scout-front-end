"use client";

import { useState, useEffect } from "react";

interface MediaItem {
  wrapperType: string;
  kind: string;
  artistId: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  trackViewUrl: string;
  artworkUrl100: string;
  releaseDate: string;
  country: string;
  primaryGenreName: string;
}

interface ApiResponse {
  id: number;
  search_term: string;
  result_count: number;
  media: MediaItem[];
}

export default function Home() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedTerm, setDebouncedTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce Effect - Wait 500ms before setting debouncedTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch API data when debouncedTerm changes
  useEffect(() => {
    if (!debouncedTerm) {
      setMedia([]);
      return;
    }

    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3001/api/v1/media/search?term=${debouncedTerm}`
        );

        if (!response.ok) throw new Error("Failed to fetch media");

        const data: ApiResponse = await response.json();
        setMedia(data.media || []);
      } catch (err) {
        setError("Error fetching media");
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [debouncedTerm]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-4">🎵 Media Search</h1>
      <div className="w-full max-w-lg">
        <input
          type="text"
          placeholder="Search for media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white"
        />
      </div>

      {/* Loader */}
      {loading && <p className="text-gray-600 mt-4">Loading...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6 w-full max-w-2xl">
        {media.length > 0 ? (
          <ul className="space-y-4">
            {media.map((item) => (
              <li
                key={item.trackId}
                className="flex items-center p-4 bg-white shadow-md rounded-lg"
              >
                <img
                  src={item.artworkUrl100}
                  alt={item.trackName}
                  className="w-16 h-16 rounded-lg mr-4"
                />
                <div>
                  <a
                    href={item.trackViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-blue-600 hover:underline"
                  >
                    {item.trackName}
                  </a>
                  <p className="text-black">{item.artistName}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-gray-500 mt-4">No results found.</p>
        )}
      </div>
    </div>
  );
}
