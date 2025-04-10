import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getThread, addComment, addReply } from '../../services/forumService';
import { useAuth } from '../AuthContext';
import AuthModal from '../AuthModal';
import '../../styles/ThreadDetail.css';

const ThreadDetail = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const data = await getThread(threadId);
        setThread(data);
      } catch (err) {
        console.error('Error fetching thread:', err);
        setError('Failed to load thread. Please try again.');
      }
    };

    fetchThread();
  }, [threadId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    
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
      if (err.message === 'User not authenticated') {
        setShowAuthModal(true);
      } else {
        setError('Failed to add comment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    
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
      if (err.message === 'User not authenticated') {
        setShowAuthModal(true);
      } else {
        setError('Failed to add reply. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!thread) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="thread-detail">
      <h1>{thread.title}</h1>
      <div className="thread-meta">
        <span>Posted by {thread.author.username}</span>
        <span>{new Date(thread.created_at).toLocaleDateString()}</span>
      </div>
      <div className="thread-content">{thread.content}</div>

      <div className="comments-section">
        <h2>Comments</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={submitting}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="comments-list">
          {thread.comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.author.username}</span>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="comment-content">{comment.content}</div>

              <button
                className="reply-button"
                onClick={() => setReplyingTo(comment.id)}
              >
                Reply
              </button>

              {replyingTo === comment.id && (
                <form onSubmit={handleReplySubmit} className="reply-form">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    disabled={submitting}
                  />
                  <button type="submit" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </button>
                </form>
              )}

              <div className="replies">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="reply">
                    <div className="reply-header">
                      <span className="reply-author">{reply.author.username}</span>
                      <span className="reply-date">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="reply-content">{reply.content}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default ThreadDetail;