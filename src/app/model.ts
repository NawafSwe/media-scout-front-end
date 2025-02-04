export interface MediaItem {
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
  
  export interface ApiResponse {
    id: number;
    search_term: string;
    result_count: number;
    media: MediaItem[];
  }
  
  