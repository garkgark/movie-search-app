import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { MovieGrid } from './components/MovieGrid';
import { FilterPanel } from './components/FilterPanel';
import { MovieModal } from './components/MovieModal';
import { fetchGenres, fetchMovies } from './api/tmdb';
import type { Genre, Movie } from './types/tmdb';
import './App.css';

function App() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1960, 2026]);

  // Debounce the filter values
  const [debouncedYearRange] = useDebounce(yearRange, 500);
  const [debouncedSelectedGenres] = useDebounce(selectedGenres, 500);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Load genres on mount
  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch((err) => console.error('Failed to load genres:', err));
  }, []);

  // Fetch movies when filters or page changes
  const loadMovies = useCallback(async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      const currentPage = reset ? 1 : page;

      const response = await fetchMovies({
        page: currentPage,
        primary_release_date_gte: `${debouncedYearRange[0]}-01-01`,
        primary_release_date_lte: `${debouncedYearRange[1]}-12-31`,
        with_genres: debouncedSelectedGenres.length > 0 ? debouncedSelectedGenres.join(',') : undefined,
      });

      if (reset) {
        setMovies(response.results);
      } else {
        setMovies((prev) => [...prev, ...response.results]);
      }

      setHasMore(response.page < response.total_pages && response.page < 15); // Max 15 rows roughly (assuming 20 per page, technically 300 movies max per user spec if referring to items, but let's cap pages simply)
      if (reset) setPage(2);
      else setPage((p) => p + 1);
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedYearRange, debouncedSelectedGenres]);

  useEffect(() => {
    loadMovies(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedYearRange, debouncedSelectedGenres]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      if (!isLoading && hasMore) {
        loadMovies(false);
      }
    }
  }, [isLoading, hasMore, loadMovies]);

  // Infinite scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Movie Discovery</h1>
        <p>Find your next favorite film, filtering by year and genre.</p>
      </header>

      <main>
        <MovieGrid
          movies={movies}
          onMovieClick={setSelectedMovie}
          isLoading={isLoading}
        />
        {isLoading && movies.length > 0 && (
          <div className="loading-more">Loading more movies...</div>
        )}
      </main>

      <FilterPanel
        genres={genres}
        selectedGenres={selectedGenres}
        onGenreToggle={handleGenreToggle}
        yearRange={yearRange}
        onYearRangeChange={setYearRange}
      />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
