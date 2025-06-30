import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

// Updated: Define API_URL using environment variable
const API_URL ='https://pixperfect-backend-3.onrender.com';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
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
      // Updated: Use API_URL for /login endpoint
      const response = await axios.post(`${API_URL}/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setMessage('Login successful');
      setTimeout(() => {
        navigate('/images', { replace: true });
      }, 1000);
    } catch (error) {
      // Updated: Improved error handling
      const errorMsg = error.response?.data?.error || 
        error.response?.status === 401 ? 'Invalid username or password' : 
        'Login failed. Check backend status.';
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <main className="login-main">
        <div className="login-container">
          <h2 id="login-heading">Login</h2>
          <form onSubmit={handleSubmit} aria-labelledby="login-heading">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                aria-required="true"
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  Logging in... <span className="animate-spin inline-block ml-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
          {message && (
            <p className={message.includes('successful') ? 'success-message' : 'error-message'}>
              {message}
            </p>
          )}
        </div>
      </main>

      <footer className="login-footer">
        <p>
          Don't have an account? <Link to="/signup" className="link">Signup</Link>
        </p>
      </footer>
    </div>
  );
}

export default Login;