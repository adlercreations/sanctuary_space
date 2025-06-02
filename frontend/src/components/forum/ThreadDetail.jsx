// frontend/src/components/forum/ThreadDetail.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getThread, addComment, addReply } from '../../services/forumService';
import { useAuth } from '../AuthContext';
import AuthModal from '../AuthModal';
import '../../styles/ThreadDetail.css';

const ThreadDetail = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [formStates, setFormStates] = useState({
    comment: { content: '', submitting: false },
    reply: { content: '', submitting: false, replyingTo: null }
  });
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isAuthenticated } = useAuth();

  const fetchThread = useCallback(async () => {
    try {
      const data = await getThread(threadId);
      setThread(data);
      setError('');
    } catch (err) {
      console.error('Error fetching thread:', err);
      setError('Failed to load thread. Please try again.');
    }
  }, [threadId]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const handleSubmit = async (type, e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }

    const isComment = type === 'comment';
    const content = isComment ? formStates.comment.content : formStates.reply.content;
    
    if (!content.trim() || (!isComment && !formStates.reply.replyingTo)) return;
    
    setFormStates(prev => ({
      ...prev,
      [type]: { ...prev[type], submitting: true }
    }));
    
    try {
      if (isComment) {
        await addComment(threadId, content);
      } else {
        await addReply(formStates.reply.replyingTo, content);
      }
      
      await fetchThread();
      
      setFormStates(prev => ({
        ...prev,
        [type]: {
          content: '',
          submitting: false,
          ...(type === 'reply' && { replyingTo: null })
        }
      }));
    } catch (err) {
      console.error(`Error adding ${type}:`, err);
      if (err.message === 'User not authenticated') {
        setShowAuthModal(true);
      } else {
        setError(`Failed to add ${type}. Please try again.`);
      }
      setFormStates(prev => ({
        ...prev,
        [type]: { ...prev[type], submitting: false }
      }));
    }
  };

  const startReply = (commentId) => {
    setFormStates(prev => ({
      ...prev,
      reply: { ...prev.reply, replyingTo: commentId }
    }));
  };

  if (!thread) {
    return <div className="loading">Loading...</div>;
  }

  const { comment, reply } = formStates;

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
        
        <form onSubmit={(e) => handleSubmit('comment', e)} className="comment-form">
          <textarea
            value={comment.content}
            onChange={(e) => setFormStates(prev => ({
              ...prev,
              comment: { ...prev.comment, content: e.target.value }
            }))}
            placeholder="Add a comment..."
            disabled={comment.submitting}
          />
          <button type="submit" disabled={comment.submitting}>
            {comment.submitting ? 'Posting...' : 'Post Comment'}
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
                onClick={() => startReply(comment.id)}
              >
                Reply
              </button>

              {reply.replyingTo === comment.id && (
                <form onSubmit={(e) => handleSubmit('reply', e)} className="reply-form">
                  <textarea
                    value={reply.content}
                    onChange={(e) => setFormStates(prev => ({
                      ...prev,
                      reply: { ...prev.reply, content: e.target.value }
                    }))}
                    placeholder="Write a reply..."
                    disabled={reply.submitting}
                  />
                  <button type="submit" disabled={reply.submitting}>
                    {reply.submitting ? 'Posting...' : 'Post Reply'}
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