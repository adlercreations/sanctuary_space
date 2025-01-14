// frontend/src/services/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

// For GET requests
export async function getRequest(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

// For POST, with an optional body
export async function postRequest(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // If you want to include cookies for Flask-Login
    body: JSON.stringify(data)
  });
  return response.json();
}

// ... etc. you can add PUT, DELETE, etc. as needed