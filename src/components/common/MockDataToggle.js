// src/components/common/MockDataToggle.js
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { getUseMockDataPreference, setUseMockDataPreference } from '../../services/mockDataService';

/**
 * A toggle component for switching between mock and real data
 * Can be placed in the navbar, settings page, or anywhere else
 */
const MockDataToggle = () => {
  const [useMockData, setUseMockData] = useState(false);
  
  // Initialize from stored preference
  useEffect(() => {
    setUseMockData(getUseMockDataPreference());
  }, []);
  
  // Handle toggle change
  const handleToggleChange = (e) => {
    const newValue = e.target.checked;
    setUseMockData(newValue);
    setUseMockDataPreference(newValue);
    
    // Optional: Reload the page to ensure all components use the new setting
    // Alternatively, you could use a context to propagate this change
    window.location.reload();
  };
  
  // Only show in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <Form className="d-flex align-items-center">
      <Form.Check 
        type="switch"
        id="mock-data-toggle"
        label="Use Mock Data"
        checked={useMockData}
        onChange={handleToggleChange}
        className="text-dark" // Changed from text-light to text-dark
      />
    </Form>
  );
};

export default MockDataToggle;