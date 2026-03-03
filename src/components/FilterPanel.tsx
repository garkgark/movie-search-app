import React from 'react';
import type { Genre } from '../types/tmdb';
import './FilterPanel.css';

interface FilterPanelProps {
    genres: Genre[];
    selectedGenres: number[];
    onGenreToggle: (genreId: number) => void;
    yearRange: [number, number];
    onYearRangeChange: (range: [number, number]) => void;
}

const MIN_YEAR = 1960;
const MAX_YEAR = 2026;

export const FilterPanel: React.FC<FilterPanelProps> = ({
    genres,
    selectedGenres,
    onGenreToggle,
    yearRange,
    onYearRangeChange,
}) => {
    const handleYearChange = (index: 0 | 1, value: string) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return;

        const newRange: [number, number] = [...yearRange] as [number, number];
        newRange[index] = numValue;

        // Ensure logic: min <= max
        if (index === 0 && newRange[0] > newRange[1]) newRange[0] = newRange[1];
        if (index === 1 && newRange[1] < newRange[0]) newRange[1] = newRange[0];

        onYearRangeChange(newRange);
    };

    return (
        <div className="filter-panel glass-panel">
            <div className="filter-content">
                <div className="filter-section year-section">
                    <div className="year-slider-container">
                        <span className="year-label">{MIN_YEAR}</span>
                        <div className="sliders">
                            <input
                                type="range"
                                min={MIN_YEAR}
                                max={MAX_YEAR}
                                value={yearRange[0]}
                                onChange={(e) => handleYearChange(0, e.target.value)}
                                className="slider min-slider"
                            />
                            <input
                                type="range"
                                min={MIN_YEAR}
                                max={MAX_YEAR}
                                value={yearRange[1]}
                                onChange={(e) => handleYearChange(1, e.target.value)}
                                className="slider max-slider"
                            />
                            <div className="range-display">
                                {yearRange[0]} - {yearRange[1]}
                            </div>
                        </div>
                        <span className="year-label">{MAX_YEAR}</span>
                    </div>
                </div>

                <div className="filter-section genre-section">
                    <div className="genre-wrap-container">
                        {genres.map((genre) => (
                            <button
                                key={genre.id}
                                className={`genre-pill ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                                onClick={() => onGenreToggle(genre.id)}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
