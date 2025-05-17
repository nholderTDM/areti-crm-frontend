import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Row, Col, Badge, Modal, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, 
         FaMoneyBillAlt, FaReceipt, FaCalendarAlt, FaUser, FaBuilding, 
         FaFileExport, FaListUl, FaTh, FaChartBar, FaDownload, FaCheck } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const ExpenseList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Expense categories
  const expenseCategories = [
    { value: 'fuel', label: 'Fuel', color: 'danger' },
    { value: 'maintenance', label: 'Vehicle Maintenance', color: 'warning' },
    { value: 'insurance', label: 'Insurance', color: 'info' },
    { value: 'rent', label: 'Rent', color: 'dark' },
    { value: 'utilities', label: 'Utilities', color: 'primary' },
    { value: 'payroll', label: 'Payroll', color: 'success' },
    { value: 'office', label: 'Office Expenses', color: 'secondary' },
    { value: 'other', label: 'Other', color: 'light' }
  ];
  
  // Expense statuses
  const expenseStatuses = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'approved', label: 'Approved', color: 'success' },
    { value: 'rejected', label: 'Rejected', color: 'danger' },
    { value: 'paid', label: 'Paid', color: 'info' }
  ];
  
  // Date filter options
  const dateFilterOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-quarter', label: 'This Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Load expenses data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const today = new Date();
        
      const mockExpenses = [
        {
          id: 1,
          description: 'Fuel for delivery trucks',
          amount: 450.75,
          category: 'fuel',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          status: 'paid',
          paymentMethod: 'Company Card',
          vendor: 'Shell Gas Station',
          receipt: true,
          submittedBy: 'Michael Rodriguez',
          approvedBy: 'Admin User'
        },
        {
          id: 2,
          description: 'Office rent payment - May',
          amount: 2500.00,
          category: 'rent',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
          status: 'paid',
          paymentMethod: 'Bank Transfer',
          vendor: 'Highrise Properties',
          receipt: true,
          submittedBy: 'Admin User',
          approvedBy: 'Admin User'
        },
        {
          id: 3,
          description: 'Vehicle maintenance - Fleet #3',
          amount: 783.50,
          category: 'maintenance',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
          status: 'paid',
          paymentMethod: 'Company Card',
          vendor: 'City Auto Service',
          receipt: true,
          submittedBy: 'David Wilson',
          approvedBy: 'Admin User'
        },
        {
          // Continuing from where we left off in ExpenseList.js
          id: 4,
          description: 'Office supplies',
          amount: 124.37,
          category: 'office',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
          status: 'paid',
          paymentMethod: 'Company Card',
          vendor: 'Office Supply Co.',
          receipt: true,
          submittedBy: 'Sarah Johnson',
          approvedBy: 'Admin User'
        },
        {
          id: 5,
          description: 'Internet and phone service - May',
          amount: 189.99,
          category: 'utilities',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
          status: 'pending',
          paymentMethod: 'Pending',
          vendor: 'AT&T',
          receipt: false,
          submittedBy: 'Admin User',
          approvedBy: null
        },
        {
          id: 6,
          description: 'Driver training program',
          amount: 750.00,
          category: 'other',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15),
          status: 'approved',
          paymentMethod: 'ACH Transfer',
          vendor: 'Pro Drivers Training Academy',
          receipt: true,
          submittedBy: 'Admin User',
          approvedBy: 'Admin User'
        },
        {
          id: 7,
          description: 'Vehicle insurance - Q2',
          amount: 3650.00,
          category: 'insurance',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20),
          status: 'paid',
          paymentMethod: 'Bank Transfer',
          vendor: 'SafeGuard Insurance',
          receipt: true,
          submittedBy: 'Admin User',
          approvedBy: 'Admin User'
        },
        {
          id: 8,
          description: 'Fuel for delivery trucks',
          amount: 385.25,
          category: 'fuel',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8),
          status: 'paid',
          paymentMethod: 'Company Card',
          vendor: 'Shell Gas Station',
          receipt: true,
          submittedBy: 'Michael Rodriguez',
          approvedBy: 'Admin User'
        },
        {
          id: 9,
          description: 'Software subscription - Fleet management',
          amount: 299.00,
          category: 'other',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          status: 'pending',
          paymentMethod: 'Pending',
          vendor: 'FleetTrack Solutions',
          receipt: false,
          submittedBy: 'Admin User',
          approvedBy: null
        },
        {
          id: 10,
          description: 'Office cleaning service - April',
          amount: 175.00,
          category: 'office',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 25),
          status: 'paid',
          paymentMethod: 'ACH Transfer',
          vendor: 'Clean Spaces Inc.',
          receipt: true,
          submittedBy: 'Admin User',
          approvedBy: 'Admin User'
        }
      ];
      
      setExpenses(mockExpenses);
      setFilteredExpenses(mockExpenses);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort expenses
  useEffect(() => {
    let result = [...expenses];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(expense => expense.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(expense => expense.status === statusFilter);
    }
    
    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay());
    
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const startOfThisQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
    
    switch (dateFilter) {
      case 'today':
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          expenseDate.setHours(0, 0, 0, 0);
          return expenseDate.getTime() === today.getTime();
        });
        break;
      case 'this-week':
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfThisWeek && expenseDate < today.getTime() + 86400000;
        });
        break;
      case 'this-month':
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfThisMonth && expenseDate < today.getTime() + 86400000;
        });
        break;
      case 'last-month':
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfLastMonth && expenseDate <= endOfLastMonth;
        });
        break;
      case 'this-quarter':
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfThisQuarter && expenseDate < today.getTime() + 86400000;
        });
        break;
      default:
        // 'all' or 'custom' (custom would need a date picker)
        break;
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(expense => 
        expense.description.toLowerCase().includes(search) ||
        expense.vendor.toLowerCase().includes(search) ||
        expense.submittedBy.toLowerCase().includes(search)
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
    
    setFilteredExpenses(result);
  }, [expenses, searchTerm, categoryFilter, statusFilter, dateFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

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

  // Get category badge
  const getCategoryBadge = (category) => {
    const expenseCategory = expenseCategories.find(c => c.value === category);
    return expenseCategory ? (
      <Badge bg={expenseCategory.color} className="text-uppercase">
        {expenseCategory.label}
      </Badge>
    ) : null;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const expenseStatus = expenseStatuses.find(s => s.value === status);
    return expenseStatus ? (
      <Badge bg={expenseStatus.color} className="text-uppercase">
        {expenseStatus.label}
      </Badge>
    ) : null;
  };

  // Handle delete confirmation
  const confirmDelete = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (expenseToDelete) {
      // In a real app, this would be an API call
      setExpenses(expenses.filter(e => e.id !== expenseToDelete.id));
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    }
  };

  // Handle navigating to add expense page
  const handleAddExpense = () => {
    navigate('/financial/expenses/new');
  };

  // Calculate expense stats
  const getExpenseStats = () => {
    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const pendingExpenses = expenses.filter(exp => exp.status === 'pending').length;
    const pendingAmount = expenses
      .filter(exp => exp.status === 'pending')
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    return {
      totalExpenses,
      totalAmount,
      pendingExpenses,
      pendingAmount,
      thisMonthAmount: expenses
        .filter(exp => {
          const expenseDate = new Date(exp.date);
          const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          return expenseDate >= startOfMonth;
        })
        .reduce((sum, exp) => sum + exp.amount, 0)
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

  // Render expense summary
  const renderSummary = () => {
    const stats = getExpenseStats();
    
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-primary bg-opacity-10 rounded p-3 me-3">
                <FaMoneyBillAlt className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Expenses</h6>
                <h3 className="mb-0">{stats.totalExpenses}</h3>
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
                <h6 className="text-muted mb-1">Total Amount</h6>
                <h3 className="mb-0">{formatCurrency(stats.totalAmount)}</h3>
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
                <h6 className="text-muted mb-1">This Month</h6>
                <h3 className="mb-0">{formatCurrency(stats.thisMonthAmount)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-warning bg-opacity-10 rounded p-3 me-3">
                <FaMoneyBillAlt className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Pending Approval</h6>
                <h3 className="mb-0">{formatCurrency(stats.pendingAmount)}</h3>
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
        title="Expenses"
        backButton={false}
      />
      
      <div className="d-flex justify-content-end mb-4">
        <Button 
          variant="outline-primary"
          className="me-2"
          onClick={() => navigate('/financial/expenses/reports')}
        >
          <FaChartBar className="me-1" /> Expense Reports
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
          onClick={handleAddExpense}
        >
          <FaPlus className="me-1" /> Record Expense
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
                  placeholder="Search expenses..."
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
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {expenseCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
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
                  {expenseStatuses.map(status => (
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
                  setCategoryFilter('all');
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
              <p className="mt-3">Loading expenses...</p>
            </div>
          ) : (
            <>
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No expenses found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={handleAddExpense}
                  >
                    <FaPlus className="me-1" /> Record Expense
                  </Button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>
                          Description {sortField === 'description' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
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
                        <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Date {sortField === 'date' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Vendor</th>
                        <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                          Status {sortField === 'status' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Receipt</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentExpenses.map(expense => (
                        <tr key={expense.id}>
                          <td>
                            <Link to={`/financial/expenses/${expense.id}`} className="text-decoration-none">
                              {expense.description}
                            </Link>
                          </td>
                          <td>{getCategoryBadge(expense.category)}</td>
                          <td className="fw-bold">{formatCurrency(expense.amount)}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(expense.date)}
                          </td>
                          <td>{expense.vendor}</td>
                          <td>{getStatusBadge(expense.status)}</td>
                          <td>
                            {expense.receipt ? 
                              <FaReceipt className="text-success" title="Receipt Attached" /> : 
                              <span className="text-muted">-</span>
                            }
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${expense.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/financial/expenses/${expense.id}`}>
                                  <FaMoneyBillAlt className="me-2" /> View Details
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/financial/expenses/${expense.id}/edit`}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                {expense.status === 'pending' && (
                                  <Dropdown.Item>
                                    <FaCheck className="me-2" /> Approve
                                  </Dropdown.Item>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => confirmDelete(expense)}
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
                  {currentExpenses.map(expense => (
                    <Col md={4} key={expense.id} className="mb-4">
                      <Card className="h-100 shadow-sm border-top-0 border-end-0 border-bottom-0 border-3 
                                       border-start-0">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                          <div>{getCategoryBadge(expense.category)}</div>
                          {getStatusBadge(expense.status)}
                        </Card.Header>
                        <Card.Body>
                          <h5 className="mb-3 text-truncate" title={expense.description}>
                            {expense.description}
                          </h5>
                          
                          <div className="mb-3">
                            <div className="text-muted small">Vendor</div>
                            <div>{expense.vendor}</div>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <div className="text-muted small">Date</div>
                              <div>{formatDate(expense.date)}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Amount</div>
                              <div className="fw-bold">{formatCurrency(expense.amount)}</div>
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between">
                            <div>
                              <div className="text-muted small">Submitted By</div>
                              <div>{expense.submittedBy}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Receipt</div>
                              <div>
                                {expense.receipt ? 
                                  <FaReceipt className="text-success" title="Receipt Attached" /> : 
                                  <span className="text-muted">Not Attached</span>
                                }
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <div className="d-flex justify-content-between">
                            <Button as={Link} to={`/financial/expenses/${expense.id}`} variant="outline-primary" size="sm">
                              View
                            </Button>
                            <Button as={Link} to={`/financial/expenses/${expense.id}/edit`} variant="outline-secondary" size="sm">
                              Edit
                            </Button>
                            {expense.status === 'pending' && (
                              <Button variant="outline-success" size="sm">
                                Approve
                              </Button>
                            )}
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
          Are you sure you want to delete this expense for <strong>{expenseToDelete?.description}</strong>?
          
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Expense
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExpenseList;