import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ label = 'Back', variant = 'outline-secondary', className = 'mb-3' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    // If there's a state with a 'from' property, use that for precise navigation
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      // Otherwise, go back in browser history
      navigate(-1);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      className={className} 
      onClick={handleBack}
      size="sm"
    >
      <FaArrowLeft className="me-1" /> {label}
    </Button>
  );
};

export default BackButton;