import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import '../styles/SharedStyles.css';
import '../styles/MoodBoard.css';

function MoodBoardPage() {
  const [images, setImages] = useState([]);
  const { api, user } = useAuth();
  const [newImage, setNewImage] = useState({ url: '', caption: '' });

  useEffect(() => {
    fetchImages();
  }, [api]);

  const fetchImages = async () => {
    try {
      const response = await api.get('/api/mood-board/images');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching mood board images:', error);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/mood-board/images', {
        image_url: newImage.url,
        caption: newImage.caption
      });
      setNewImage({ url: '', caption: '' });
      fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/api/mood-board/images/${imageId}`);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
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
          <div className="mood-board-grid">
            {images.map((image) => (
              <div key={image.id} className="mood-board-item">
                <img src={image.image_url} alt={image.caption || 'Mood board image'} />
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
            ))}
          </div>
        </div>
      </div>
      <div className="bottom-image"></div>
    </div>
  );
}

export default MoodBoardPage;