import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Updated: Define API_URL using environment variable
const API_URL ='https://pixperfect-backend-3.onrender.com';

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
      return;
    }

    // Validate file type
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Updated: Use API_URL for /upload endpoint
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'Image uploaded successfully!');
      // Reset form
      setFile(null);
      // Updated: Add refresh trigger for /images
      setTimeout(() => {
        navigate('/images', { replace: true, state: { refresh: true } });
      }, 1000);
    } catch (error) {
      // Updated: Improved error handling
      const errorMsg = error.response?.data?.error || 
        error.response?.status === 401 ? 'Session expired. Please log in again.' : 
        error.response?.status === 400 ? 'Invalid image file.' : 
        'Upload failed. Check backend status.';
      setMessage(errorMsg);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-layout">
      <header className="upload-header">
        <h1>Image Editor</h1>
      </header>

      <main className="upload-main">
        <div className="upload-container">
          <h2 id="upload-heading">Upload Image</h2>
          <form onSubmit={handleSubmit} aria-labelledby="upload-heading">
            <div className="form-group">
              <label htmlFor="image-upload">Choose an image</label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                disabled={isLoading}
                aria-required="true"
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  Uploading... <span className="animate-spin inline-block ml-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                </>
              ) : (
                'Upload'
              )}
            </button>
          </form>
          {message && (
            <p className={message.includes('failed') || message.includes('Please') || message.includes('Invalid') || message.includes('expired') ? 'error-message' : 'success-message'}>
              {message}
            </p>
          )}
        </div>
      </main>

      <footer className="upload-footer">
        <p>
          View your images <Link to="/images" className="link">here</Link>
        </p>
      </footer>
    </div>
  );
}

export default Upload;