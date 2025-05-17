import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Row, Col, Badge, Modal, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, 
         FaFileInvoice, FaEnvelope, FaCalendarAlt, FaUser, FaBuilding, 
         FaFileExport, FaListUl, FaTh, FaChartBar, FaDownload, FaPrint, FaCheck } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showPaymentReminderModal, setShowPaymentReminderModal] = useState(false);
  const [reminderMessage, setReminderMessage] = useState(
    'This is a friendly reminder that your invoice is currently overdue. Please process the payment at your earliest convenience.'
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  // Invoice statuses
  const invoiceStatuses = [
    { value: 'draft', label: 'Draft', color: 'secondary' },
    { value: 'sent', label: 'Sent', color: 'primary' },
    { value: 'viewed', label: 'Viewed', color: 'info' },
    { value: 'overdue', label: 'Overdue', color: 'danger' },
    { value: 'paid', label: 'Paid', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'dark' }
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

  // Load invoices data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const today = new Date();
        
      const mockInvoices = [
        {
          id: 1,
          invoiceNumber: 'INV-2025-001',
          customer: {
            id: 1,
            name: 'ABC Logistics',
            email: 'accounts@abclogistics.com'
          },
          amount: 3500.00,
          issueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
          status: 'sent',
          items: [
            { description: 'Regular Delivery Service - April', quantity: 20, unitPrice: 150, amount: 3000 },
            { description: 'Priority Handling Fee', quantity: 1, unitPrice: 500, amount: 500 }
          ]
        },
        {
          id: 2,
          invoiceNumber: 'INV-2025-002',
          customer: {
            id: 2,
            name: 'XYZ Retail',
            email: 'billing@xyzretail.com'
          },
          amount: 2800.00,
          issueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20),
          status: 'viewed',
          items: [
            { description: 'Regular Delivery Service - April', quantity: 15, unitPrice: 150, amount: 2250 },
            { description: 'Additional Mileage Fees', quantity: 50, unitPrice: 11, amount: 550 }
          ]
        },
        {
          id: 3,
          invoiceNumber: 'INV-2025-003',
          customer: {
            id: 3,
            name: 'Tech Solutions Inc.',
            email: 'ap@techsolutions.com'
          },
          amount: 4500.00,
          issueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
          status: 'overdue',
          items: [
            { description: 'Express Delivery Service - March', quantity: 25, unitPrice: 180, amount: 4500 }
          ]
        },
        {
          id: 4,
          invoiceNumber: 'INV-2025-004',
          customer: {
            id: 4,
            name: 'Global Shipping Co.',
            email: 'billing@globalshipping.com'
          },
          amount: 6750.00,
          issueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 45),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15),
          status: 'paid',
          items: [
            { description: 'Long Distance Delivery - March', quantity: 15, unitPrice: 350, amount: 5250 },
            { description: 'Special Handling', quantity: 10, unitPrice: 150, amount: 1500 }
          ],
          paidDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14)
        },
        {
          id: 5,
          invoiceNumber: 'INV-2025-005',
          customer: {
            id: 5,
            name: 'Metro Electronics',
            email: 'finance@metroelectronics.com'
          },
          amount: 1850.00,
          issueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 28),
          status: 'draft',
          items: [
            { description: 'Regular Delivery Service - April', quantity: 10, unitPrice: 150, amount: 1500 },
            { description: 'Insurance Fee', quantity: 1, unitPrice: 350, amount: 350 }
          ]
        },
        {
          id: 6,
          invoiceNumber: 'INV-2025-006',
          customer: {
            id: 1,
            name: 'ABC Logistics',
            email: 'accounts@abclogistics.com'
          },
          amount: 5250.00,
          issueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
          status: 'paid',
          items: [
            { description: 'Regular Delivery Service - February', quantity: 30, unitPrice: 150, amount: 4500 },
            { description: 'Weekend Delivery Surcharge', quantity: 5, unitPrice: 150, amount: 750 }
          ],
          paidDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 32)
        },
        {
          id: 7,
          invoiceNumber: 'INV-2025-007',
          customer: {
            id: 3,
            name: 'Tech Solutions Inc.',
            email: 'ap@techsolutions.com'
          },
          amount: 4200.00,
          issueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 25),
          status: 'sent',
          items: [
            { description: 'Express Delivery Service - April', quantity: 20, unitPrice: 180, amount: 3600 },
            { description: 'Packaging Materials', quantity: 20, unitPrice: 30, amount: 600 }
          ]
        }
      ];
      
      setInvoices(mockInvoices);
      setFilteredInvoices(mockInvoices);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort invoices
  useEffect(() => {
    let result = [...invoices];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(invoice => invoice.status === statusFilter);
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
        result = result.filter(invoice => {
          const issueDate = new Date(invoice.issueDate);
          issueDate.setHours(0, 0, 0, 0);
          return issueDate.getTime() === today.getTime();
        });
        break;
      case 'this-week':
        result = result.filter(invoice => {
          const issueDate = new Date(invoice.issueDate);
          return issueDate >= startOfThisWeek && issueDate < today.getTime() + 86400000;
        });
        break;
      case 'this-month':
        result = result.filter(invoice => {
          const issueDate = new Date(invoice.issueDate);
          return issueDate >= startOfThisMonth && issueDate < today.getTime() + 86400000;
        });
        break;
      case 'last-month':
        result = result.filter(invoice => {
          const issueDate = new Date(invoice.issueDate);
          return issueDate >= startOfLastMonth && issueDate <= endOfLastMonth;
        });
        break;
      case 'this-quarter':
        result = result.filter(invoice => {
          const issueDate = new Date(invoice.issueDate);
          return issueDate >= startOfThisQuarter && issueDate < today.getTime() + 86400000;
        });
        break;
      default:
        // 'all' or 'custom' (custom would need a date picker)
        break;
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(search) ||
        invoice.customer.name.toLowerCase().includes(search) ||
        invoice.customer.email.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle nested fields
      if (sortField === 'customer.name') {
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
    
    setFilteredInvoices(result);
  }, [invoices, searchTerm, statusFilter, dateFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

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

  // Get invoice status badge
  const getStatusBadge = (status) => {
    const invoiceStatus = invoiceStatuses.find(s => s.value === status);
    return invoiceStatus ? (
      <Badge bg={invoiceStatus.color} className="text-uppercase">
        {invoiceStatus.label}
      </Badge>
    ) : null;
  };

  // Handle delete confirmation
  const confirmDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (invoiceToDelete) {
      // In a real app, this would be an API call
      setInvoices(invoices.filter(i => i.id !== invoiceToDelete.id));
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedInvoices.length > 0) {
      // In a real app, this would be an API call
      setInvoices(invoices.filter(invoice => !selectedInvoices.includes(invoice.id)));
      setSelectedInvoices([]);
      setShowBulkDeleteModal(false);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (status) => {
    if (selectedInvoices.length > 0) {
      // In a real app, this would be an API call
      const updatedInvoices = invoices.map(invoice => {
        if (selectedInvoices.includes(invoice.id)) {
          return {
            ...invoice,
            status: status
          };
        }
        return invoice;
      });
      
      setInvoices(updatedInvoices);
      setSelectedInvoices([]);
    }
  };

  // Handle sending payment reminders
  const handleSendPaymentReminder = () => {
    // In a real app, this would send email reminders to selected invoices
    console.log('Sending payment reminder to:', selectedInvoices);
    console.log('Reminder message:', reminderMessage);
    
    // Close modal and clear selection
    setShowPaymentReminderModal(false);
    setSelectedInvoices([]);
    
    // Show success message (in a real app, this would be a toast notification)
    alert('Payment reminders have been sent successfully!');
  };

  // Calculate invoice stats
  const getInvoiceStats = () => {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = invoices.filter(i => i.status === 'overdue').length;
    const draft = invoices.filter(i => i.status === 'draft').length;
    const unpaid = invoices.filter(i => ['sent', 'viewed', 'overdue'].includes(i.status));
    const unpaidAmount = unpaid.reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      totalInvoices,
      totalAmount,
      overdue,
      draft,
      paid: invoices.filter(i => i.status === 'paid').length,
      unpaid: unpaid.length,
      unpaidAmount
    };
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInvoices(currentInvoices.map(invoice => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  // Handle select invoice
  const handleSelectInvoice = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter(invId => invId !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  // Export data
  const exportData = () => {
    // Prepare data for export
    const data = filteredInvoices.map(invoice => ({
      'Invoice Number': invoice.invoiceNumber,
      'Customer': invoice.customer.name,
      'Email': invoice.customer.email,
      'Issue Date': formatDate(invoice.issueDate),
      'Due Date': formatDate(invoice.dueDate),
      'Amount': formatCurrency(invoice.amount),
      'Status': invoice.status
    }));
    
    if (exportFormat === 'csv') {
      exportCSV(data);
    } else if (exportFormat === 'excel') {
      exportExcel(data);
    } else if (exportFormat === 'pdf') {
      exportPDF(data);
    }
    
    setShowExportModal(false);
  };

  // Export as CSV
  const exportCSV = (data) => {
    // Create CSV header
    const headers = Object.keys(data[0]);
    let csvContent = headers.join(',') + '\n';
    
    // Add rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        const formattedValue = value.toString().includes(',') ? 
          `"${value.toString().replace(/"/g, '""')}"` : 
          value;
        return formattedValue;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_${new Date().toISOString().substring(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as Excel (simplified mock)
  const exportExcel = (data) => {
    alert('Excel export functionality would be implemented with a library like xlsx in a real application.');
    console.log('Exporting as Excel:', data);
  };

  // Export as PDF (simplified mock)
  const exportPDF = (data) => {
    alert('PDF export functionality would be implemented with a library like jspdf in a real application.');
    console.log('Exporting as PDF:', data);
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

  // Render invoice summary
  const renderSummary = () => {
    const stats = getInvoiceStats();
    
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-primary bg-opacity-10 rounded p-3 me-3">
                <FaFileInvoice className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Invoices</h6>
                <h3 className="mb-0">{stats.totalInvoices}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-success bg-opacity-10 rounded p-3 me-3">
                <FaFileInvoice className="text-success" size={24} />
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
              <div className="icon-wrapper bg-warning bg-opacity-10 rounded p-3 me-3">
                <FaFileInvoice className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Unpaid Invoices</h6>
                <h3 className="mb-0">{stats.unpaid}</h3>
                <div className="small text-muted">{formatCurrency(stats.unpaidAmount)}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-danger bg-opacity-10 rounded p-3 me-3">
                <FaFileInvoice className="text-danger" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Overdue Invoices</h6>
                <h3 className="mb-0">{stats.overdue}</h3>
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
        title="Invoices"
        backButton={true}
      />
      
      <div className="d-flex justify-content-end align-items-center mb-4">
        <Button 
          variant="outline-primary"
          className="me-2"
          onClick={() => window.open('/financial/invoices/report', '_blank')}
        >
          <FaChartBar className="me-1" /> Invoice Reports
        </Button>
        <Button 
          variant="outline-success"
          className="me-2"
          onClick={() => setShowExportModal(true)}
        >
          <FaDownload className="me-1" /> Export
        </Button>
        <Button 
          variant="primary"
          onClick={() => navigate('/financial/invoices/new')}
        >
          <FaPlus className="me-1" /> Create Invoice
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
                  placeholder="Search invoices..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {invoiceStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
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
          
          {selectedInvoices.length > 0 && (
            <div className="bg-light p-2 mb-3 d-flex align-items-center">
              <span className="me-2">
                <strong>{selectedInvoices.length}</strong> invoices selected
              </span>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => setShowPaymentReminderModal(true)}
              >
                <FaEnvelope className="me-1" /> Send Reminder
              </Button>
              <Button 
                variant="outline-success" 
                size="sm" 
                className="me-2"
                onClick={() => handleBulkStatusUpdate('paid')}
              >
                <FaCheck className="me-1" /> Mark as Paid
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => setShowBulkDeleteModal(true)}
              >
                <FaTrash className="me-1" /> Delete Selected
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading invoices...</p>
            </div>
          ) : (
            <>
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No invoices found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/financial/invoices/new')}
                  >
                    <FaPlus className="me-1" /> Create Invoice
                  </Button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th>
                          <Form.Check
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              currentInvoices.length > 0 && 
                              currentInvoices.every(invoice => 
                                selectedInvoices.includes(invoice.id)
                              )
                            }
                          />
                        </th>
                        <th onClick={() => handleSort('invoiceNumber')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Invoice # {sortField === 'invoiceNumber' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('customer.name')} style={{ cursor: 'pointer' }}>
                          Customer {sortField === 'customer.name' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('issueDate')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Issue Date {sortField === 'issueDate' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Due Date {sortField === 'dueDate' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Amount {sortField === 'amount' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
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
                      {currentInvoices.map(invoice => (
                        <tr key={invoice.id}>
                          <td>
                            <Form.Check
                              type="checkbox"
                              checked={selectedInvoices.includes(invoice.id)}
                              onChange={() => handleSelectInvoice(invoice.id)}
                            />
                          </td>
                          <td>
                            <Link to={`/financial/invoices/${invoice.id}`} className="fw-bold text-decoration-none">
                              {invoice.invoiceNumber}
                            </Link>
                          </td>
                          <td>
                            <div>
                              <div className="fw-bold">{invoice.customer.name}</div>
                              <div className="text-muted small">{invoice.customer.email}</div>
                            </div>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(invoice.issueDate)}
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(invoice.dueDate)}
                          </td>
                          <td className="fw-bold">{formatCurrency(invoice.amount)}</td>
                          <td>{getStatusBadge(invoice.status)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${invoice.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/financial/invoices/${invoice.id}`}>
                                  <FaFileInvoice className="me-2" /> View Invoice
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/financial/invoices/${invoice.id}/edit`}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => window.open(`/financial/invoices/${invoice.id}/print`, '_blank')}>
                                  <FaPrint className="me-2" /> Print
                                </Dropdown.Item>
                                <Dropdown.Item>
                                  <FaEnvelope className="me-2" /> Send Email
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => confirmDelete(invoice)}
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
                  {currentInvoices.map(invoice => (
                    <Col md={4} key={invoice.id} className="mb-4">
                      <Card className="h-100 shadow-sm border-top-0 border-end-0 border-bottom-0 border-3 
                                     border-start-0">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                          <div className="d-flex align-items-center">
                            <Form.Check
                              type="checkbox"
                              className="me-2"
                              checked={selectedInvoices.includes(invoice.id)}
                              onChange={() => handleSelectInvoice(invoice.id)}
                            />
                            <span className="fw-bold">{invoice.invoiceNumber}</span>
                          </div>
                          {getStatusBadge(invoice.status)}
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-3">
                            <div className="text-muted small">Customer</div>
                            <div className="fw-bold">{invoice.customer.name}</div>
                            <div className="small">{invoice.customer.email}</div>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <div className="text-muted small">Issue Date</div>
                              <div>{formatDate(invoice.issueDate)}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Due Date</div>
                              <div>{formatDate(invoice.dueDate)}</div>
                            </div>
                          </div>
                          
                          <div className="text-center mb-3">
                            <div className="text-muted small">Amount</div>
                            <div className="fs-4 fw-bold">{formatCurrency(invoice.amount)}</div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <div className="d-flex justify-content-between">
                            <Button as={Link} to={`/financial/invoices/${invoice.id}`} variant="outline-primary" size="sm">
                              View
                            </Button>
                            <Button as={Link} to={`/financial/invoices/${invoice.id}/edit`} variant="outline-secondary" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <FaEnvelope className="me-1" /> Send
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
          Are you sure you want to delete invoice <strong>{invoiceToDelete?.invoiceNumber}</strong> for{' '}
          <strong>{invoiceToDelete?.customer.name}</strong>?
          
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Invoice
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Bulk Delete Confirmation Modal */}
      <Modal show={showBulkDeleteModal} onHide={() => setShowBulkDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Bulk Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedInvoices.length}</strong> selected invoice{selectedInvoices.length !== 1 ? 's' : ''}?
          
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleBulkDelete}>
            Delete Invoices
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Payment Reminder Modal */}
      <Modal show={showPaymentReminderModal} onHide={() => setShowPaymentReminderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Payment Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to send payment reminders for <strong>{selectedInvoices.length}</strong> invoice{selectedInvoices.length !== 1 ? 's' : ''}.
          </p>
          
          <Form.Group className="mb-3">
            <Form.Label>Reminder Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
            />
            <Form.Text className="text-muted">
              This message will be included in the reminder emails.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Recipients</Form.Label>
            <div className="p-2 border rounded bg-light">
              {selectedInvoices.map(id => {
                const invoice = invoices.find(inv => inv.id === id);
                return invoice ? (
                  <div key={invoice.id} className="mb-1">
                    {invoice.customer.email} ({invoice.customer.name}, {invoice.invoiceNumber})
                  </div>
                ) : null;
              })}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentReminderModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSendPaymentReminder}>
            <FaEnvelope className="me-1" /> Send Reminders
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Export Modal */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Export Invoices</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to export <strong>{filteredInvoices.length}</strong> invoice{filteredInvoices.length !== 1 ? 's' : ''}.
          </p>
          
          <Form.Group className="mb-3">
            <Form.Label>Export Format</Form.Label>
            <Form.Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="csv">CSV (.csv)</option>
              <option value="excel">Excel (.xlsx)</option>
              <option value="pdf">PDF (.pdf)</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Fields to Export</Form.Label>
            <div className="p-2 border rounded bg-light">
              <div className="mb-1">Invoice Number</div>
              <div className="mb-1">Customer</div>
              <div className="mb-1">Email</div>
              <div className="mb-1">Issue Date</div>
              <div className="mb-1">Due Date</div>
              <div className="mb-1">Amount</div>
              <div>Status</div>
            </div>
            <Form.Text className="text-muted">
              All fields will be included in the export.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={exportData}>
            <FaDownload className="me-1" /> Export
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoiceList;