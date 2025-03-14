// This component is no longer used as authentication has been moved to the NavBar
// Keeping a minimal version for potential future use

import React from 'react';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';
import { checkAuthStatus } from '../utils/checkAuth';
import '../styles/AuthButtons.css?v=1';

const AuthButtons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const { isAuthenticated, login, logout } = useAuth();

  const handleLoginClick = () => {
    setModalMode('login');
    setIsModalOpen(true);
  };

  const handleSignupClick = () => {
    setModalMode('signup');
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleCheckAuth = () => {
    const status = checkAuthStatus();
    console.log('Current Auth Status:', status);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="auth-buttons-container">
      {!isAuthenticated() && (
        <div className="auth-buttons">
          <button 
            className="auth-button login-button"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button 
            className="auth-button signup-button"
            onClick={handleSignupClick}
          >
            Sign Up
          </button>
        </div>
      )}

      {isAuthenticated() && (
        <div className="auth-buttons">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleCheckAuth}>Check Auth Status</button>
        </div>
      )}

      {isModalOpen && (
        <AuthModal 
          isOpen={true} 
          onClose={closeModal} 
          initialMode={modalMode} 
        />
      )}
    </div>
  );
};

export default AuthButtons; 