import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Row, Col, Badge, Modal, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, 
         FaMoneyBillAlt, FaFileInvoice, FaCalendarAlt, FaUser, FaBuilding, 
         FaFileExport, FaListUl, FaTh, FaChartBar, FaDownload } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Transaction types
  const transactionTypes = [
    { value: 'revenue', label: 'Revenue', color: 'success' },
    { value: 'expense', label: 'Expense', color: 'danger' },
    { value: 'transfer', label: 'Transfer', color: 'info' }
  ];
  
  // Transaction statuses
  const transactionStatuses = [
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'failed', label: 'Failed', color: 'danger' },
    { value: 'cancelled', label: 'Cancelled', color: 'secondary' }
  ];
  
  // Date filter options
  const dateFilterOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Mock data for transactions
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const mockTransactions = [
        {
          id: 1,
          transactionId: 'TRX-10001',
          type: 'revenue',
          amount: 2500.00,
          description: 'Monthly delivery service subscription',
          category: 'Subscriptions',
          date: today,
          status: 'completed',
          account: 'Business Checking',
          customer: {
            id: 1,
            name: 'ABC Logistics'
          },
          relatedInvoice: 'INV-2023-055',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
          updatedAt: today
        },
        {
          id: 2,
          transactionId: 'TRX-10002',
          type: 'expense',
          amount: 850.00,
          description: 'Vehicle maintenance - Fleet #3',
          category: 'Vehicle Maintenance',
          date: yesterday,
          status: 'completed',
          account: 'Business Checking',
          vendor: 'City Auto Service',
          paymentMethod: 'Credit Card',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          updatedAt: yesterday
        },
        {
          id: 3,
          transactionId: 'TRX-10003',
          type: 'revenue',
          amount: 1200.00,
          description: 'Special delivery fee',
          category: 'Delivery Fees',
          date: yesterday,
          status: 'completed',
          account: 'Business Checking',
          customer: {
            id: 3,
            name: 'Tech Solutions Inc.'
          },
          relatedInvoice: 'INV-2023-056',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          updatedAt: yesterday
        },
        {
          id: 4,
          transactionId: 'TRX-10004',
          type: 'expense',
          amount: 1500.00,
          description: 'Office rent payment',
          category: 'Rent',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
          status: 'completed',
          account: 'Business Checking',
          vendor: 'Highrise Properties',
          paymentMethod: 'Bank Transfer',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)
        },
        {
          id: 5,
          transactionId: 'TRX-10005',
          type: 'expense',
          amount: 450.00,
          description: 'Fuel costs for delivery fleet',
          category: 'Fuel',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          status: 'completed',
          account: 'Business Credit Card',
          vendor: 'Shell Gas Stations',
          paymentMethod: 'Credit Card',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
        },
        {
          id: 6,
          transactionId: 'TRX-10006',
          type: 'transfer',
          amount: 5000.00,
          description: 'Transfer to savings account',
          category: 'Internal Transfer',
          date: today,
          status: 'completed',
          fromAccount: 'Business Checking',
          toAccount: 'Business Savings',
          createdAt: today,
          updatedAt: today
        },
        {
          id: 7,
          transactionId: 'TRX-10007',
          type: 'revenue',
          amount: 3500.00,
          description: 'Premium delivery service',
          category: 'Delivery Fees',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
          status: 'completed',
          account: 'Business Checking',
          customer: {
            id: 2,
            name: 'XYZ Retail'
          },
          relatedInvoice: 'INV-2023-052',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)
        },
        {
          id: 8,
          transactionId: 'TRX-10008',
          type: 'expense',
          amount: 750.00,
          description: 'Insurance premium payment',
          category: 'Insurance',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
          status: 'completed',
          account: 'Business Checking',
          vendor: 'SafeGuard Insurance',
          paymentMethod: 'Bank Transfer',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
        },
        {
          id: 9,
          transactionId: 'TRX-10009',
          type: 'revenue',
          amount: 1875.00,
          description: 'Setup fee for new delivery contract',
          category: 'Setup Fees',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          status: 'pending',
          account: 'Business Checking',
          customer: {
            id: 5,
            name: 'Metro Electronics'
          },
          relatedInvoice: 'INV-2023-057',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)
        },
        {
          id: 10,
          transactionId: 'TRX-10010',
          type: 'expense',
          amount: 2200.00,
          description: 'Driver payroll',
          category: 'Payroll',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
          status: 'completed',
          account: 'Payroll Account',
          vendor: 'Internal',
          paymentMethod: 'Direct Deposit',
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)
        }
      ];
      
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort transactions
  useEffect(() => {
    let result = [...transactions];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(transaction => transaction.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(transaction => transaction.status === statusFilter);
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
      default:
        // 'all' or 'custom' (custom would need a date picker)
        break;
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(transaction => 
        transaction.transactionId.toLowerCase().includes(search) ||
        transaction.description.toLowerCase().includes(search) ||
        transaction.category.toLowerCase().includes(search) ||
        (transaction.customer && transaction.customer.name.toLowerCase().includes(search)) ||
        (transaction.vendor && transaction.vendor.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle nested fields
      if (sortField === 'customer.name' && a.customer && b.customer) {
        fieldA = a.customer.name;
        fieldB = b.customer.name;
      }
      
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
  }, [transactions, searchTerm, typeFilter, statusFilter, dateFilter, sortField, sortDirection]);

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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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

  // Get transaction status badge
  const getStatusBadge = (status) => {
    const transactionStatus = transactionStatuses.find(s => s.value === status);
    return transactionStatus ? (
      <Badge bg={transactionStatus.color} className="text-uppercase">
        {transactionStatus.label}
      </Badge>
    ) : null;
  };

  // Handle delete confirmation
  const confirmDelete = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (transactionToDelete) {
      // In a real app, this would be an API call
      setTransactions(transactions.filter(t => t.id !== transactionToDelete.id));
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    }
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    const totalTransactions = transactions.length;
    const totalRevenue = transactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    
    return {
      totalTransactions,
      totalRevenue,
      totalExpenses,
      netAmount: totalRevenue - totalExpenses,
      pendingTransactions
    };
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
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

  // Render summary
  const renderSummary = () => {
    const stats = getSummaryStats();
    
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-primary bg-opacity-10 rounded p-3 me-3">
                <FaMoneyBillAlt className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Transactions</h6>
                <h3 className="mb-0">{stats.totalTransactions}</h3>
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
                <h6 className="text-muted mb-1">Total Revenue</h6>
                <h3 className="mb-0">{formatCurrency(stats.totalRevenue)}</h3>
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
                <h6 className="text-muted mb-1">Total Expenses</h6>
                <h3 className="mb-0">{formatCurrency(stats.totalExpenses)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-info bg-opacity-10 rounded p-3 me-3">
                <FaMoneyBillAlt className="text-info" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Net Amount</h6>
                <h3 className={`mb-0 ${stats.netAmount >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(stats.netAmount)}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  
  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title="Financial Transactions"
        backButton={true}
      />
      
      <div className="d-flex justify-content-end align-items-center mb-4">
        <Button 
          variant="outline-primary"
          className="me-2"
          onClick={() => navigate('/financial/reports')}
        >
          <FaChartBar className="me-1" /> Reports
        </Button>
        <Button 
          variant="outline-success"
          className="me-2"
          onClick={() => {/* Export functionality */}}
        >
          <FaDownload className="me-1" /> Export
        </Button>
        <Button 
          variant="primary"
          onClick={() => navigate('/financial/transactions/new')}
        >
          <FaPlus className="me-1" /> Add Transaction
        </Button>
      </div>
      
      {renderSummary()}
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={3}>
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
            <Col md={2}>
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
            <Col md={2}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {transactionStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
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
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Col>
            <Col md={1} className="d-flex justify-content-end">
              <div className="btn-group">
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
                  onClick={() => setViewMode('list')}
                >
                  <FaListUl />
                </Button>
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
                  onClick={() => setViewMode('grid')}
                >
                  <FaTh />
                </Button>
              </div>
            </Col>
          </Row>
          
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading transactions...</p>
            </div>
          ) : (
            <>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No transactions found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/financial/transactions/new')}
                  >
                    <FaPlus className="me-1" /> Add Transaction
                  </Button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('transactionId')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          ID {sortField === 'transactionId' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Date {sortField === 'date' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                          Type {sortField === 'type' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Description</th>
                        <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                          Category {sortField === 'category' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Amount {sortField === 'amount' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>
                          Company/Vendor
                        </th>
                        <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                          Status {sortField === 'status' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>
                            <Link to={`/financial/transactions/${transaction.id}`} className="fw-bold text-decoration-none">
                              {transaction.transactionId}
                            </Link>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(transaction.date)}
                          </td>
                          <td>{getTypeBadge(transaction.type)}</td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {transaction.description}
                            </div>
                          </td>
                          <td>{transaction.category}</td>
                          <td className={transaction.type === 'expense' ? 'text-danger' : transaction.type === 'revenue' ? 'text-success' : ''}>
                            {transaction.type === 'expense' ? '- ' : transaction.type === 'revenue' ? '+ ' : ''}
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td>
                            {transaction.customer ? transaction.customer.name : transaction.vendor || 'N/A'}
                          </td>
                          <td>{getStatusBadge(transaction.status)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${transaction.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/financial/transactions/${transaction.id}`}>
                                  <FaMoneyBillAlt className="me-2" /> View Details
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/financial/transactions/${transaction.id}/edit`}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                {transaction.relatedInvoice && (
                                  <Dropdown.Item as={Link} to={`/financial/invoices/${transaction.relatedInvoice}`}>
                                    <FaFileInvoice className="me-2" /> View Invoice
                                  </Dropdown.Item>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => confirmDelete(transaction)}
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
              ) : (
                <Row>
                  {currentTransactions.map(transaction => (
                    <Col md={4} key={transaction.id} className="mb-4">
                      <Card className={`h-100 shadow-sm ${transaction.type === 'revenue' ? 'border-success' : transaction.type === 'expense' ? 'border-danger' : 'border-info'} border-top-0 border-end-0 border-bottom-0 border-3`}>
                        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                          <span className="fw-bold">{transaction.transactionId}</span>
                          {getStatusBadge(transaction.status)}
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <div className="text-muted small">Date</div>
                              <div>{formatDate(transaction.date)}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Type</div>
                              <div>{getTypeBadge(transaction.type)}</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-muted small">Description</div>
                            <div>{transaction.description}</div>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <div className="text-muted small">Category</div>
                              <div>{transaction.category}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Amount</div>
                              <div className={`fw-bold ${transaction.type === 'expense' ? 'text-danger' : transaction.type === 'revenue' ? 'text-success' : ''}`}>
                                {transaction.type === 'expense' ? '- ' : transaction.type === 'revenue' ? '+ ' : ''}
                                {formatCurrency(transaction.amount)}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-muted small">
                              {transaction.customer ? 'Customer' : transaction.vendor ? 'Vendor' : 'Accounts'}
                            </div>
                            <div>
                              {transaction.customer ? transaction.customer.name : 
                               transaction.vendor ? transaction.vendor : 
                               `${transaction.fromAccount} → ${transaction.toAccount}`}
                            </div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <div className="d-flex justify-content-between">
                            <Button 
                              as={Link} 
                              to={`/financial/transactions/${transaction.id}`} 
                              variant="outline-primary" 
                              size="sm"
                            >
                              View
                            </Button>
                            <Button 
                              as={Link} 
                              to={`/financial/transactions/${transaction.id}/edit`} 
                              variant="outline-secondary" 
                              size="sm"
                            >
                              Edit
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
              
              {renderPagination()}
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete transaction <strong>{transactionToDelete?.transactionId}</strong>?
          
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransactionList;