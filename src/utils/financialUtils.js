// src/utils/financialUtils.js

// Format currency for display
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate variance amount
  export const calculateVariance = (budget, actual) => {
    return actual - budget;
  };
  
  // Calculate variance percentage
  export const calculateVariancePercentage = (budget, actual) => {
    if (budget === 0) return 0;
    return ((actual - budget) / budget) * 100;
  };
  
  // Get progress bar variant based on variance
  export const getProgressBarVariant = (type, percentage) => {
    if (type === 'revenue') {
      return percentage >= 0 ? 'success' : 'danger';
    } else {
      return percentage <= 0 ? 'success' : 'danger';
    }
  };
  
  // Calculate trend (average month-over-month change)
  export const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    
    let sum = 0;
    for (let i = 1; i < data.length; i++) {
      sum += (data[i] - data[i-1]);
    }
    
    return sum / (data.length - 1);
  };
  
  // Format date
  export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };