import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/SharedStyles.css';
import '../styles/MoodBoard.css';
import { apiService, API_BASE_URL } from '../services/api';

// Simple placeholder image as base64
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

function MoodBoardPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newImage, setNewImage] = useState({ url: '', caption: '' });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get('/mood-board/images');
      setImages(response || []);
    } catch (error) {
      console.error('Error fetching mood board images:', error);
      setError('Failed to load images. Please try again later.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!user?.is_admin) {
      setError('Only administrators can add images.');
      return;
    }
    try {
      setError(null);
      await apiService.post('/mood-board/images', {
        image_url: newImage.url,
        caption: newImage.caption
      });
      setNewImage({ url: '', caption: '' });
      await fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
      if (error.response?.status === 401) {
        setError('You must be logged in as an administrator to add images.');
      } else {
        setError('Failed to add image. Please try again.');
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!user?.is_admin) {
      setError('Only administrators can delete images.');
      return;
    }
    try {
      setError(null);
      await apiService.delete(`/mood-board/images/${imageId}`);
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      if (error.response?.status === 401) {
        setError('You must be logged in as an administrator to delete images.');
      } else {
        setError('Failed to delete image. Please try again.');
      }
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    const originalUrl = e.target.getAttribute('data-original-url');
    console.error('Image load failed:', originalUrl);
    e.target.src = PLACEHOLDER_IMAGE;
  };

  const getProxiedImageUrl = (originalUrl) => {
    if (!originalUrl) {
      return { url: PLACEHOLDER_IMAGE, originalUrl };
    }
    const proxyUrl = `${API_BASE_URL}/mood-board/proxy-image?url=${encodeURIComponent(originalUrl)}`;
    return { url: proxyUrl, originalUrl };
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">Sanctuary Space Aesthetic</h1>
        <div className="content-text">
          {user?.is_admin && (
            <form onSubmit={handleAddImage} className="add-image-form">
              <input
                type="url"
                placeholder="Image URL"
                value={newImage.url}
                onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Caption (optional)"
                value={newImage.caption}
                onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
              />
              <button type="submit">Add Image</button>
            </form>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="mood-board-grid">
              {images.length === 0 ? (
                <p>No images available.</p>
              ) : (
                images.map((image) => (
                  <div key={image.id} className="mood-board-item">
                    <img 
                      src={getProxiedImageUrl(image.image_url).url} 
                      data-original-url={image.image_url}
                      alt={image.caption || 'Mood board image'} 
                      onError={handleImageError}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                    {image.caption && <p className="caption">{image.caption}</p>}
                    {user?.is_admin && (
                      <button
                        className="delete-image-btn"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <div className="bottom-image"></div>
    </div>
  );
}

export default MoodBoardPage;