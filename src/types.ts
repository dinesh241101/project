export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  download_count?: number;
  downloads?: DownloadOption[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
}

export interface MovieSection {
  title: string;
  movies: Movie[];
}

export interface DownloadOption {
  quality: string;
  size: string;
  url: string;
}

export interface AdminMovie {
  title: string;
  overview: string;
  release_date: string;
  poster_url: string;
  backdrop_url: string;
  downloads: DownloadOption[];
  genres: string[];
}