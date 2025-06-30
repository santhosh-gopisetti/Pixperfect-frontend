import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Editor from './components/Editor';
import Images from './components/Images.jsx';
import Upload from './components/Upload';
import './App.css';

// ProtectedRoute component to restrict access to authenticated users
function ProtectedRoute({ isAuthenticated, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (location.pathname === '/editor' && !location.state?.image) {
      navigate('/images', { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? children : null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <nav className="app-nav">
          <Link to="/">Home</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/upload">Upload</Link>
              <Link to="/images">Images</Link>
              <Link to="/editor" state={{ image: null }}>Edit</Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <div
                className="home-container"
                style={{
                  backgroundImage: 'url(/RRR.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '40px',
                  minHeight: '100vh',
                  color: '#fff',
                  opacity:0.5
                }}
              >
                <h2>Welcome to PixPerfect</h2>
                <p>Make your frames visually more appealing !!</p>
                <div className="homepage-images">
                  <img src="/KHALEJA DUNE.jpg" alt="Banner 1" className="home-banner" />
                  <img src="/Kalki 70s poster.jpg" alt="Banner 2" className="home-banner" />
                  <img src="/JVAS DEVARA.jpg" alt="Banner 3" className="home-banner" />
                </div>
              </div>
            }
          />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/images"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Images />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
