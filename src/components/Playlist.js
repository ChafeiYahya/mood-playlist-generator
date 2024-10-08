import React from 'react';
import { useLocation } from 'react-router-dom';

const Playlist = () => {
  const location = useLocation();
  const playlist = location.state?.playlist || [];

  return (
    <div>
      <h1>Your Playlist</h1>
      {playlist.length > 0 ? (
        <ul>
          {playlist.map((song, index) => (
            <li key={index}>{song}</li>
          ))}
        </ul>
      ) : (
        <p>No playlist found. Try analyzing your mood again.</p>
      )}
    </div>
  );
};

export default Playlist;
