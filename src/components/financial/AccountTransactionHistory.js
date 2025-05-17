import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Table, Button, Form, Row, Col, Badge, Modal, Pagination, 
  InputGroup, Alert, Dropdown 
} from 'react-bootstrap';
import { 
  FaArrowLeft, FaPlus, FaTrash, FaPencilAlt, FaSearch, FaMoneyBillAlt, 
  FaFilter, FaSort, FaEllipsisV, FaCalendarAlt, FaDownload 
} from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const AccountTransactionHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Form state for add/edit transaction
  const [transactionForm, setTransactionForm] = useState({
    id: '',
    accountId: parseInt(id),
    type: 'deposit',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    reference: '',
    notes: ''
  });
  
  // Transaction types
  const transactionTypes = [
    { value: 'deposit', label: 'Deposit', color: 'success' },
    { value: 'withdrawal', label: 'Withdrawal', color: 'danger' },
    { value: 'transfer_in', label: 'Transfer In', color: 'info' },
    { value: 'transfer_out', label: 'Transfer Out', color: 'warning' },
    { value: 'adjustment', label: 'Adjustment', color: 'secondary' }
  ];
  
  // Transaction categories
  const transactionCategories = {
    deposit: ['Income', 'Interest', 'Transfer', 'Refund', 'Other'],
    withdrawal: ['Expense', 'Fee', 'Transfer', 'Payment', 'Other'],
    transfer_in: ['Internal Transfer'],
    transfer_out: ['Internal Transfer'],
    adjustment: ['Correction', 'Fee Reversal', 'Interest Adjustment', 'Other']
  };
  
  // Date filter options
  const dateFilterOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' }
  ];

  // Load account and transactions data
  useEffect(() => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    // For now, we'll simulate it with setTimeout
    setTimeout(() => {
      // Simulate fetching account data
      const mockAccount = {
        id: parseInt(id),
        name: id === '1' ? 'Business Checking' : 
              id === '2' ? 'Business Savings' :
              id === '3' ? 'Company Credit Card' :
              id === '4' ? 'Vehicle Loan' :
              id === '5' ? 'Tax Reserve' : 'Payroll Account',
        type: id === '1' ? 'checking' : 
              id === '2' ? 'savings' :
              id === '3' ? 'credit' :
              id === '4' ? 'loan' :
              id === '5' ? 'savings' : 'checking',
        balance: id === '1' ? 125000.75 : 
                 id === '2' ? 75000.00 :
                 id === '3' ? -4250.85 :
                 id === '4' ? -85000.00 :
                 id === '5' ? 35000.00 : 42500.00,
        institution: ['Bank of America', 'Bank of America', 'American Express', 'Motor Finance Co.', 'Bank of America', 'Wells Fargo'][parseInt(id) - 1] || 'Unknown Bank',
        accountNumber: `******${1234 + parseInt(id)}`,
        description: ['Main operational account', 'Emergency fund and reserves', 'Primary business expenses', 'Fleet vehicle loans', 'Reserved for quarterly tax payments', 'Dedicated for payroll transactions'][parseInt(id) - 1] || 'Account description',
        lastTransaction: new Date(),
        isReconciled: true
      };
      
      // Simulate fetching transactions
      const today = new Date();
      
      // Generate 20 mock transactions spanning the last 3 months
      const mockTransactions = [];
      let runningBalance = mockAccount.balance;
      
      for (let i = 0; i < 20; i++) {
        // Generate transaction date (random date in the last 3 months)
        const transactionDate = new Date(today);
        transactionDate.setDate(today.getDate() - Math.floor(Math.random() * 90));
        
        // Determine transaction type (more deposits for savings, more withdrawals for checking/credit)
        let type;
        if (mockAccount.type === 'savings') {
          type = Math.random() > 0.3 ? 'deposit' : 'withdrawal';
        } else if (mockAccount.type === 'credit' || mockAccount.type === 'loan') {
          type = Math.random() > 0.7 ? 'deposit' : 'withdrawal';
        } else {
          type = Math.random() > 0.5 ? 'deposit' : 'withdrawal';
        }
        
        // For every 5th transaction, make it a transfer
        if (i % 5 === 0) {
          type = Math.random() > 0.5 ? 'transfer_in' : 'transfer_out';
        }
        
        // For every 10th transaction, make it an adjustment
        if (i % 10 === 0) {
          type = 'adjustment';
        }
        
        // Generate transaction amount (random amount between $10 and $5000)
        const amount = Math.round((10 + Math.random() * 4990) * 100) / 100;
        
        // Adjust running balance based on transaction type
        if (type === 'deposit' || type === 'transfer_in') {
          runningBalance -= amount; // We're going backwards in time
        } else {
          runningBalance += amount; // We're going backwards in time
        }
        
        // Generate transaction category based on type
        const category = transactionCategories[type][Math.floor(Math.random() * transactionCategories[type].length)];
        
        // Generate transaction description
        let description = '';
        if (type === 'deposit') {
          description = category === 'Income' ? 'Client payment' : 
                       category === 'Interest' ? 'Monthly interest' :
                       category === 'Transfer' ? 'Transfer from another account' :
                       category === 'Refund' ? 'Vendor refund' : 'Deposit';
        } else if (type === 'withdrawal') {
          description = category === 'Expense' ? 'Office supplies' : 
                       category === 'Fee' ? 'Monthly service fee' :
                       category === 'Transfer' ? 'Transfer to another account' :
                       category === 'Payment' ? 'Vendor payment' : 'Withdrawal';
        } else if (type === 'transfer_in') {
          description = 'Transfer from account ending in ' + (1000 + Math.floor(Math.random() * 9000)).toString().slice(-4);
        } else if (type === 'transfer_out') {
          description = 'Transfer to account ending in ' + (1000 + Math.floor(Math.random() * 9000)).toString().slice(-4);
        } else {
          description = category === 'Correction' ? 'Balance correction' : 
                       category === 'Fee Reversal' ? 'Fee reversal' :
                       category === 'Interest Adjustment' ? 'Interest adjustment' : 'Account adjustment';
        }
        
        // Generate reference number
        const reference = 'REF-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        
        // Create transaction object
        mockTransactions.push({
          id: i + 1,
          accountId: mockAccount.id,
          type,
          amount,
          description,
          date: transactionDate,
          category,
          reference,
          balanceAfter: runningBalance,
          notes: '',
          createdAt: new Date(transactionDate.getTime() - 1000 * 60 * 60 * 2), // 2 hours before transaction date
          updatedAt: new Date(transactionDate)
        });
      }
      
      // Sort transactions by date descending (newest first)
      mockTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Update state
      setAccount(mockAccount);
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Filter and sort transactions
  useEffect(() => {
    if (!transactions.length) return;
    
    let result = [...transactions];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(transaction => transaction.type === typeFilter);
    }
    
    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay());
    
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);
    
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(today.getFullYear(), 0, 0);
    
    switch (dateFilter) {
      case 'today':
        result = result.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          transactionDate.setHours(0, 0, 0, 0);
          return transactionDate.getTime() === today.getTime();
        });
        break;
      case 'yesterday':
        result = result.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          transactionDate.setHours(0, 0, 0, 0);
          return transactionDate.getTime() === yesterday.getTime();
        });
        break;
      case 'this-week':
        result = result.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startOfThisWeek && transactionDate < today.getTime() + 86400000;
        });
        break;
      case 'last-week':
        result = result.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startOfLastWeek && transactionDate <= endOfLastWeek;
        });
        break;
      case 'this-month':
        result = result.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startOfThisMonth && transactionDate < today.getTime() + 86400000;
        });
        break;
      case 'last-month':
        result = result.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startOfLastMonth && transactionDate <= endOfLastMonth;
        });
        break;
      case 'this-year':
        result = result.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startOfThisYear && transactionDate < today.getTime() + 86400000;
        });
        break;
      case 'last-year':
        result = result.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startOfLastYear && transactionDate <= endOfLastYear;
        });
        break;
      default:
        // 'all' - no filtering
        break;
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(transaction => 
        transaction.description.toLowerCase().includes(search) ||
        transaction.category.toLowerCase().includes(search) ||
        transaction.reference.toLowerCase().includes(search) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle dates
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      // Handle strings
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      // Handle numbers
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });
    
    setFilteredTransactions(result);
  }, [transactions, searchTerm, typeFilter, dateFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  
  // Handle pagination click
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };
  
  // Get transaction type badge
  const getTypeBadge = (type) => {
    const transactionType = transactionTypes.find(t => t.value === type);
    return transactionType ? (
      <Badge bg={transactionType.color} className="text-uppercase">
        {transactionType.label}
      </Badge>
    ) : null;
  };
  
  // Handle transaction form changes
  const handleTransactionFormChange = (e) => {
    const { name, value } = e.target;
    
    setTransactionForm({
      ...transactionForm,
      [name]: value
    });
    
    // Reset category if type changes
    if (name === 'type') {
      setTransactionForm(prev => ({
        ...prev,
        category: ''
      }));
    }
  };
  
  // Validate transaction form
  const validateTransactionForm = () => {
    const errors = {};
    
    if (!transactionForm.type) {
      errors.type = 'Transaction type is required';
    }
    
    if (!transactionForm.amount || isNaN(parseFloat(transactionForm.amount)) || parseFloat(transactionForm.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    
    if (!transactionForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!transactionForm.date) {
      errors.date = 'Date is required';
    }
    
    if (!transactionForm.category) {
      errors.category = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle add transaction
  const handleAddTransaction = () => {
    setTransactionForm({
      id: '',
      accountId: parseInt(id),
      type: 'deposit',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      reference: 'REF-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
      notes: ''
    });
    setFormErrors({});
    setShowAddModal(true);
  };
  
  // Handle edit transaction
  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionForm({
      id: transaction.id,
      accountId: transaction.accountId,
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0],
      category: transaction.category,
      reference: transaction.reference,
      notes: transaction.notes || ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };
  
  // Handle delete transaction
  const handleDeleteTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };
  
  // Handle add transaction submit
  const handleAddTransactionSubmit = (e) => {
    e.preventDefault();
    
    if (!validateTransactionForm()) {
      return;
    }
    
    setSaveSuccess(false);
    setSaveError('');
    
    // In a real app, this would be an API call
    try {
      // Get current transaction amount
      const amount = parseFloat(transactionForm.amount);
      
      // Create a new transaction
      const newTransaction = {
        id: Math.max(...transactions.map(t => t.id), 0) + 1,
        accountId: parseInt(id),
        type: transactionForm.type,
        amount,
        description: transactionForm.description,
        date: new Date(transactionForm.date),
        category: transactionForm.category,
        reference: transactionForm.reference,
        balanceAfter: account.balance + (transactionForm.type === 'deposit' || transactionForm.type === 'transfer_in' ? amount : -amount),
        notes: transactionForm.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update account balance
      const updatedAccount = {
        ...account,
        balance: account.balance + (transactionForm.type === 'deposit' || transactionForm.type === 'transfer_in' ? amount : -amount),
        lastTransaction: new Date()
      };
      
      // Update state
      setAccount(updatedAccount);
      setTransactions([newTransaction, ...transactions]);
      setSaveSuccess(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowAddModal(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      setSaveError('An error occurred while saving the transaction');
      console.error('Error adding transaction:', error);
    }
  };
  
  // Handle edit transaction submit
  const handleEditTransactionSubmit = (e) => {
    e.preventDefault();
    
    if (!validateTransactionForm()) {
      return;
    }
    
    setSaveSuccess(false);
    setSaveError('');
    
    // In a real app, this would be an API call
    try {
      // Get new transaction amount
      const newAmount = parseFloat(transactionForm.amount);
      
      // Get old transaction amount and type
      const oldTransaction = transactions.find(t => t.id === selectedTransaction.id);
      const oldAmount = oldTransaction.amount;
      const oldType = oldTransaction.type;
      
      // Calculate balance adjustment
      let balanceAdjustment = 0;
      
      // Remove old transaction effect
      if (oldType === 'deposit' || oldType === 'transfer_in') {
        balanceAdjustment -= oldAmount;
      } else {
        balanceAdjustment += oldAmount;
      }
      
      // Add new transaction effect
      if (transactionForm.type === 'deposit' || transactionForm.type === 'transfer_in') {
        balanceAdjustment += newAmount;
      } else {
        balanceAdjustment -= newAmount;
      }
      
      // Update transaction
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === selectedTransaction.id ? 
          {
            ...transaction,
            type: transactionForm.type,
            amount: newAmount,
            description: transactionForm.description,
            date: new Date(transactionForm.date),
            category: transactionForm.category,
            reference: transactionForm.reference,
            notes: transactionForm.notes,
            updatedAt: new Date()
          } : 
          transaction
      );
      
      // Update account balance
      const updatedAccount = {
        ...account,
        balance: account.balance + balanceAdjustment,
        lastTransaction: new Date()
      };
      
      // Update state
      setAccount(updatedAccount);
      setTransactions(updatedTransactions);
      setSaveSuccess(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowEditModal(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      setSaveError('An error occurred while updating the transaction');
      console.error('Error updating transaction:', error);
    }
  };
  
  // Handle delete transaction submit
  const handleDeleteTransactionSubmit = () => {
    if (!selectedTransaction) return;
    
    // In a real app, this would be an API call
    try {
      // Calculate balance adjustment
      let balanceAdjustment = 0;
      
      // Remove transaction effect
      if (selectedTransaction.type === 'deposit' || selectedTransaction.type === 'transfer_in') {
        balanceAdjustment -= selectedTransaction.amount;
      } else {
        balanceAdjustment += selectedTransaction.amount;
      }
      
      // Update account balance
      const updatedAccount = {
        ...account,
        balance: account.balance + balanceAdjustment
      };
      
      // Update state
      setAccount(updatedAccount);
      setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
      
      // Close modal
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };
  
  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      pages.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center">
        <Pagination.Prev 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };
  
  // Calculate summary amounts
  const calculateSummary = () => {
    if (!transactions.length) return { deposits: 0, withdrawals: 0, balance: 0 };
    
    const deposits = transactions
      .filter(t => t.type === 'deposit' || t.type === 'transfer_in')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const withdrawals = transactions
      .filter(t => t.type === 'withdrawal' || t.type === 'transfer_out')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const adjustments = transactions
      .filter(t => t.type === 'adjustment')
      .reduce((sum, t) => sum + (t.amount * (t.category === 'Correction' || t.category === 'Fee Reversal' ? 1 : -1)), 0);
      
    return {
      deposits,
      withdrawals,
      adjustments,
      total: deposits - withdrawals + adjustments
    };
  };
  
  // Get summary data
  const summary = calculateSummary();

  return (
    <div className="container-fluid py-4">
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading transaction history...</p>
        </div>
      ) : (
        <>
          <PageTitle 
            title={`${account?.name} - Transaction History`}
            backButton={true}
          />
          
          <div className="d-flex justify-content-end mb-4">
            <Button 
              variant="outline-success"
              className="me-2"
              onClick={() => console.log('Export functionality')}
            >
              <FaDownload className="me-1" /> Export
            </Button>
            <Button 
              variant="primary"
              onClick={handleAddTransaction}
            >
              <FaPlus className="me-1" /> Add Transaction
            </Button>
          </div>
          
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="icon-wrapper bg-success bg-opacity-10 rounded p-3 me-3">
                    <FaMoneyBillAlt className="text-success" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Current Balance</h6>
                    <h3 className={`mb-0 ${account?.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(account?.balance || 0)}
                    </h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="icon-wrapper bg-success bg-opacity-10 rounded p-3 me-3">
                    <FaMoneyBillAlt className="text-success" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Deposits</h6>
                    <h3 className="mb-0 text-success">
                      {formatCurrency(summary.deposits)}
                    </h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="icon-wrapper bg-danger bg-opacity-10 rounded p-3 me-3">
                    <FaMoneyBillAlt className="text-danger" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Withdrawals</h6>
                    <h3 className="mb-0 text-danger">
                      {formatCurrency(summary.withdrawals)}
                    </h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="icon-wrapper bg-primary bg-opacity-10 rounded p-3 me-3">
                    <FaMoneyBillAlt className="text-primary" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Net Flow</h6>
                    <h3 className={`mb-0 ${summary.total >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(summary.total)}
                    </h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaFilter />
                    </InputGroup.Text>
                    <Form.Select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      {transactionTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaCalendarAlt />
                    </InputGroup.Text>
                    <Form.Select 
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      {dateFilterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-secondary" 
                    className="w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('all');
                      setDateFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
              
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No transactions found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={handleAddTransaction}
                  >
                    <FaPlus className="me-1" /> Add Transaction
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Date {sortField === 'date' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>
                          Description {sortField === 'description' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                          Type {sortField === 'type' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                          Category {sortField === 'category' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('reference')} style={{ cursor: 'pointer' }}>
                          Reference {sortField === 'reference' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                          Amount {sortField === 'amount' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('balanceAfter')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                          Balance {sortField === 'balanceAfter' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th style={{ width: '100px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(transaction.date)}
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {transaction.description}
                            </div>
                            {transaction.notes && (
                              <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                                {transaction.notes}
                              </div>
                            )}
                          </td>
                          <td>{getTypeBadge(transaction.type)}</td>
                          <td>{transaction.category}</td>
                          <td>{transaction.reference}</td>
                          <td className={`text-${transaction.type === 'deposit' || transaction.type === 'transfer_in' ? 'success' : transaction.type === 'withdrawal' || transaction.type === 'transfer_out' ? 'danger' : 'warning'} text-end`}>
                            {transaction.type === 'deposit' || transaction.type === 'transfer_in' ? '+ ' : transaction.type === 'withdrawal' || transaction.type === 'transfer_out' ? '- ' : '± '}
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="text-end fw-bold">
                            {formatCurrency(transaction.balanceAfter)}
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${transaction.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEditTransaction(transaction)}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => handleDeleteTransaction(transaction)}
                                >
                                  <FaTrash className="me-2" /> Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              
              {renderPagination()}
            </Card.Body>
          </Card>
          
          {/* Add Transaction Modal */}
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
            <Form onSubmit={handleAddTransactionSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Add New Transaction</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {saveSuccess && (
                  <Alert variant="success" className="mb-4">
                    Transaction created successfully!
                  </Alert>
                )}
                
                {saveError && (
                  <Alert variant="danger" className="mb-4">
                    {saveError}
                  </Alert>
                )}
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Transaction Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="type"
                        value={transactionForm.type}
                        onChange={handleTransactionFormChange}
                        isInvalid={!!formErrors.type}
                        required
                      >
                        {transactionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaCalendarAlt className="me-1" />
                        Transaction Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={transactionForm.date}
                        onChange={handleTransactionFormChange}
                        isInvalid={!!formErrors.date}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.date}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0.01"
                          name="amount"
                          value={transactionForm.amount}
                          onChange={handleTransactionFormChange}
                          isInvalid={!!formErrors.amount}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.amount}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="category"
                        value={transactionForm.category}
                        onChange={handleTransactionFormChange}
                        isInvalid={!!formErrors.category}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {transactionCategories[transactionForm.type]?.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={transactionForm.description}
                    onChange={handleTransactionFormChange}
                    placeholder="Enter transaction description"
                    isInvalid={!!formErrors.description}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reference Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="reference"
                        value={transactionForm.reference}
                        onChange={handleTransactionFormChange}
                        placeholder="Transaction reference or ID"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Account</Form.Label>
                      <Form.Control
                        type="text"
                        value={account?.name}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={transactionForm.notes}
                    onChange={handleTransactionFormChange}
                    placeholder="Additional notes about this transaction"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Add Transaction
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          
          {/* Edit Transaction Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
            <Form onSubmit={handleEditTransactionSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Transaction</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {saveSuccess && (
                  <Alert variant="success" className="mb-4">
                    Transaction updated successfully!
                  </Alert>
                )}
                
                {saveError && (
                  <Alert variant="danger" className="mb-4">
                    {saveError}
                  </Alert>
                )}
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Transaction Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="type"
                        value={transactionForm.type}
                        onChange={handleTransactionFormChange}
                        isInvalid={!!formErrors.type}
                        required
                      >
                        {transactionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaCalendarAlt className="me-1" />
                        Transaction Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={transactionForm.date}
                        onChange={handleTransactionFormChange}
                        isInvalid={!!formErrors.date}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.date}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0.01"
                          name="amount"
                          value={transactionForm.amount}
                          onChange={handleTransactionFormChange}
                          isInvalid={!!formErrors.amount}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.amount}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="category"
                        value={transactionForm.category}
                        onChange={handleTransactionFormChange}
                        isInvalid={!!formErrors.category}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {transactionCategories[transactionForm.type]?.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={transactionForm.description}
                    onChange={handleTransactionFormChange}
                    placeholder="Enter transaction description"
                    isInvalid={!!formErrors.description}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reference Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="reference"
                        value={transactionForm.reference}
                        onChange={handleTransactionFormChange}
                        placeholder="Transaction reference or ID"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Account</Form.Label>
                      <Form.Control
                        type="text"
                        value={account?.name}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={transactionForm.notes}
                    onChange={handleTransactionFormChange}
                    placeholder="Additional notes about this transaction"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          
          {/* Delete Transaction Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this transaction?
              
              {selectedTransaction && (
                <div className="mt-3 border rounded p-3">
                  <p className="mb-1"><strong>Date:</strong> {formatDate(selectedTransaction.date)}</p>
                  <p className="mb-1"><strong>Description:</strong> {selectedTransaction.description}</p>
                  <p className="mb-1"><strong>Type:</strong> {selectedTransaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="mb-0"><strong>Amount:</strong> {formatCurrency(selectedTransaction.amount)}</p>
                </div>
              )}
              
              <div className="mt-3 text-danger">
                This action cannot be undone and will affect the account balance.
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteTransactionSubmit}>
                Delete Transaction
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AccountTransactionHistory;