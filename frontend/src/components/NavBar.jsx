// frontend/src/components/NavBar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';
import '../styles/NavBar.css'; // optional CSS file for styling

function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const { isAuthenticated, user, logout } = useAuth();

  // Add this function to check admin status
  const isAdmin = () => {
    console.log('Current user in NavBar:', user);
    console.log('Is admin?', user?.is_admin);
    return user?.is_admin || false;
  };

  // Listen for custom event to open login modal
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setModalMode('login');
      setIsModalOpen(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal);
    };
  }, []);

  const handleLogout = async () => {
    console.log('Logging out');
    await logout();
    window.location.reload();
  };

  const handleLoginClick = () => {
    console.log('Login button clicked');
    setModalMode('login');
    setIsModalOpen(true);
  };

  const handleSignupClick = () => {
    console.log('Signup button clicked');
    setModalMode('signup');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  const handleCartClick = (e) => {
    // If user is not authenticated, prevent navigation and show login modal
    if (!isAuthenticated()) {
      e.preventDefault();
      setModalMode('login');
      setIsModalOpen(true);
    }
  };

  console.log('Current user:', user);
  console.log('Is admin?', isAdmin());

  return (
    <nav className="navbar">
      {/* Logo or brand name on the left */}
      <div className="navbar-logo">
        <Link to="/home" className="navbar-brand">Sanctuary Space</Link>
      </div>

      {/* Navigation links */}
      <ul className="navbar-links">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/community">Community</Link>
        </li>
        <li>
          <Link to="/cart" onClick={handleCartClick}>Cart</Link>
        </li>
        {/* Add the admin link */}
        {isAdmin() && (
          <li>
            <Link to="/admin" className="admin-link">Admin</Link>
          </li>
        )}
      </ul>

      {/* Auth section with username and logout button or login/signup buttons */}
      {isAuthenticated() ? (
        <div className="navbar-auth">
          <span className="username">{user?.username || 'User'}</span>
          <button 
            className="auth-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="navbar-auth">
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

      {isModalOpen && (
        <AuthModal 
          isOpen={true} 
          onClose={closeModal} 
          initialMode={modalMode} 
        />
      )}
    </nav>
  );
}

export default NavBar;