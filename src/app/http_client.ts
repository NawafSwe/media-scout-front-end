import { MediaItem, ApiResponse } from "./model";

/**
 * @function
 * @async
 * @name fetchMedia
 * @param term - The search term to query media items.
 * @description Fetches media from the media scout backend.
 * @returns A promise resolving to an array of MediaItem objects.
 */
export const fetchMedia = async (term: string): Promise<MediaItem[]> => {
  if (!term) return [] as MediaItem[];

  try {
    const response = await fetch(
      `http://localhost:3001/api/v1/media/search?term=${term}&limit=25`
    );

    if (!response.ok) throw new Error("Failed to fetch media");

    const data: ApiResponse = await response.json();
    return data.media || [];
  } catch (err) {
    console.error("Fetch Error:", err);
    throw new Error("Error fetching media");
  }
};
