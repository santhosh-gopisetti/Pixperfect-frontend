import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Updated: Define API_URL using environment variable
const API_URL ='https://pixperfect-backend-3.onrender.com';

function Signup({ setIsAuthenticated }) {
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
      // Updated: Use API_URL for /signup endpoint
      const response = await axios.post(`${API_URL}/signup`, { username, password });
      setMessage(response.data.message || 'Signup successful! Redirecting to login...');
      setIsAuthenticated(false);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    } catch (error) {
      // Updated: Improved error handling
      const errorMsg = error.response?.data?.error || 
        error.response?.status === 400 ? 'Username already exists' : 
        'Signup failed. Check backend status.';
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-layout">
      <main className="signup-main">
        <div className="signup-container">
          <h2 id="signup-heading">Signup</h2>
          <form onSubmit={handleSubmit} aria-labelledby="signup-heading">
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
                  Signing up... <span className="animate-spin inline-block ml-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                </>
              ) : (
                'Signup'
              )}
            </button>
          </form>
          {message && (
            <p className={message.includes('failed') || message.includes('exists') ? 'error-message' : 'success-message'}>
              {message}
            </p>
          )}
        </div>
      </main>

      <footer className="signup-footer">
        <p>
          Already have an account? <Link to="/login" className="link">Login</Link>
        </p>
      </footer>
    </div>
  );
}

export default Signup;