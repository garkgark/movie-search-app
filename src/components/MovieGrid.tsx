import React from 'react';
import type { Movie } from '../types/tmdb';
import { MovieCard } from './MovieCard';
import './MovieGrid.css';

interface MovieGridProps {
    movies: Movie[];
    onMovieClick: (movie: Movie) => void;
    isLoading: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onMovieClick, isLoading }) => {
    if (isLoading && movies.length === 0) {
        return (
            <div className="grid-loading">
                <div className="spinner"></div>
                <p>Loading movies...</p>
            </div>
        );
    }

    if (!isLoading && movies.length === 0) {
        return (
            <div className="grid-empty">
                <p>No movies found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className={`movie-grid ${isLoading ? 'fade-out' : ''}`}>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
            ))}
        </div>
    );
};
