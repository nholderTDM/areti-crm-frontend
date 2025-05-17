import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, ProgressBar, Dropdown, InputGroup, Alert, Modal } from 'react-bootstrap';
import { 
  FaPlus, FaTrash, FaPencilAlt, FaSave, FaTimes, FaChartBar, 
  FaArrowUp, FaArrowDown, FaExclamationTriangle, FaCheck, 
  FaChartLine, FaHandHoldingUsd, FaCalendarAlt, FaExchangeAlt,
  FaGripVertical
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddBudgetModal from './AddBudgetModal';
import PageTitle from '../common/PageTitle';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Item Types
const ItemTypes = {
  BUDGET_ITEM: 'budgetItem'
};

// Draggable BudgetItem component
const BudgetItem = ({ item, index, type, handleEditBudget, handleDeleteBudget, moveItem }) => {
  const ref = useRef(null);
  
  // Calculate variance
  const calculateVariance = (budget, actual) => {
    return actual - budget;
  };

  // Calculate variance percentage
  const calculateVariancePercentage = (budget, actual) => {
    if (budget === 0) return 0;
    return ((actual - budget) / budget) * 100;
  };

  // Get progress bar variant based on variance
  const getProgressBarVariant = (type, percentage) => {
    if (type === 'revenue') {
      return percentage >= 0 ? 'success' : 'danger';
    } else {
      return percentage <= 0 ? 'success' : 'danger';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.BUDGET_ITEM,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragType = item.type;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragType === type) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex, dragType, type);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.type = type;
    },
  });
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BUDGET_ITEM,
    item: () => {
      return { id: item.id, index, type };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (index > 0) {
          e.preventDefault();
          moveItem(index, index - 1, type, type);
        }
        break;
      case 'ArrowDown':
        // We don't know the total length here, but moveItem will handle boundaries
        e.preventDefault();
        moveItem(index, index + 1, type, type);
        break;
      case 'Home':
        if (index > 0) {
          e.preventDefault();
          moveItem(index, 0, type, type);
        }
        break;
      case 'End':
        e.preventDefault();
        // Move to end - we're using a large number as a proxy
        moveItem(index, 999, type, type);
        break;
      default:
        break;
    }
  };
  
  drag(drop(ref));
  
  return (
    <tr
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? '#f8f9fa' : 'inherit',
      }}
      data-handler-id={handlerId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="Draggable item"
      aria-label={`${item.category} budget item, press space to start dragging, arrow keys to reorder`}
    >
      <td style={{ width: '30px', cursor: 'move' }}>
        <FaGripVertical className="text-muted" aria-hidden="true" />
      </td>
      <td>{item.category}</td>
      <td className="text-end">{formatCurrency(item.budgetAmount)}</td>
      <td className="text-end">{formatCurrency(item.actualAmount)}</td>
      <td className="text-end">
        <span className={calculateVariance(item.budgetAmount, item.actualAmount) <= 0 ? 'text-success' : 'text-danger'}>
          {calculateVariance(item.budgetAmount, item.actualAmount) <= 0 ? '' : '+'}
          {formatCurrency(calculateVariance(item.budgetAmount, item.actualAmount))}
        </span>
        <br />
        <small className={calculateVariancePercentage(item.budgetAmount, item.actualAmount) <= 0 ? 'text-success' : 'text-danger'}>
          ({calculateVariancePercentage(item.budgetAmount, item.actualAmount) <= 0 ? '' : '+'}
          {calculateVariancePercentage(item.budgetAmount, item.actualAmount).toFixed(1)}%)
        </small>
      </td>
      <td>
        <ProgressBar
          now={Math.min((item.actualAmount / item.budgetAmount) * 100, 100)}
          variant={getProgressBarVariant(item.type, calculateVariancePercentage(item.budgetAmount, item.actualAmount))}
          label={`${Math.min((item.actualAmount / item.budgetAmount) * 100, 100).toFixed(0)}%`}
        />
      </td>
      <td>{item.notes}</td>
      <td>
        <Button 
          variant="outline-primary" 
          size="sm" 
          className="me-1" 
          onClick={() => handleEditBudget(item)}
          aria-label={`Edit ${item.category}`}
        >
          <FaPencilAlt aria-hidden="true" />
        </Button>
        <Button 
          variant="outline-danger" 
          size="sm" 
          onClick={() => handleDeleteBudget(item.id)}
          aria-label={`Delete ${item.category}`}
        >
          <FaTrash aria-hidden="true" />
        </Button>
      </td>
    </tr>
  );
};

