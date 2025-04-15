// frontend/src/components/forum/CreateThread.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { createThread } from '../../services/forumService';
import PropTypes from 'prop-types';
import '../../styles/Forum.css';

function CreateThread({ onClose, onAuthRequired }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      setError('Please provide both a title and content for your thread.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await createThread(title, content);
      
      // Redirect to the newly created thread
      navigate(`/community/forum/threads/${response.thread_id}`);
      onClose(); // Close the modal after successful creation
    } catch (err) {
      console.error('Error creating thread:', err);
      if (err.message === 'User not authenticated') {
        onAuthRequired();
      } else {
        setError('Failed to create thread. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-thread-container">
      <h2>Create New Thread</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="thread-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="thread-title">Title</label>
          <input
            type="text"
            id="thread-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="thread-content">Content</label>
          <textarea
            id="thread-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="form-submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Thread'}
          </button>
          <button 
            type="button" 
            className="form-cancel" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

CreateThread.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAuthRequired: PropTypes.func.isRequired
};

export default CreateThread; 