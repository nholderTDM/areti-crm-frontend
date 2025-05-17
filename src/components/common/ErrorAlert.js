import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ErrorAlert = ({ message, backUrl = -1 }) => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid py-4">
      <Alert variant="danger" className="mb-4">
        <Alert.Heading>Error</Alert.Heading>
        <p>{message}</p>
        <div className="d-flex justify-content-end">
          <Button 
            variant="outline-danger" 
            onClick={() => navigate(backUrl)}
          >
            Go Back
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default ErrorAlert;