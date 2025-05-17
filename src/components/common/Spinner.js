import React from 'react';

const Spinner = ({ message = 'Loading...' }) => {
  return (
    <div className="container-fluid py-4">
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">{message}</p>
      </div>
    </div>
  );
};

export default Spinner;