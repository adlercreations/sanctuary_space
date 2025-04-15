// frontend/src/components/forum/ThreadList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getThreads } from '../../services/forumService';
import '../../styles/Forum.css';

function ThreadList() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent_activity');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const data = await getThreads(sortBy);
        setThreads(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError('Failed to load threads. Please check your network connection or try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

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

  if (loading) {
    return <div className="loading">Loading threads...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="thread-list-container">
      <div className="forum-controls">
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="recent_activity">Recent Activity</option>
            <option value="most_active">Most Active</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {threads.length === 0 ? (
        <div className="no-threads">
          <p>No threads found. Be the first to create a discussion!</p>
        </div>
      ) : (
        <div className="thread-list">
          {threads.map((thread) => (
            <div key={thread.id} className="thread-item">
              <div className="thread-header">
                <Link to={`/community/forum/threads/${thread.id}`}>
                  <h3 className="thread-title">{thread.title}</h3>
                </Link>
              </div>
              <div className="thread-meta">
                <span className="thread-author">By: {thread.author}</span>
                <span className="thread-date">
                  {formatDate(thread.created_at)}
                </span>
              </div>
              <div className="thread-content">
                {thread.content.length > 150
                  ? `${thread.content.substring(0, 150)}...`
                  : thread.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThreadList; 