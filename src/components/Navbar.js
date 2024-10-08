import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../App'; // Import the AuthContext
import { loginSpotify } from '../services/spotifyService'; // Import login function


const Navbar = ({ toggleDarkMode, darkMode }) => {
  const { authToken, logout } = useContext(AuthContext); // Use AuthContext

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/playlist">Playlist</Link></li>
        {/* Conditionally render login/logout based on authToken */}
        {!authToken ? (
          <li>
            <button className="login-button" onClick={loginSpotify}>
              Login to Spotify
            </button>
          </li>
        ) : (
          <li>
            <span onClick={logout} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              Logout
            </span>
          </li>
        )}
      </ul>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
      </button>
    </nav>
  );
};

export default Navbar;
