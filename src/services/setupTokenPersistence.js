// src/utils/setupTokenPersistence.js
const setupTokenPersistence = () => {
  // Save initial state
  let tokenState = {
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user'),
    appAuth: localStorage.getItem('app:auth')
  };
  
  // Function to restore tokens if they disappear
  const checkAndRestoreTokens = () => {
    const currentToken = localStorage.getItem('token');
    const currentUser = localStorage.getItem('user');
    const currentAppAuth = localStorage.getItem('app:auth');
    
    let restored = false;
    
    // If token disappeared but we had it before
    if (!currentToken && tokenState.token) {
      console.log('Token disappeared - restoring!');
      localStorage.setItem('token', tokenState.token);
      restored = true;
    }
    
    // If user disappeared but we had it before
    if (!currentUser && tokenState.user) {
      console.log('User disappeared - restoring!');
      localStorage.setItem('user', tokenState.user);
      restored = true;
    }
    
    // If app:auth disappeared but we had it before
    if (!currentAppAuth && tokenState.appAuth) {
      console.log('app:auth disappeared - restoring!');
      localStorage.setItem('app:auth', tokenState.appAuth);
      restored = true;
    }
    
    // If we had to restore anything, capture new state
    if (restored) {
      tokenState = {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        appAuth: localStorage.getItem('app:auth')
      };
      
      // Also ensure consistency across formats
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const appAuthStr = localStorage.getItem('app:auth');
      
      // If token exists but app:auth doesn't, create app:auth
      if (token && !appAuthStr && userStr) {
        try {
          const user = JSON.parse(userStr);
          localStorage.setItem('app:auth', JSON.stringify({ token, user }));
        } catch (e) {}
      }
      
      // If app:auth exists but token doesn't, extract token
      if (!token && appAuthStr) {
        try {
          const appAuth = JSON.parse(appAuthStr);
          if (appAuth.token) {
            localStorage.setItem('token', appAuth.token);
          }
        } catch (e) {}
      }
    }
  };
  
  // Run check immediately
  checkAndRestoreTokens();
  
  // Set up interval to check tokens frequently
  const intervalId = setInterval(checkAndRestoreTokens, 500);
  
  // Listen for storage events
  const handleStorageChange = (e) => {
    if (e.key === 'token' || e.key === 'user' || e.key === 'app:auth') {
      console.log(`Storage changed: ${e.key}`);
      checkAndRestoreTokens();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    window.removeEventListener('storage', handleStorageChange);
  };
};

export default setupTokenPersistence;