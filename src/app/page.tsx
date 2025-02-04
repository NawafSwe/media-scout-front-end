"use client";
import { useEffect, useState } from "react";
import { fetchMedia } from "./http_client";
import { MediaItem } from "./model";

const MediaPage = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // User input
  const [debouncedTerm, setDebouncedTerm] = useState(""); // Debounced search term

  // Debounce effect: update debouncedTerm after 500ms when searchTerm changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch media when debouncedTerm changes
  useEffect(() => {
    if (!debouncedTerm) {
      setMedia([]);
      return;
    }

    const loadMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMedia(debouncedTerm);
        setMedia(data);
      } catch (err) {
        setError("Error fetching media");
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
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
};

export default MediaPage;