// Edit Budget Modal Component
const EditBudgetModal = ({ show, budget, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    id: 0,
    category: '',
    type: '',
    budgetAmount: '',
    actualAmount: '',
    notes: ''
  });

  // Initialize form data when modal opens or budget changes
  useEffect(() => {
    if (budget) {
      setFormData({
        id: budget.id,
        category: budget.category,
        type: budget.type,
        budgetAmount: budget.budgetAmount.toString(),
        actualAmount: budget.actualAmount.toString(),
        notes: budget.notes || ''
      });
    }
  }, [budget]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.budgetAmount || !formData.actualAmount) {
      alert('Please fill in all required fields');
      return;
    }
    
    const updatedBudget = {
      ...formData,
      budgetAmount: parseFloat(formData.budgetAmount),
      actualAmount: parseFloat(formData.actualAmount)
    };
    
    handleSave(updatedBudget);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Budget Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.category}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Budget Amount</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="budgetAmount"
                    value={formData.budgetAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Actual Amount</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="actualAmount"
                    value={formData.actualAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Optional notes"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const BudgetPlanner = () => {
  const [budgets, setBudgets] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('budget');
  const [forecastMonths, setForecastMonths] = useState(6);
  const [forecastData, setForecastData] = useState({
    revenue: [],
    expense: [],
    net: []
  });
  
  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Budget categories
  const budgetCategories = {
    revenue: ['Delivery Fees', 'Setup Fees', 'Subscriptions', 'Other Income'],
    expense: ['Vehicle Maintenance', 'Fuel', 'Insurance', 'Rent', 'Payroll', 'Office Expenses', 'Utilities', 'Marketing', 'Other Expenses']
  };

  // Load budget data
  useEffect(() => {
    setIsLoading(true);
    
    // In a real app, this would be an API call with the selected month and year
    setTimeout(() => {
      const mockBudgets = [
        {
          id: 1,
          category: 'Delivery Fees',
          type: 'revenue',
          budgetAmount: 90000,
          actualAmount: 85000,
          notes: 'Based on projected contract volume',
          historicalData: [75000, 78000, 82000, 88000, 90000, 85000]
        },
        {
          id: 2,
          category: 'Subscriptions',
          type: 'revenue',
          budgetAmount: 35000,
          actualAmount: 38000,
          notes: 'Monthly subscription revenue',
          historicalData: [30000, 32000, 33000, 34000, 35000, 38000]
        },
        {
          id: 3,
          category: 'Setup Fees',
          type: 'revenue',
          budgetAmount: 15000,
          actualAmount: 12000,
          notes: 'New client onboarding fees',
          historicalData: [10000, 12000, 14000, 15000, 13000, 12000]
        },
        {
          id: 4,
          category: 'Payroll',
          type: 'expense',
          budgetAmount: 40000,
          actualAmount: 42000,
          notes: 'Staff salaries and benefits',
          historicalData: [38000, 39000, 39500, 40000, 41000, 42000]
        },
        {
          id: 5,
          category: 'Fuel',
          type: 'expense',
          budgetAmount: 15000,
          actualAmount: 16500,
          notes: 'Fleet fuel costs',
          historicalData: [13000, 14000, 14500, 15000, 16000, 16500]
        },
        {
          id: 6,
          category: 'Vehicle Maintenance',
          type: 'expense',
          budgetAmount: 8000,
          actualAmount: 7200,
          notes: 'Regular vehicle maintenance and repairs',
          historicalData: [7500, 7800, 8000, 7800, 7500, 7200]
        },
        {
          id: 7,
          category: 'Rent',
          type: 'expense',
          budgetAmount: 10000,
          actualAmount: 10000,
          notes: 'Office and warehouse space',
          historicalData: [10000, 10000, 10000, 10000, 10000, 10000]
        },
        {
          id: 8,
          category: 'Utilities',
          type: 'expense',
          budgetAmount: 3000,
          actualAmount: 2800,
          notes: 'Electricity, water, internet, etc.',
          historicalData: [2900, 3100, 3000, 2900, 2850, 2800]
        },
        {
          id: 9,
          category: 'Insurance',
          type: 'expense',
          budgetAmount: 5000,
          actualAmount: 5000,
          notes: 'Vehicle and business insurance',
          historicalData: [5000, 5000, 5000, 5000, 5000, 5000]
        },
        {
          id: 10,
          category: 'Marketing',
          type: 'expense',
          budgetAmount: 7500,
          actualAmount: 8200,
          notes: 'Digital marketing and advertising',
          historicalData: [6500, 7000, 7200, 7500, 8000, 8200]
        }
      ];
      
      setBudgets(mockBudgets);
      generateForecastData(mockBudgets, forecastMonths);
      setIsLoading(false);
    }, 1000);
  }, [currentMonth, currentYear, forecastMonths]);

  // Generate forecast data based on historical trends with a hybrid approach
  const generateForecastData = (budgetData, months) => {
    // Group by type
    const revenueItems = budgetData.filter(item => item.type === 'revenue');
    const expenseItems = budgetData.filter(item => item.type === 'expense');
    
    // Get historical totals
    const historicalRevenue = [];
    const historicalExpense = [];
    
    // Last 6 months
    for (let i = 0; i < 6; i++) {
      const revenueTotal = revenueItems.reduce((sum, item) => sum + (item.historicalData && item.historicalData[i] ? item.historicalData[i] : 0), 0);
      const expenseTotal = expenseItems.reduce((sum, item) => sum + (item.historicalData && item.historicalData[i] ? item.historicalData[i] : 0), 0);
      
      historicalRevenue.push(revenueTotal);
      historicalExpense.push(expenseTotal);
    }
    
    // Calculate trends (with weighted linear regression)
    const calculateWeightedTrend = (historicalData) => {
      const weights = [0.1, 0.15, 0.2, 0.25, 0.3, 0.5]; // More recent months have higher weights
      let weightedSum = 0;
      let totalWeight = 0;
      
      for (let i = 0; i < historicalData.length - 1; i++) {
        const monthlyChange = historicalData[i+1] - historicalData[i];
        weightedSum += monthlyChange * weights[i];
        totalWeight += weights[i];
      }
      
      // Average monthly change with weights
      return weightedSum / totalWeight;
    };
    
    // Weighted average of recent months
    const calculateRecentAverage = (data) => {
      const weights = [0.1, 0.15, 0.2, 0.25, 0.3, 1.0]; // Last month has highest weight
      let weightedSum = 0;
      let totalWeight = 0;
      
      for (let i = 0; i < data.length; i++) {
        weightedSum += data[i] * weights[i];
        totalWeight += weights[i];
      }
      
      return weightedSum / totalWeight;
    };
    
    // Calculate seasonality (simple approach)
    const calculateSeasonality = (data) => {
      if (data.length < 4) return 1; // Not enough data
      
      // Compare last month to previous months
      const lastMonth = data[data.length - 1];
      const previousMonthsAvg = data.slice(0, data.length - 1).reduce((sum, val) => sum + val, 0) / (data.length - 1);
      
      return lastMonth / previousMonthsAvg;
    };
    
    const revenueTrend = calculateWeightedTrend(historicalRevenue);
    const expenseTrend = calculateWeightedTrend(historicalExpense);
    
    const revenueSeasonality = calculateSeasonality(historicalRevenue);
    const expenseSeasonality = calculateSeasonality(historicalExpense);
    
    // Project forward with the hybrid approach
    const forecastRevenue = [];
    const forecastExpense = [];
    const forecastNet = [];
    
    // Include current month (last month's actual)
    forecastRevenue.push(historicalRevenue[5]);
    forecastExpense.push(historicalExpense[5]);
    forecastNet.push(historicalRevenue[5] - historicalExpense[5]);
    
    // Project future months
    for (let i = 1; i <= months; i++) {
      // Combine trend projection with weighted average of recent performance
      const recentRevenueAvg = calculateRecentAverage(historicalRevenue);
      const recentExpenseAvg = calculateRecentAverage(historicalExpense);
      
      const trendWeight = 0.6;
      const avgWeight = 0.3;
      const seasonalWeight = 0.1;
      
      // Hybrid projection
      const projectedRevenue = 
        (trendWeight * (historicalRevenue[5] + (revenueTrend * i))) + 
        (avgWeight * recentRevenueAvg) + 
        (seasonalWeight * recentRevenueAvg * revenueSeasonality);
      
      const projectedExpense = 
        (trendWeight * (historicalExpense[5] + (expenseTrend * i))) + 
        (avgWeight * recentExpenseAvg) + 
        (seasonalWeight * recentExpenseAvg * expenseSeasonality);
      
      const projectedNet = projectedRevenue - projectedExpense;
      
      forecastRevenue.push(Math.round(projectedRevenue));
      forecastExpense.push(Math.round(projectedExpense));
      forecastNet.push(Math.round(projectedNet));
    }
    
    setForecastData({
      revenue: forecastRevenue,
      expense: forecastExpense,
      net: forecastNet
    });
  };

  // Calculate trend (average month-over-month change)
  const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    
    let sum = 0;
    for (let i = 1; i < data.length; i++) {
      sum += (data[i] - data[i-1]);
    }
    
    return sum / (data.length - 1);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate variance amount
  const calculateVariance = (budget, actual) => {
    return actual - budget;
  };

  // Calculate variance percentage
  const calculateVariancePercentage = (budget, actual) => {
    if (budget === 0) return 0;
    return ((actual - budget) / budget) * 100;
  };

  // Get progress bar variant based on variance
  const getProgressBarVariant = (type, percentage) => {
    if (type === 'revenue') {
      return percentage >= 0 ? 'success' : 'danger';
    } else {
      return percentage <= 0 ? 'success' : 'danger';
    }
  };

  // Calculate budget totals
  const calculateTotals = () => {
    const totals = {
      revenue: {
        budget: 0,
        actual: 0
      },
      expense: {
        budget: 0,
        actual: 0
      }
    };
    
    budgets.forEach(budget => {
      totals[budget.type].budget += budget.budgetAmount;
      totals[budget.type].actual += budget.actualAmount;
    });
    
    return totals;
  };

  // Enhanced variance analysis
  const calculateVarianceAnalysis = () => {
    const analysis = {
      revenue: {
        favorable: 0,
        unfavorable: 0,
        neutral: 0,
        items: []
      },
      expense: {
        favorable: 0,
        unfavorable: 0,
        neutral: 0,
        items: []
      },
      largestFavorable: null,
      largestUnfavorable: null
    };
    
    budgets.forEach(budget => {
      const variance = calculateVariance(budget.budgetAmount, budget.actualAmount);
      const variancePercentage = calculateVariancePercentage(budget.budgetAmount, budget.actualAmount);
      const isFavorable = (budget.type === 'revenue' && variance >= 0) || 
                          (budget.type === 'expense' && variance <= 0);
      const isNeutral = Math.abs(variancePercentage) < 1;
      
      // Add item to the appropriate list
      const analysisItem = {
        ...budget,
        variance,
        variancePercentage,
        isFavorable
      };
      
      analysis[budget.type].items.push(analysisItem);
      
      if (isNeutral) {
        analysis[budget.type].neutral++;
      } else if (isFavorable) {
        analysis[budget.type].favorable++;
        
        // Check if this is the largest favorable variance
        if (!analysis.largestFavorable || 
            (Math.abs(variance) > Math.abs(calculateVariance(analysis.largestFavorable.budgetAmount, analysis.largestFavorable.actualAmount)))) {
          analysis.largestFavorable = budget;
        }
      } else {
        analysis[budget.type].unfavorable++;
        
        // Check if this is the largest unfavorable variance
        if (!analysis.largestUnfavorable || 
            (Math.abs(variance) > Math.abs(calculateVariance(analysis.largestUnfavorable.budgetAmount, analysis.largestUnfavorable.actualAmount)))) {
          analysis.largestUnfavorable = budget;
        }
      }
    });
    
    // Sort items by variance amount (absolute value) for each type
    analysis.revenue.items.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
    analysis.expense.items.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
    
    return analysis;
  };

  // Handle month change
  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  // Handle year change
  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  // Handle edit budget
  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setShowEditModal(true);
  };

  // Handle save edited budget
  const handleSaveEdit = (updatedBudget) => {
    const updatedBudgets = budgets.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    );
    
    setBudgets(updatedBudgets);
    setShowEditModal(false);
    setEditingBudget(null);
    
    // Update forecasting data
    generateForecastData(updatedBudgets, forecastMonths);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingBudget(null);
  };

  // Handle delete budget
  const handleDeleteBudget = (id) => {
    if (window.confirm('Are you sure you want to delete this budget item?')) {
      const updatedBudgets = budgets.filter(budget => budget.id !== id);
      setBudgets(updatedBudgets);
      
      // Update forecasting data
      generateForecastData(updatedBudgets, forecastMonths);
    }
  };

  // Handle showing add modal
  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  // Handle closing add modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  // Handle saving new budget item
  const handleSaveNewBudget = (newItem) => {
    const newBudgetItem = {
      ...newItem,
      id: Math.max(...budgets.map(b => b.id), 0) + 1
    };
    
    const updatedBudgets = [...budgets, newBudgetItem];
    setBudgets(updatedBudgets);
    
    // Update forecasting data
    generateForecastData(updatedBudgets, forecastMonths);
  };

  // Updated moveItem function that better handles the drag and drop
  const moveItem = useCallback((fromIndex, toIndex, fromType, toType) => {
    // Make a copy of the current budgets
    const updatedBudgets = [...budgets];
    
    // Get revenue and expense items separately
    const revenueItems = updatedBudgets.filter(item => item.type === 'revenue');
    const expenseItems = updatedBudgets.filter(item => item.type === 'expense');
    
    // Handle moving within the same type
    if (fromType === toType) {
      const items = fromType === 'revenue' ? [...revenueItems] : [...expenseItems];
      
      // Don't attempt to move beyond array boundaries
      if (toIndex < 0 || toIndex >= items.length) {
        return;
      }
      
      // Remove the item from its original position
      const [movedItem] = items.splice(fromIndex, 1);
      
      // Insert it at the new position
      items.splice(toIndex, 0, movedItem);
      
      // Update the budgets array with the reordered items
      if (fromType === 'revenue') {
        setBudgets([...items, ...expenseItems]);
      } else {
        setBudgets([...revenueItems, ...items]);
      }
    }
    // We only want to support moving within the same category type for now
    // This else block can be removed or commented out if we don't want to allow moving between types
    /*
    else {
      // Handle moving between types (if you want to allow this)
      // Implementation left out for now
      console.log("Moving between types not implemented");
    }
    */
  }, [budgets]);

  // Render function for budget tables with keyboard navigation
  const renderBudgetTable = () => {
    const revenueItems = budgets.filter(item => item.type === 'revenue');
    const expenseItems = budgets.filter(item => item.type === 'expense');
    
    return (
      <>
        <div role="region" aria-label="Revenue budget items">
          <h5 className="mb-3" id="revenue-table-heading">Revenue</h5>
          <Table hover className="mb-4" aria-labelledby="revenue-table-heading">
            <thead>
              <tr>
                <th style={{ width: '30px' }} aria-hidden="true"></th>
                <th scope="col">Category</th>
                <th scope="col" className="text-end">Budget</th>
                <th scope="col" className="text-end">Actual</th>
                <th scope="col" className="text-end">Variance</th>
                <th scope="col">Progress</th>
                <th scope="col">Notes</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {revenueItems.map((item, index) => (
                <BudgetItem
                  key={item.id}
                  item={item}
                  index={index}
                  type="revenue"
                  handleEditBudget={handleEditBudget}
                  handleDeleteBudget={handleDeleteBudget}
                  moveItem={moveItem}
                />
              ))}
            </tbody>
          </Table>
        </div>
        
        <div role="region" aria-label="Expense budget items">
          <h5 className="mb-3" id="expense-table-heading">Expenses</h5>
          <Table hover className="mb-4" aria-labelledby="expense-table-heading">
            <thead>
              <tr>
                <th style={{ width: '30px' }} aria-hidden="true"></th>
                <th scope="col">Category</th>
                <th scope="col" className="text-end">Budget</th>
                <th scope="col" className="text-end">Actual</th>
                <th scope="col" className="text-end">Variance</th>
                <th scope="col">Progress</th>
                <th scope="col">Notes</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseItems.map((item, index) => (
                <BudgetItem
                  key={item.id}
                  item={item}
                  index={index}
                  type="expense"
                  handleEditBudget={handleEditBudget}
                  handleDeleteBudget={handleDeleteBudget}
                  moveItem={moveItem}
                />
              ))}
            </tbody>
          </Table>
        </div>
      </>
    );
  };

  // Calculate budget summary
  const budgetTotals = calculateTotals();
  const netBudget = budgetTotals.revenue.budget - budgetTotals.expense.budget;
  const netActual = budgetTotals.revenue.actual - budgetTotals.expense.actual;
  const netVariance = netActual - netBudget;
  const netVariancePercentage = netBudget !== 0 ? (netVariance / netBudget) * 100 : 0;

  // Prepare data for variance analysis chart
  const varianceAnalysis = calculateVarianceAnalysis();
  
  const varianceChartData = {
    labels: ['Revenue', 'Expenses'],
    datasets: [
      {
        label: 'Favorable',
        data: [varianceAnalysis.revenue.favorable, varianceAnalysis.expense.favorable],
        backgroundColor: 'rgba(40, 167, 69, 0.6)',
      },
      {
        label: 'Neutral',
        data: [varianceAnalysis.revenue.neutral, varianceAnalysis.expense.neutral],
        backgroundColor: 'rgba(108, 117, 125, 0.6)',
      },
      {
        label: 'Unfavorable',
        data: [varianceAnalysis.revenue.unfavorable, varianceAnalysis.expense.unfavorable],
        backgroundColor: 'rgba(220, 53, 69, 0.6)',
      },
    ],
  };

  // Prepare data for variance distribution pie chart
  const varianceDistributionData = {
    labels: [
      'Revenue - Favorable', 
      'Revenue - Unfavorable',
      'Expenses - Favorable',
      'Expenses - Unfavorable'
    ],
    datasets: [
      {
        data: [
          varianceAnalysis.revenue.favorable,
          varianceAnalysis.revenue.unfavorable,
          varianceAnalysis.expense.favorable,
          varianceAnalysis.expense.unfavorable
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.6)',  // Revenue favorable
          'rgba(220, 53, 69, 0.6)',  // Revenue unfavorable
          'rgba(23, 162, 184, 0.6)', // Expenses favorable
          'rgba(255, 193, 7, 0.6)'   // Expenses unfavorable
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare forecasting data for chart
  const forecastLabels = [];
  const currentDate = new Date(currentYear, currentMonth, 1);
  for (let i = 0; i <= forecastMonths; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setMonth(forecastDate.getMonth() + i);
    forecastLabels.push(monthNames[forecastDate.getMonth()] + ' ' + forecastDate.getFullYear());
  }
  
  const forecastChartData = {
    labels: forecastLabels,
    datasets: [
      {
        label: 'Revenue',
        data: forecastData.revenue,
        borderColor: 'rgba(40, 167, 69, 1)',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: forecastData.expense,
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Net Profit',
        data: forecastData.net,
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="py-4">
        <PageTitle 
          title="Budget Planner"
          backButton={true}
        />
        
        <div className="d-flex justify-content-end mb-4">
          <Button 
            variant="outline-primary"
            className="me-2"
            onClick={() => setActiveTab(activeTab === 'variance' ? 'budget' : 'variance')}
            aria-pressed={activeTab === 'variance'}
          >
            <FaChartBar className="me-1" aria-hidden="true" /> {activeTab === 'variance' ? 'View Budget' : 'Variance Analysis'}
          </Button>
          <Button 
            variant="outline-primary"
            className="me-2"
            onClick={() => setActiveTab(activeTab === 'forecast' ? 'budget' : 'forecast')}
            aria-pressed={activeTab === 'forecast'}
          >
            <FaChartLine className="me-1" aria-hidden="true" /> {activeTab === 'forecast' ? 'View Budget' : 'Budget Forecast'}
          </Button>
          <Button 
            variant="primary"
            onClick={handleShowAddModal}
            aria-label="Add new budget item"
          >
            <FaPlus className="me-1" aria-hidden="true" /> Add Budget Item
          </Button>
        </div>
        
        {/* Budget Period Selector */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Dropdown className="d-inline-block me-2">
                      <Dropdown.Toggle variant="outline-secondary">
                        {monthNames[currentMonth]}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {monthNames.map((month, index) => (
                          <Dropdown.Item 
                            key={index} 
                            active={currentMonth === index}
                            onClick={() => handleMonthChange(index)}
                          >
                            {month}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="d-inline-block">
                      <Dropdown.Toggle variant="outline-secondary">
                        {currentYear}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => (
                          <Dropdown.Item 
                            key={year} 
                            active={currentYear === year}
                            onClick={() => handleYearChange(year)}
                          >
                            {year}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <h5 className="mb-0">Budget for {monthNames[currentMonth]} {currentYear}</h5>
                  {activeTab === 'forecast' && (
                    <div>
                      <Form.Label className="me-2" htmlFor="forecast-months">Forecast Months:</Form.Label>
                      <Form.Select 
                        id="forecast-months"
                        style={{ width: 'auto', display: 'inline-block' }}
                        value={forecastMonths}
                        onChange={(e) => setForecastMonths(parseInt(e.target.value))}
                        aria-label="Select number of months to forecast"
                      >
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                      </Form.Select>
                    </div>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading budget data...</p>
                  </div>
                ) : (
                  <>
                    {/* Budget Summary */}
                    <div className="budget-summary mb-4">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <Row>
                            <Col md={3}>
                              <div className="text-center">
                                <div className="text-muted mb-1">Revenue</div>
                                <h4 className="text-success mb-0">{formatCurrency(budgetTotals.revenue.actual)}</h4>
                                <div className="small">of {formatCurrency(budgetTotals.revenue.budget)} budgeted</div>
                                <ProgressBar 
                                  now={Math.min((budgetTotals.revenue.actual / budgetTotals.revenue.budget) * 100, 100)} 
                                  variant="success" 
                                  className="mt-2"
                                  aria-label={`Revenue is at ${Math.min((budgetTotals.revenue.actual / budgetTotals.revenue.budget) * 100, 100).toFixed(0)}% of budget`}
                                />
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="text-center">
                                <div className="text-muted mb-1">Expenses</div>
                                <h4 className="text-danger mb-0">{formatCurrency(budgetTotals.expense.actual)}</h4>
                                <div className="small">of {formatCurrency(budgetTotals.expense.budget)} budgeted</div>
                                <ProgressBar 
                                  now={Math.min((budgetTotals.expense.actual / budgetTotals.expense.budget) * 100, 100)} 
                                  variant={budgetTotals.expense.actual <= budgetTotals.expense.budget ? "success" : "danger"} 
                                  className="mt-2"
                                  aria-label={`Expenses are at ${Math.min((budgetTotals.expense.actual / budgetTotals.expense.budget) * 100, 100).toFixed(0)}% of budget`}
                                />
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="text-center">
                                <div className="text-muted mb-1">Net Budget</div>
                                <h4 className={netActual >= 0 ? "text-success mb-0" : "text-danger mb-0"}>
                                  {formatCurrency(netActual)}
                                </h4>
                                <div className="small">of {formatCurrency(netBudget)} budgeted</div>
                                <ProgressBar 
                                  now={netBudget > 0 ? Math.min((netActual / netBudget) * 100, 100) : 0} 
                                  variant={netActual >= netBudget ? "success" : "danger"} 
                                  className="mt-2"
                                  aria-label={`Net budget is at ${netBudget > 0 ? Math.min((netActual / netBudget) * 100, 100).toFixed(0) : 0}% of target`}
                                />
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="text-center">
                                <div className="text-muted mb-1">Variance</div>
                                <h4 className={netVariance >= 0 ? "text-success mb-0" : "text-danger mb-0"}>
                                  {netVariance >= 0 ? "+" : ""}{formatCurrency(netVariance)}
                                </h4>
                                <div className="small">
                                  {netVariancePercentage >= 0 ? "+" : ""}
                                  {netVariancePercentage.toFixed(1)}% from budget
                                </div>
                                <div className="d-flex justify-content-center align-items-center mt-2">
                                  {netVariance >= 0 ? 
                                    <><FaCheck className="text-success me-1" aria-hidden="true" /> <span className="text-success">On Track</span></> : 
                                    <><FaExclamationTriangle className="text-danger me-1" aria-hidden="true" /> <span className="text-danger">Attention Needed</span></>
                                  }
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </div>
                    
                    {/* Main content */}
                    {activeTab === 'budget' && (
                      <div className="budget-table">
                        {/* Render budget table with drag-and-drop and keyboard navigation */}
                        {renderBudgetTable()}
                      </div>
                    )}
                    
                    {activeTab === 'variance' && (
                      <div className="variance-analysis">
                        {/* Variance analysis content */}
                        <h4 className="mb-4">Variance Analysis</h4>
                        <Row>
                          <Col md={6}>
                            <Card className="shadow-sm mb-4">
                              <Card.Header className="bg-white">
                                <h5 className="mb-0">Variance Distribution</h5>
                              </Card.Header>
                              <Card.Body>
                                <div style={{ height: '300px' }}>
                                  <Bar 
                                    data={varianceChartData}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      scales: {
                                        y: {
                                          beginAtZero: true,
                                          title: {
                                            display: true,
                                            text: 'Number of Items'
                                          }
                                        }
                                      },
                                      plugins: {
                                        legend: {
                                          position: 'bottom'
                                        }
                                      }
                                    }}
                                    aria-label="Bar chart showing variance distribution by category"
                                  />
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={6}>
                            <Card className="shadow-sm mb-4">
                              <Card.Header className="bg-white">
                                <h5 className="mb-0">Variance Distribution</h5>
                              </Card.Header>
                              <Card.Body>
                                <div style={{ height: '300px' }}>
                                  <Doughnut 
                                    data={varianceDistributionData}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      plugins: {
                                        legend: {
                                          position: 'bottom'
                                        }
                                      }
                                    }}
                                    aria-label="Doughnut chart showing variance distribution by category"
                                  />
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    )}
                    
                    {activeTab === 'forecast' && (
                      <div className="budget-forecast">
                        {/* Forecast content */}
                        <h4 className="mb-4">Budget Forecast</h4>
                        <Card className="shadow-sm mb-4">
                          <Card.Header className="bg-white">
                            <h5 className="mb-0">{forecastMonths} Month Forecast</h5>
                          </Card.Header>
                          <Card.Body>
                            <div style={{ height: '400px' }}>
                              <Line 
                                data={forecastChartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      title: {
                                        display: true,
                                        text: 'Amount (USD)'
                                      },
                                      ticks: {
                                        callback: function(value) {
                                          return '$' + value.toLocaleString();
                                        }
                                      }
                                    }
                                  },
                                  plugins: {
                                    legend: {
                                      position: 'bottom'
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function(context) {
                                          let label = context.dataset.label || '';
                                          if (label) {
                                            label += ': ';
                                          }
                                          if (context.parsed.y !== null) {
                                            label += new Intl.NumberFormat('en-US', {
                                              style: 'currency',
                                              currency: 'USD'
                                            }).format(context.parsed.y);
                                          }
                                          return label;
                                        }
                                      }
                                    }
                                  }
                                }}
                                aria-label="Line chart showing budget forecast for future months"
                              />
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Add Budget Modal Component */}
        <AddBudgetModal 
          show={showAddModal}
          handleClose={handleCloseAddModal}
          handleSave={handleSaveNewBudget}
          budgetCategories={budgetCategories}
        />
        
        {/* Edit Budget Modal Component */}
        <EditBudgetModal
          show={showEditModal}
          budget={editingBudget}
          handleClose={handleCancelEdit}
          handleSave={handleSaveEdit}
        />
      </Container>
    </DndProvider>
  );
};

export default BudgetPlanner;