import React, { useEffect, useState } from 'react';
import type { Movie } from '../types/tmdb';
import { fetchMovieDetails } from '../api/tmdb';
import { ExternalLink, X } from 'lucide-react';
import './MovieModal.css';

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
    const [detailedMovie, setDetailedMovie] = useState<Movie>(movie);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Fetch detailed info
        setIsLoadingDetails(true);
        fetchMovieDetails(movie.id)
            .then(data => setDetailedMovie(data))
            .catch(err => console.error("Failed to load details", err))
            .finally(() => setIsLoadingDetails(false));

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [movie.id]);

    const posterUrl = detailedMovie.poster_path
        ? `${POSTER_BASE_URL}${detailedMovie.poster_path}`
        : `https://via.placeholder.com/500x750/27272a/ffffff?text=No+Poster+Found`;

    const handleWatchClick = () => {
        const query = encodeURIComponent(`де подивитись ${detailedMovie.title}`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose} aria-label="Close Movie Details">
                    <X size={24} />
                </button>

                <div className="modal-body">
                    <div className="modal-poster-wrapper">
                        <img src={posterUrl} alt={movie.title} className="modal-poster" />
                    </div>

                    <div className="modal-info">
                        <h2 className="modal-title">{detailedMovie.title}</h2>
                        {detailedMovie.tagline && (
                            <p className="modal-tagline">{detailedMovie.tagline}</p>
                        )}
                        <div className="modal-meta">
                            <span className="modal-rating">★ {detailedMovie.vote_average.toFixed(1)}</span>
                            <span className="modal-date">
                                {detailedMovie.release_date ? new Date(detailedMovie.release_date).toLocaleDateString() : 'Unknown'}
                            </span>
                            {detailedMovie.runtime && (
                                <span className="modal-runtime">
                                    {detailedMovie.runtime} min
                                </span>
                            )}
                        </div>

                        {detailedMovie.budget && detailedMovie.budget > 0 ? (
                            <div className="modal-budget">
                                <strong>Budget:</strong> ${detailedMovie.budget.toLocaleString()}
                            </div>
                        ) : null}

                        <div className="modal-overview-container">
                            <h3>Overview</h3>
                            {isLoadingDetails ? (
                                <p className="modal-overview loading-pulse">Loading details...</p>
                            ) : (
                                <p className="modal-overview">{detailedMovie.overview || 'No overview available.'}</p>
                            )}
                        </div>

                        <button className="watch-button" onClick={handleWatchClick}>
                            <ExternalLink size={18} />
                            Де можна переглянути
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
