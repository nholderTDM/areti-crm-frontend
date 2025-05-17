import React from 'react';
import { ProgressBar, Badge } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const MetricsCard = ({ title, value, target, icon, variant, unit, trend, description }) => {
  // Calculate percentage of target reached
  const percentComplete = Math.min(100, Math.round((value / target) * 100));
  
  // Determine progress bar color
  const getProgressColor = () => {
    if (percentComplete >= 100) return 'success';
    if (percentComplete >= 75) return 'info';
    if (percentComplete >= 50) return 'warning';
    return 'danger';
  };
  
  return (
    <div className="border rounded p-3 mb-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <span className={`text-${variant} me-2`}>
            {icon}
          </span>
          <h6 className="mb-0">{title}</h6>
        </div>
      </div>
      
      <h3 className="mb-1">
        {value}{unit}
        {trend !== 0 && (
          <small className={`ms-2 ${trend > 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.6em' }}>
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(trend)}%
          </small>
        )}
      </h3>
      
      <div className="text-muted mb-2">
        Target: {target}{unit}
      </div>
      
      <ProgressBar 
        variant={getProgressColor()} 
        now={percentComplete} 
        max={100} 
      />
      
      <small className="text-muted d-block mt-2">
        {description}
      </small>
    </div>
  );
};

export default MetricsCard;