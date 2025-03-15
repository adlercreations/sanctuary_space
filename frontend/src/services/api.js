// frontend/src/services/api.js
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          },
          withCredentials: true
        });
        
        // If successful, update the tokens
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token, user } = response.data;
      
      // Store tokens and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user };
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },
  
  signup: async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { username, email, password });
      const { access_token, refresh_token, user } = response.data;
      
      // Store tokens and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user };
    } catch (error) {
      throw error.response?.data || { error: 'Signup failed' };
    }
  },
  
  logout: async () => {
    try {
      // Try to call the logout endpoint if we have a token
      const token = localStorage.getItem('access_token');
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear all auth-related data from storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('explicitly_logged_in');
    }
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      const { user } = response.data;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user };
    } catch (error) {
      throw error.response?.data || { error: 'Profile update failed' };
    }
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.is_admin || false;
  }
};

// Admin services
export const adminService = {
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data.users;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  },

  blockUser: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/block`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to block user' };
    }
  },

  unblockUser: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/unblock`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to unblock user' };
    }
  },

  makeAdmin: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/make-admin`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to make user admin' };
    }
  },

  removeAdmin: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/remove-admin`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to remove admin privileges' };
    }
  },

  deleteThread: async (threadId) => {
    try {
      const response = await api.delete(`/admin/threads/${threadId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete thread' };
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/admin/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete comment' };
    }
  },

  deleteReply: async (replyId) => {
    try {
      const response = await api.delete(`/admin/replies/${replyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete reply' };
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data.stats;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch admin stats' };
    }
  }
};

// Generic API methods
export const apiService = {
  get: (endpoint) => api.get(endpoint).then(response => response.data),
  post: (endpoint, data) => api.post(endpoint, data).then(response => response.data),
  put: (endpoint, data) => api.put(endpoint, data).then(response => response.data),
  delete: (endpoint) => api.delete(endpoint).then(response => response.data),
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Export the api instance as default
export default api;