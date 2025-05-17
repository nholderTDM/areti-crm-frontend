// src/utils/tokenRestore.js
export const restoreTokens = () => {
    console.log('Attempting to restore tokens...');
    
    // Try to restore token from app:auth
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const appAuthStr = localStorage.getItem('app:auth');
    
    // If token is missing but we have app:auth
    if (!token && appAuthStr) {
      try {
        const appAuth = JSON.parse(appAuthStr);
        if (appAuth.token) {
          localStorage.setItem('token', appAuth.token);
          console.log('Restored token from app:auth');
        }
      } catch (e) {
        console.error('Failed to parse app:auth', e);
      }
    }
    
    // If user is missing but we have app:auth
    if (!userStr && appAuthStr) {
      try {
        const appAuth = JSON.parse(appAuthStr);
        if (appAuth.user) {
          localStorage.setItem('user', JSON.stringify(appAuth.user));
          console.log('Restored user from app:auth');
        }
      } catch (e) {
        console.error('Failed to parse app:auth for user', e);
      }
    }
    
    // If app:auth is missing but we have token and user
    if (!appAuthStr && token && userStr) {
      try {
        const user = JSON.parse(userStr);
        localStorage.setItem('app:auth', JSON.stringify({ token, user }));
        console.log('Created app:auth from token and user');
      } catch (e) {
        console.error('Failed to create app:auth', e);
      }
    }
    
    return {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      appAuth: localStorage.getItem('app:auth')
    };
  };
  
  // Add this to Dashboard.js navigation check
  export const ensureSessionActive = () => {
    const { token, user, appAuth } = restoreTokens();
    
    // Consider authenticated if ANY token is present
    return !!(token || appAuth);
  };