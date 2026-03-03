import React from 'react';
import type { Movie } from '../types/tmdb';
import './MovieCard.css';

interface MovieCardProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
}

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
    const posterUrl = movie.poster_path
        ? `${POSTER_BASE_URL}${movie.poster_path}`
        : `https://via.placeholder.com/500x750/27272a/ffffff?text=No+Poster+Found`;

    return (
        <div className="movie-card" onClick={() => onClick(movie)}>
            <div className="poster-wrapper">
                <img src={posterUrl} alt={movie.title} className="poster-image" loading="lazy" />
                <div className="poster-overlay">
                    <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
                </div>
            </div>
            <div className="movie-info">
                <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
                <span className="movie-year">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year'}
                </span>
            </div>
        </div>
    );
};
