// src/context/NavigationContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [recentPages, setRecentPages] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Update history when location changes
  useEffect(() => {
    // Don't add duplicate consecutive entries
    if (history.length === 0 || history[history.length - 1] !== location.pathname) {
      setHistory(prev => [...prev, location.pathname]);
      
      // Keep track of the most recent unique pages (up to 10)
      setRecentPages(prev => {
        const filtered = prev.filter(item => item.path !== location.pathname);
        const pathParts = location.pathname.split('/').filter(Boolean);
        
        // Create a friendly name for the page
        let pageName;
        if (pathParts.length === 0) {
          pageName = 'Dashboard';
        } else if (pathParts[pathParts.length - 1] === 'new') {
          pageName = `New ${pathParts[pathParts.length - 2].charAt(0).toUpperCase() + pathParts[pathParts.length - 2].slice(1, -1)}`;
        } else if (pathParts[pathParts.length - 1] === 'edit') {
          pageName = `Edit ${pathParts[pathParts.length - 2].charAt(0).toUpperCase() + pathParts[pathParts.length - 2].slice(1, -1)}`;
        } else if (pathParts[0] === 'lead-generator') {
          pageName = 'Lead Generator';
        } else {
          pageName = pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);
        }
            
        const newEntry = {
          path: location.pathname,
          name: pageName,
          timestamp: new Date()
        };
        
        return [newEntry, ...filtered].slice(0, 10);
      });
    }
  }, [location, history]);
  
  // Function to go back to previous page in history
  const goBack = () => {
    if (history.length > 1) {
      const target = history[history.length - 2];
      navigate(target);
      setHistory(prev => prev.slice(0, -1));
    } else {
      navigate('/dashboard');
    }
  };
  
  // Function to navigate to a specific recent page
  const goToRecentPage = (path) => {
    navigate(path);
  };
  
  return (
    <NavigationContext.Provider value={{ history, recentPages, goBack, goToRecentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;