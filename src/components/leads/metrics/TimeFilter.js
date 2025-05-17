import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

const TimeFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <ButtonGroup size="sm" className="me-2">
      <Button 
        variant={activeFilter === 'today' ? 'primary' : 'outline-primary'}
        onClick={() => onFilterChange('today')}
      >
        Today
      </Button>
      <Button 
        variant={activeFilter === 'week' ? 'primary' : 'outline-primary'}
        onClick={() => onFilterChange('week')}
      >
        Week
      </Button>
      <Button 
        variant={activeFilter === 'month' ? 'primary' : 'outline-primary'}
        onClick={() => onFilterChange('month')}
      >
        Month
      </Button>
      <Button 
        variant={activeFilter === 'quarter' ? 'primary' : 'outline-primary'}
        onClick={() => onFilterChange('quarter')}
      >
        Quarter
      </Button>
    </ButtonGroup>
  );
};

export default TimeFilter;