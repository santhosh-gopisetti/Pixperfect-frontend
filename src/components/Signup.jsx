import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // 👈 Import the shared auth styling

const API_URL = 'https://pixperfect-backend-3.onrender.com';

function Signup({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 3) {
      setMessage('Username must be at least 3 characters long');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/signup`, { username, password });
      setMessage(response.data.message || 'Signup successful!');
      setIsAuthenticated(false);
      setTimeout(() => navigate('/login', { replace: true }), 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        (error.response?.status === 400
          ? 'Username already exists'
          : 'Signup failed. Check backend status.');
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
          disabled={isLoading}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Signup'}
        </button>

        {message && (
          <p className={message.includes('failed') || message.includes('exists') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
