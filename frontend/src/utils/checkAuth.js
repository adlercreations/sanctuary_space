// Simple utility to check authentication status
export const checkAuthStatus = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const user = localStorage.getItem('user');
  
  console.log('Auth Status:');
  console.log('Access Token:', accessToken ? 'Present' : 'Missing');
  console.log('Refresh Token:', refreshToken ? 'Present' : 'Missing');
  console.log('User Data:', user ? JSON.parse(user) : 'Missing');
  
  return {
    isAuthenticated: !!accessToken,
    hasRefreshToken: !!refreshToken,
    user: user ? JSON.parse(user) : null
  };
};
