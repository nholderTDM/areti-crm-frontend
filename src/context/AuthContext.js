import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getStoredUser, isLoggedIn, getCurrentUser, logout } from '../services/authService';

// Create the context
const AuthContext = createContext();

// Create a custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  // Use a ref to prevent multiple auth check loops
  const isCheckingAuth = useRef(false);
  
  // Function to check and update auth state
  // Fixed version of checkAuthState in AuthContext.js
const checkAuthState = useCallback(async () => {
  // Prevent multiple simultaneous auth checks
  if (isCheckingAuth.current) {
    console.log("Auth check already in progress, skipping");
    return;
  }
  
  isCheckingAuth.current = true;
  console.log("AuthContext: Checking auth state...");
  
  try {
    // First check if token exists at all
    const token = localStorage.getItem('token');
    const authData = localStorage.getItem('app:auth');
    
    if (!token && !authData) {
      console.log("No auth tokens found - not logged in");
      setCurrentUser(null);
      setLoading(false);
      isCheckingAuth.current = false;
      return;
    }
    
    // Ensure token consistency between storage mechanisms
    ensureTokenConsistency();
    
    // Get user from storage first
    const storedUser = getStoredUser();
    if (storedUser) {
      console.log("Using stored user data");
      setCurrentUser(storedUser);
    }
    
    // Only try the API if we haven't had a previous auth error
    if (!authError) {
      try {
        console.log("Fetching current user from API...");
        const { data } = await getCurrentUser();
        
        if (data) {
          console.log("Successfully retrieved user data from API");
          setCurrentUser(data);
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(data));
          
          // Also update app:auth if it exists
          if (authData) {
            try {
              const parsedAuth = JSON.parse(authData);
              parsedAuth.user = data;
              localStorage.setItem('app:auth', JSON.stringify(parsedAuth));
            } catch (e) {
              console.error("Error updating app:auth", e);
            }
          }
          
          setAuthError(false);
        }
      } catch (error) {
        console.error('Failed to get updated user data:', error);
        
        // If it's a 401 error but we have a stored user, don't logout
        if (error.response && error.response.status === 401) {
          console.log("API returned 401 - using stored user if available");
          
          // Important: Don't clear auth if we have a stored user,
          // this prevents logout when API is unavailable temporarily
          if (storedUser) {
            console.log("Using locally stored user data instead of API");
            setAuthError(true); // Set flag to prevent further API calls
          } else {
            console.log("No stored user - clearing auth data");
            setCurrentUser(null);
          }
        }
      }
    } else {
      console.log("Previous auth error - using stored user without API call");
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
  } finally {
    setLoading(false);
    isCheckingAuth.current = false;
  }
}, [authError]);

// Helper function to ensure token consistency across storage mechanisms
const ensureTokenConsistency = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const appAuthStr = localStorage.getItem('app:auth');
    
    // If we have a token but no app:auth, create app:auth
    if (token && !appAuthStr && userStr) {
      try {
        const user = JSON.parse(userStr);
        localStorage.setItem('app:auth', JSON.stringify({ token, user }));
        console.log('Created app:auth from token and user');
      } catch (e) {
        console.error('Error creating app:auth:', e);
      }
    }
    
    // If we have app:auth but no token, extract token from app:auth
    if (!token && appAuthStr) {
      try {
        const appAuth = JSON.parse(appAuthStr);
        if (appAuth.token) {
          localStorage.setItem('token', appAuth.token);
          console.log('Extracted token from app:auth');
        }
      } catch (e) {
        console.error('Error extracting token from app:auth:', e);
      }
    }
    
    // If we have app:auth but no user, extract user from app:auth
    if (!userStr && appAuthStr) {
      try {
        const appAuth = JSON.parse(appAuthStr);
        if (appAuth.user) {
          localStorage.setItem('user', JSON.stringify(appAuth.user));
          console.log('Extracted user from app:auth');
        }
      } catch (e) {
        console.error('Error extracting user from app:auth:', e);
      }
    }
  } catch (error) {
    console.error('Error in ensureTokenConsistency:', error);
  }
};

  // Handle logout
  const handleLogout = async (redirectToLogin = true) => {
    console.log("Logging out user");
    
    try {
      // Clear all auth data from storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('app:auth');
      
      // Reset state
      setCurrentUser(null);
      setAuthError(false);
      
      // Only try to call logout API if we want to redirect (i.e., manual logout)
      if (redirectToLogin) {
        try {
          await logout();
        } catch (err) {
          console.warn('Logout API call failed, but storage was cleared');
        }
        
        // Redirect to login page
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Load user on initial render
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);
  
  // Update the user in context
  const updateUser = useCallback((user) => {
    setCurrentUser(user);
    if (user) {
      setAuthError(false); // Reset auth error when user is updated
    }
  }, []);
  
  // Value to be provided by the context
  const value = {
    currentUser,
    updateUser,
    logout: () => handleLogout(true),
    isAuthenticated: !!currentUser,
    loading,
    checkAuthState
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };