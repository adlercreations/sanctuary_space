import axios from 'axios';
import { authService, API_BASE_URL } from './api';

// Create axios instance with default config
const forumApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle auth
forumApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
forumApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // Only redirect to login if this was an authenticated request
          if (originalRequest.requiresAuth) {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        });
        
        // If successful, update the token
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return forumApi(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login if this was an authenticated request
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (originalRequest.requiresAuth) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Get all forum threads with optional sorting
export const getThreads = async (sortBy = 'recent_activity') => {
  try {
    const response = await forumApi.get(`/community/forum/threads?sort_by=${sortBy}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw error;
  }
};

// Get a single thread with its comments and replies
export const getThread = async (threadId) => {
  try {
    const response = await forumApi.get(`/community/forum/threads/${threadId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching thread ${threadId}:`, error);
    throw error;
  }
};

// Create a new thread
export const createThread = async (title, content) => {
  try {
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    const response = await forumApi.post('/community/forum/threads', { title, content }, { requiresAuth: true });
    return response.data;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

// Add a comment to a thread
export const addComment = async (threadId, content) => {
  try {
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    const response = await forumApi.post(`/community/forum/threads/${threadId}/comments`, { content }, { requiresAuth: true });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Add a reply to a comment
export const addReply = async (commentId, content) => {
  try {
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    const response = await forumApi.post(`/community/forum/comments/${commentId}/replies`, { content }, { requiresAuth: true });
    return response.data;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};