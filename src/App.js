import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Playlist from './pages/Playlists';
import Login from './components/Login'; // Assuming you have a login page
import { handleRedirect } from './services/spotifyService'; // Import handleRedirect

// Create an AuthContext to manage auth globally
export const AuthContext = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      return JSON.parse(savedDarkMode);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';

    // Call handleRedirect and pass the login function
    handleRedirect(login);
  }, [darkMode]); // Add login to the dependency array if it's defined in the App component

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      <Router>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route
            path="/playlist"
            element={
              authToken ? <Playlist /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
