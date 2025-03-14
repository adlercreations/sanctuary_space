import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';
import { authService } from '../services/api';

// Custom event to trigger login modal
export const triggerLoginModal = () => {
  const event = new CustomEvent('openLoginModal');
  window.dispatchEvent(event);
};

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, trigger the login modal and navigate back to home
    if (!loading && !isAuthenticated()) {
      triggerLoginModal();
      navigate('/home', { replace: true });
      return;
    }

    // If admin is required but user is not an admin, redirect to home
    if (requireAdmin && !authService.isAdmin()) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, requireAdmin]);

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Only render children if authenticated and admin check passes
  if (isAuthenticated() && (!requireAdmin || authService.isAdmin())) {
    return children;
  }

  // Return null while redirecting
  return null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool
};

export default ProtectedRoute; 