// src/components/common/PrivateRoute.js
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn, getStoredUser, ensureTokenConsistency } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = () => {
  const location = useLocation();
  const { currentUser, loading, checkAuthState } = useAuth();
  
  useEffect(() => {
    console.log("PrivateRoute mounted at path:", location.pathname);
    
    // Ensure tokens are consistent
    ensureTokenConsistency();
    
    // Check direct localStorage state (bypassing isLoggedIn for debugging)
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const appAuth = localStorage.getItem('app:auth');
    
    console.log("Raw localStorage state in PrivateRoute:");
    console.log("token exists:", !!token);
    console.log("user exists:", !!user);
    console.log("app:auth exists:", !!appAuth);
    
    // Always check auth state when route changes
    checkAuthState();
    
    console.log("Auth state:", { 
      currentUser: !!currentUser, 
      loading, 
      storedUser: !!getStoredUser(),
      token: !!localStorage.getItem('token'),
      appAuth: !!localStorage.getItem('app:auth'),
      isLoggedIn: isLoggedIn()
    });
  }, [location.pathname, checkAuthState, currentUser, loading]);

  // Show loading indicator while checking auth
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  // Use a more robust auth check
  const authenticated = isLoggedIn() || !!currentUser || !!getStoredUser();
  
  if (authenticated) {
    console.log("PrivateRoute: User authenticated, rendering route");
    return <Outlet />;
  }

  // Otherwise, redirect to login
  console.log("PrivateRoute: No authentication, redirecting to login");
  return <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;