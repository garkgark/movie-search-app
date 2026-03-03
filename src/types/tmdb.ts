export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
  overview: string;
  vote_average: number;
  runtime?: number;
  budget?: number;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
