import axios from 'axios';

const clientId = 'ed7e1e824942493d903eca98e7447866'; 
const redirectUri = 'http://localhost:3000';

const scopes = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'playlist-read-private',
  'user-read-email',
  'user-read-private'
].join(' ');

const authEndpoint = 'https://accounts.spotify.com/authorize';

const loginSpotify = () => {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=token&show_dialog=true`;
  console.log('Authorization URL:', authUrl);
  window.location = authUrl; // Redirect to Spotify login
};

const handleRedirect = (login) => {
  const tokenInfo = getAccessTokenFromUrl();
  if (tokenInfo.access_token) {
    setAccessToken(tokenInfo.access_token); // Save token to localStorage
    login(tokenInfo.access_token); // Call login from context to update state
    window.history.pushState({}, document.title, window.location.pathname); // Clear the URL
  }
};

const getAccessTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      let parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

const setAccessToken = (token) => {
  localStorage.setItem('spotify_access_token', token);
};

const getAccessToken = () => {
  return localStorage.getItem('spotify_access_token');
};

const searchSpotifyPlaylists = async (mood) => {
  const token = getAccessToken();
  if (!token) {
    console.error('No access token found. You need to authenticate first.');
    return [];
  }
  console.log("Access Token:", token);

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.playlists.items;
  } catch (error) {
    if (error.response) {
      console.error('Error fetching Spotify playlists:', error.response.data);
    } else {
      console.error('Error fetching Spotify playlists:', error.message);
    }
    return [];
  }
};

const playPlaylist = async (deviceId, playlistUri) => {
  const token = getAccessToken();
  console.log("Access Token:", token);

  if (!token) {
    console.error('No access token found. You need to authenticate first.');
    return;
  }

  try {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      { context_uri: playlistUri },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    console.error('Error playing the playlist:', error);
  }
};

export { loginSpotify, handleRedirect, getAccessTokenFromUrl, setAccessToken, searchSpotifyPlaylists, playPlaylist };
