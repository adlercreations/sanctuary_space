import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { getThread, addComment, addReply } from '../../services/forumService';
import '../../styles/Forum.css';

function ThreadDetail() {
  const { threadId } = useParams();
  const { isAuthenticated } = useAuth();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const data = await getThread(threadId);
        setThread(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching thread:', err);
        setError('Failed to load thread. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      await addComment(threadId, newComment);
      
      // Refresh thread data to show the new comment
      const updatedThread = await getThread(threadId);
      setThread(updatedThread);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      if (err.response && err.response.status === 401) {
        setError('You must be logged in to comment.');
      } else {
        setError('Failed to add comment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim() || !replyingTo) return;
    
    try {
      setSubmitting(true);
      await addReply(replyingTo, replyContent);
      
      // Refresh thread data to show the new reply
      const updatedThread = await getThread(threadId);
      setThread(updatedThread);
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Error adding reply:', err);
      if (err.response && err.response.status === 401) {
        setError('You must be logged in to reply.');
      } else {
        setError('Failed to add reply. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const startReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  if (loading) {
    return <div className="loading-spinner">Loading thread...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!thread) {
    return <div className="error-message">Thread not found</div>;
  }

  return (
    <div className="thread-detail-container">
      <div className="thread-detail">
        <h2 className="thread-detail-title">{thread.title}</h2>
        <div className="thread-detail-meta">
          <span className="thread-author">Posted by: {thread.author}</span>
          <span className="thread-date">{formatDate(thread.created_at)}</span>
        </div>
        <div className="thread-detail-content">{thread.content}</div>
      </div>

      <div className="comments-section">
        <h3 className="comments-title">Comments ({thread.comments.length})</h3>
        
        {isAuthenticated ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <div className="form-group">
              <label htmlFor="comment-content">Add a comment</label>
              <textarea
                id="comment-content"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                required
              />
            </div>
            <button 
              type="submit" 
              className="form-submit" 
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="auth-message">
            <p>
              Please <Link to="/login" className="auth-link">log in</Link> or{' '}
              <Link to="/signup" className="auth-link">sign up</Link> to join the conversation.
            </p>
          </div>
        )}
        
        {thread.comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="comments-list">
            {thread.comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
                
                {isAuthenticated && (
                  <div className="comment-actions">
                    <button 
                      className="reply-button" 
                      onClick={() => startReply(comment.id)}
                    >
                      Reply
                    </button>
                  </div>
                )}
                
                {replyingTo === comment.id && (
                  <form className="reply-form" onSubmit={handleReplySubmit}>
                    <div className="form-group">
                      <label htmlFor="reply-content">Your reply</label>
                      <textarea
                        id="reply-content"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="form-submit"
                        disabled={submitting || !replyContent.trim()}
                      >
                        {submitting ? 'Posting...' : 'Post Reply'}
                      </button>
                      <button 
                        type="button" 
                        className="form-cancel"
                        onClick={cancelReply}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="replies-section">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="reply-item">
                        <div className="reply-header">
                          <span className="reply-author">{reply.author}</span>
                          <span className="reply-date">{formatDate(reply.created_at)}</span>
                        </div>
                        <div className="reply-content">{reply.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreadDetail;