
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App'; // Import the AuthContext

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mock API call for login
    const token = await mockLoginAPI(username, password);
    if (token) {
      login(token); // Save the token via context
    } else {
      alert('Invalid credentials');
    }
  };

  // This is just a mock function. Replace it with a real API call.
  const mockLoginAPI = async (username, password) => {
    if (username === 'test' && password === 'password') {
      return 'mocked-jwt-token'; // Return a mocked token for demo
    }
    return null;
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;