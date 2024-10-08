import React, { useState, useEffect } from 'react';
import Sentiment from 'sentiment';
import { loginSpotify, getAccessTokenFromUrl, setAccessToken, searchSpotifyPlaylists, playPlaylist } from '../services/spotifyService';
import StickyPlayer from './StickyPlayer';

const MoodInput = () => {
    const [mood, setMood] = useState('');
    const [sentimentScore, setSentimentScore] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [accessToken, setAccessTokenState] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [player, setPlayer] = useState(null); 
    const sentiment = new Sentiment();

    useEffect(() => {
        const tokenInfo = getAccessTokenFromUrl();
        if (tokenInfo.access_token) {
            setAccessToken(tokenInfo.access_token);
            setAccessTokenState(tokenInfo.access_token);
        } else {
            const storedToken = localStorage.getItem('spotify_access_token');
            if (storedToken) {
                setAccessTokenState(storedToken);
            }
        }

        if (accessToken) {
            window.onSpotifyWebPlaybackSDKReady = () => {
                const playerInstance = new window.Spotify.Player({
                    name: 'Mood Playlist Player',
                    getOAuthToken: cb => { cb(accessToken); },
                });

                setPlayer(playerInstance); 

                playerInstance.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    setDeviceId(device_id);
                });

                playerInstance.addListener('initialization_error', ({ message }) => {
                    console.error('Failed to initialize:', message);
                });
                playerInstance.addListener('authentication_error', ({ message }) => {
                    console.error('Failed to authenticate:', message);
                });
                playerInstance.addListener('account_error', ({ message }) => {
                    console.error('Account error:', message);
                });
                playerInstance.addListener('playback_error', ({ message }) => {
                    console.error('Playback error:', message);
                });

                playerInstance.connect();
            };
        }
    }, [accessToken]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!accessToken) {
          loginSpotify(); 
          return;
      }
  
      const result = sentiment.analyze(mood);
      setSentimentScore(result.score);
  
      let moodType = 'neutral';
      if (result.score > 0) {
          moodType = 'happy';
      } else if (result.score < 0) {
          moodType = 'sad';
      }
  
      const playlists = await searchSpotifyPlaylists(moodType);
      setPlaylist(playlists);
  
      if (playlists.length > 0 && deviceId) {
          await playPlaylist(deviceId, playlists[0].uri);
  
          const currentPlayer = player; 
          if (currentPlayer) {
              currentPlayer.setVolume(0); 
  
              let volume = 0;
              const fadeInInterval = setInterval(() => {
                  volume += 0.1; 
                  if (volume >= 1) {
                      volume = 1;
                      clearInterval(fadeInInterval); 
                  }
                  currentPlayer.setVolume(volume); 
              }, 300); // Change every 300 ms
          }
      }
  };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter your mood:
                    <input
                        type="text"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>

            {sentimentScore !== null && (
                <div>
                    <h3>Sentiment Analysis Result:</h3>
                    <p>Sentiment Score: {sentimentScore}</p>
                    <ul>
                        {playlist.map((pl, index) => (
                            <li key={index}>
                                <a href={pl.external_urls.spotify} target="_blank" rel="noreferrer">
                                    {pl.name} by {pl.owner.display_name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Add the StickyPlayer at the bottom */}
            {player && <StickyPlayer player={player} />}
        </div>
    );
};

export default MoodInput;