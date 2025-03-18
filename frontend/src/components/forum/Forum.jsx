import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import ThreadList from './ThreadList';
import CreateThread from './CreateThread';
import ThreadDetail from './ThreadDetail';
import '../../styles/Forum.css';

function Forum() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleCreateThread = () => {
    if (isAuthenticated) {  
      setModalOpen(true);
    } else {
      // Store the current location before redirecting
      const currentPath = window.location.pathname;
      navigate('/login', { state: { from: currentPath } });
    }
  };

  return (
    <div className="forum-container">
      {isModalOpen && (
        <CreateThread onClose={() => setModalOpen(false)} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="forum-header">
                <h2 className="forum-title">Community Forum</h2>
                <button
                  className="create-thread-btn"
                  onClick={handleCreateThread}
                >
                  Create New Thread
                </button>
              </div>
              <ThreadList />
            </>
          }
        />
        <Route path="/create" element={<CreateThread />} />
        <Route path="/threads/:threadId" element={<ThreadDetail />} />
      </Routes>
    </div>
  );
}

export default Forum;