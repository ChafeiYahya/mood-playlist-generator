import React from 'react';
import MoodInput from '../components/MoodInput';

const Home = ({ darkMode }) => {
  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>Mood Playlist Generator</h1>
      <MoodInput />
    </div>
  );
};

export default Home;
