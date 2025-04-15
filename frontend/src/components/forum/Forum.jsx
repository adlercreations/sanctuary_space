// frontend/src/components/forum/Forum.jsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import ThreadList from './ThreadList';
import CreateThread from './CreateThread';
import ThreadDetail from './ThreadDetail';
import AuthModal from '../AuthModal';
import '../../styles/Forum.css';
import '../../styles/SharedStyles.css';

function Forum() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const handleCreateThread = () => {
    if (isAuthenticated) {  
      setModalOpen(true);
    } else {
      // Show the auth modal instead of redirecting
      setAuthModalOpen(true);
    }
  };

  const handleAuthRequired = () => {
    setAuthModalOpen(true);
  };

  return (
    <div className="forum-container">
      <div className="bottom-image" />
      {isModalOpen && (
        <CreateThread 
          onClose={() => setModalOpen(false)} 
          onAuthRequired={handleAuthRequired}
        />
      )}
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode="login"
      />
      
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
        <Route path="/create" element={<CreateThread onClose={() => {}} onAuthRequired={handleAuthRequired} />} />
        <Route path="/threads/:threadId" element={<ThreadDetail onAuthRequired={handleAuthRequired} />} />
      </Routes>
    </div>
  );
}

export default Forum;