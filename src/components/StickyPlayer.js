import React, { useEffect, useState } from 'react';
import './StickyPlayer.css'; // Import the CSS file for styles

const StickyPlayer = ({ player }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5); // Default volume (50%)
    const [currentTrack, setCurrentTrack] = useState({}); // Track information

    useEffect(() => {
        if (player) {
            const handlePlayerStateChange = state => {
                if (state) {
                    setIsPlaying(!state.paused);
                    setCurrentTrack(state.track_window.current_track);
                }
            };

            // Add player state listener
            player.addListener('player_state_changed', handlePlayerStateChange);

            // Cleanup listener on component unmount
            return () => {
                player.removeListener('player_state_changed', handlePlayerStateChange);
            };
        }
    }, [player]);

    const handlePlayPause = () => {
        if (isPlaying) {
            player.pause().then(() => setIsPlaying(false));
        } else {
            player.resume().then(() => setIsPlaying(true));
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        player.setVolume(newVolume);
    };

    const handleNext = () => {
        player.nextTrack();
    };

    const handlePrevious = () => {
        player.previousTrack();
    };

    return (
        <div className="sticky-player">
            <div className="cover-art">
                <img src={currentTrack?.album?.images[0]?.url} alt={currentTrack?.name} />
            </div>
            <div className="track-info">
                <h3>{currentTrack?.name || 'No track playing'}</h3>
                <p>{currentTrack?.artists?.map(artist => artist.name).join(', ') || 'No artist'}</p>
            </div>
            <div className="player-controls"> {/* Centered player controls */}
                <button onClick={handlePrevious} aria-label="Previous track">
                    &#9664; {/* Left arrow */}
                </button>
                <button onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={handleNext} aria-label="Next track">
                    &#9654; {/* Right arrow */}
                </button>
            </div>
            <div className="volume-slider-container"> {/* New container for volume slider */}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                />
                <span>{Math.round(volume * 100)}%</span>
            </div>
        </div>
    );
    
};

export default StickyPlayer;
