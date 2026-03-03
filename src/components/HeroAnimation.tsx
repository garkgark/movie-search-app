import React, { useEffect, useState } from 'react';
import type { Movie } from '../types/tmdb';
import './HeroAnimation.css';

interface HeroAnimationProps {
    movies: Movie[];
    onInteraction: () => void;
}

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const HeroAnimation: React.FC<HeroAnimationProps> = ({ movies, onInteraction }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [positions, setPositions] = useState<{ x: number, y: number, scale: number, rotation: number, delay: number }[]>([]);

    useEffect(() => {
        // Generate random initial positions for the floating effect
        const newPositions = movies.slice(0, 15).map(() => ({
            x: Math.random() * 100 - 50, // -50vw to 50vw from center
            y: Math.random() * 100 - 50, // -50vh to 50vh from center
            scale: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
            rotation: Math.random() * 40 - 20, // -20deg to 20deg
            delay: Math.random() * 2 // 0s to 2s animation delay
        }));
        setPositions(newPositions);
    }, [movies]);

    useEffect(() => {
        const handleInteraction = () => {
            if (!isExiting) {
                setIsExiting(true);
                // Wait for the exit animation to complete before changing the state in App.tsx
                setTimeout(() => {
                    onInteraction();
                }, 800); // matches CSS transition duration
            }
        };

        window.addEventListener('mousemove', handleInteraction, { once: true });
        window.addEventListener('scroll', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [isExiting, onInteraction]);

    if (movies.length === 0) return null;

    return (
        <div className={`hero-animation-container ${isExiting ? 'hero-exiting' : ''}`}>
            <div className="hero-content">
                <div className="hero-logo-placeholder">
                    <h2>🎬 Cinema Explorer</h2>
                </div>
                <h1 className="hero-title">
                    Experience liftoff with<br />the next-generation movie discovery
                </h1>
                <p className="hero-subtitle">Move your mouse to start exploring</p>
                <button className="hero-button" onClick={() => !isExiting && setIsExiting(true)}>
                    Dive In
                </button>
            </div>

            <div className={`floating-posters-layer ${isExiting ? 'posters-snapping' : ''}`}>
                {movies.slice(0, 15).map((movie, index) => {
                    const pos = positions[index];
                    if (!pos || !movie.poster_path) return null;

                    const posterUrl = `${POSTER_BASE_URL}${movie.poster_path}`;

                    // We bind the custom CSS vars to power the complex animation
                    const style = {
                        '--float-x': `${pos.x}vw`,
                        '--float-y': `${pos.y}vh`,
                        '--float-scale': pos.scale,
                        '--float-rot': `${pos.rotation}deg`,
                        '--anim-delay': `${pos.delay}s`
                    } as React.CSSProperties;

                    return (
                        <div key={movie.id} className="floating-poster" style={style}>
                            <img src={posterUrl} alt="" className="floating-poster-img" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
