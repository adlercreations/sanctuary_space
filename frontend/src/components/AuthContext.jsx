import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Create the context
export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      // Only auto-login if not on the home page or if explicitly logged in
      const currentPath = location.pathname;
      const isHomePage = currentPath === '/home';
      const hasExplicitlyLoggedIn = sessionStorage.getItem('explicitly_logged_in') === 'true';
      
      if (!isHomePage || hasExplicitlyLoggedIn) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } else {
        // Clear any existing auth tokens if on home page and not explicitly logged in
        authService.logout();
      }
      
      setLoading(false);
    };

    initAuth();
  }, [location.pathname]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { user } = await authService.login(email, password);
      setUser(user);
      // Mark as explicitly logged in
      sessionStorage.setItem('explicitly_logged_in', 'true');
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      const { user } = await authService.signup(username, email, password);
      setUser(user);
      // Mark as explicitly logged in
      sessionStorage.setItem('explicitly_logged_in', 'true');
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.error || 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      // Clear explicit login flag
      sessionStorage.removeItem('explicitly_logged_in');
      navigate('/home');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const { user } = await authService.updateProfile(userData);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.error || 'Profile update failed' };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated();
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};