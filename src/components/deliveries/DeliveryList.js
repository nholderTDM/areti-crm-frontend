import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, InputGroup, Row, Col, Badge, Modal, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PageTitle from '../common/PageTitle';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, 
         FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaBuilding, 
         FaFileExport, FaListUl, FaTh, FaChartBar } from 'react-icons/fa';

const DeliveryList = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [sortField, setSortField] = useState('scheduledDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deliveriesPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [showSummary, setShowSummary] = useState(true);
  
  // Delivery statuses
  const deliveryStatuses = [
    { value: 'scheduled', label: 'Scheduled', color: 'primary' },
    { value: 'in-progress', label: 'In Progress', color: 'info' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'delayed', label: 'Delayed', color: 'warning' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' },
    { value: 'failed', label: 'Failed', color: 'dark' }
  ];
  
  // Date filter options
  const dateFilterOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Mock data for deliveries
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
        
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const mockDeliveries = [
        {
          id: 1,
          deliveryId: 'DEL-10001',
          customer: {
            id: 1,
            name: 'ABC Logistics',
            contact: 'John Doe',
            phone: '(555) 123-4567'
          },
          pickupAddress: '123 Warehouse St, Atlanta, GA 30303',
          deliveryAddress: '456 Commerce Ave, Marietta, GA 30060',
          scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
          status: 'completed',
          driver: {
            id: 1,
            name: 'Michael Rodriguez',
            phone: '(555) 987-6543'
          },
          vehicle: 'Box Truck - AT-123',
          items: [
            { id: 1, description: 'Office Furniture', quantity: 5, weight: '250 lbs' },
            { id: 2, description: 'Electronics', quantity: 10, weight: '100 lbs' }
          ],
          notes: 'Customer requested delivery before noon. Access code for gate: 1234',
          signature: 'Jane Smith',
          completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 15),
          paymentStatus: 'paid',
          amount: 350.00,
          priority: 'standard',
          eta: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 45),
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
        },
        {
          id: 2,
          deliveryId: 'DEL-10002',
          customer: {
            id: 2,
            name: 'XYZ Retail',
            contact: 'Jane Smith',
            phone: '(555) 234-5678'
          },
          pickupAddress: '123 Warehouse St, Atlanta, GA 30303',
          deliveryAddress: '789 Retail Blvd, Alpharetta, GA 30009',
          scheduledDate: tomorrow,
          status: 'scheduled',
          driver: {
            id: 2,
            name: 'Sarah Johnson',
            phone: '(555) 876-5432'
          },
          vehicle: 'Sprinter Van - AT-456',
          items: [
            { id: 3, description: 'Clothing Items', quantity: 20, weight: '75 lbs' },
            { id: 4, description: 'Accessories', quantity: 15, weight: '25 lbs' }
          ],
          notes: 'Store opens at 9am. Contact store manager upon arrival.',
          signature: null,
          completedAt: null,
          paymentStatus: 'pending',
          amount: 225.00,
          priority: 'high',
          eta: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 30),
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
        },
        {
          id: 3,
          deliveryId: 'DEL-10003',
          customer: {
            id: 3,
            name: 'Tech Solutions Inc.',
            contact: 'Robert Brown',
            phone: '(555) 345-6789'
          },
          pickupAddress: '123 Warehouse St, Atlanta, GA 30303',
          deliveryAddress: '101 Tech Park, Norcross, GA 30092',
          scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
          status: 'in-progress',
          driver: {
            id: 3,
            name: 'David Wilson',
            phone: '(555) 765-4321'
          },
          vehicle: 'Cargo Van - AT-789',
          items: [
            { id: 5, description: 'Servers', quantity: 2, weight: '150 lbs' },
            { id: 6, description: 'Networking Equipment', quantity: 5, weight: '50 lbs' }
          ],
          notes: 'Fragile equipment. Requires IT staff signature.',
          signature: null,
          completedAt: null,
          paymentStatus: 'pending',
          amount: 400.00,
          priority: 'urgent',
          eta: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        },
        {
          id: 4,
          deliveryId: 'DEL-10004',
          customer: {
            id: 4,
            name: 'Global Shipping Co.',
            contact: 'Lisa Martinez',
            phone: '(555) 456-7890'
          },
          pickupAddress: '456 Port Terminal, Savannah, GA 31401',
          deliveryAddress: '123 Warehouse St, Atlanta, GA 30303',
          scheduledDate: nextWeek,
          status: 'scheduled',
          driver: {
            id: 1,
            name: 'Michael Rodriguez',
            phone: '(555) 987-6543'
          },
          vehicle: 'Semi Truck - AT-101',
          items: [
            { id: 7, description: 'Shipping Containers', quantity: 2, weight: '2000 lbs' }
          ],
          notes: 'Long-haul delivery from port. Special permits secured.',
          signature: null,
          completedAt: null,
          paymentStatus: 'pending',
          amount: 1200.00,
          priority: 'standard',
          eta: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 16, 0),
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)
        },
        {
          id: 5,
          deliveryId: 'DEL-10005',
          customer: {
            id: 5,
            name: 'Metro Electronics',
            contact: 'Daniel Clark',
            phone: '(555) 567-8901'
          },
          pickupAddress: '123 Warehouse St, Atlanta, GA 30303',
          deliveryAddress: '333 Electronic Way, Duluth, GA 30096',
          scheduledDate: today,
          status: 'delayed',
          driver: {
            id: 2,
            name: 'Sarah Johnson',
            phone: '(555) 876-5432'
          },
          vehicle: 'Sprinter Van - AT-456',
          items: [
            { id: 8, description: 'TV Sets', quantity: 3, weight: '180 lbs' },
            { id: 9, description: 'Sound Systems', quantity: 2, weight: '70 lbs' }
          ],
          notes: 'Delayed due to traffic accident on I-85. Customer notified of delay.',
          signature: null,
          completedAt: null,
          paymentStatus: 'pending',
          amount: 275.00,
          priority: 'high',
          eta: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        },
        {
          id: 6,
          deliveryId: 'DEL-10006',
          customer: {
            id: 6,
            name: 'Fresh Foods Distributors',
            contact: 'Emily Wilson',
            phone: '(555) 678-9012'
          },
          pickupAddress: '444 Farm Road, Macon, GA 31201',
          deliveryAddress: '555 Restaurant Row, Atlanta, GA 30308',
          scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          status: 'cancelled',
          driver: {
            id: 3,
            name: 'David Wilson',
            phone: '(555) 765-4321'
          },
          vehicle: 'Refrigerated Van - AT-202',
          items: [
            { id: 10, description: 'Fresh Produce', quantity: 15, weight: '250 lbs' }
          ],
          notes: 'Cancelled by customer due to restaurant closure.',
          signature: null,
          completedAt: null,
          paymentStatus: 'refunded',
          amount: 325.00,
          priority: 'standard',
          eta: null,
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
        },
        {
          id: 7,
          deliveryId: 'DEL-10007',
          customer: {
            id: 7,
            name: 'City Hospital',
            contact: 'Dr. James Taylor',
            phone: '(555) 789-0123'
          },
          pickupAddress: '123 Warehouse St, Atlanta, GA 30303',
          deliveryAddress: '777 Healthcare Ave, Atlanta, GA 30312',
          scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
          status: 'completed',
          driver: {
            id: 1,
            name: 'Michael Rodriguez',
            phone: '(555) 987-6543'
          },
          vehicle: 'Box Truck - AT-123',
          items: [
            { id: 11, description: 'Medical Supplies', quantity: 10, weight: '120 lbs' }
          ],
          notes: 'Priority medical delivery. Deliver to receiving department.',
          signature: 'Dr. James Taylor',
          completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 45),
          paymentStatus: 'paid',
          amount: 375.00,
          priority: 'urgent',
          eta: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        },
        {
          id: 8,
          deliveryId: 'DEL-10008',
          customer: {
            id: 3,
            name: 'Tech Solutions Inc.',
            contact: 'Robert Brown',
            phone: '(555) 345-6789'
          },
          pickupAddress: '123 Warehouse St, Atlanta, GA 30303',
          deliveryAddress: '101 Tech Park, Norcross, GA 30092',
          scheduledDate: tomorrow,
          status: 'scheduled',
          driver: {
            id: 3,
            name: 'David Wilson',
            phone: '(555) 765-4321'
          },
          vehicle: 'Cargo Van - AT-789',
          items: [
            { id: 12, description: 'Office Equipment', quantity: 8, weight: '200 lbs' }
          ],
          notes: 'Second delivery to Tech Park this week.',
          signature: null,
          completedAt: null,
          paymentStatus: 'pending',
          amount: 250.00,
          priority: 'standard',
          eta: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 30),
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)
        }
      ];
      
      setDeliveries(mockDeliveries);
      setFilteredDeliveries(mockDeliveries);
      
      // Extract unique drivers for filter
      const uniqueDrivers = [...new Set(mockDeliveries.map(delivery => delivery.driver.id))];
      const driverList = mockDeliveries
        .filter(delivery => uniqueDrivers.includes(delivery.driver.id))
        .map(delivery => ({
          id: delivery.driver.id,
          name: delivery.driver.name
        }))
        // Remove duplicates
        .filter((driver, index, self) => 
          index === self.findIndex(d => d.id === driver.id)
        );
      
      setDrivers(driverList);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort deliveries
  useEffect(() => {
    let result = [...deliveries];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(delivery => delivery.status === statusFilter);
    }
    
    // Apply driver filter
    if (driverFilter !== 'all') {
      result = result.filter(delivery => delivery.driver.id === parseInt(driverFilter));
    }
    
    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    switch (dateFilter) {
      case 'today':
        result = result.filter(delivery => {
          const deliveryDate = new Date(delivery.scheduledDate);
          deliveryDate.setHours(0, 0, 0, 0);
          return deliveryDate.getTime() === today.getTime();
        });
        break;
      case 'tomorrow':
        result = result.filter(delivery => {
          const deliveryDate = new Date(delivery.scheduledDate);
          deliveryDate.setHours(0, 0, 0, 0);
          return deliveryDate.getTime() === tomorrow.getTime();
        });
        break;
      case 'this-week':
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        
        result = result.filter(delivery => {
          const deliveryDate = new Date(delivery.scheduledDate);
          return deliveryDate >= today && deliveryDate <= endOfWeek;
        });
        break;
      case 'next-week':
        const startOfNextWeek = new Date(today);
        startOfNextWeek.setDate(today.getDate() + (7 - today.getDay()));
        
        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
        
        result = result.filter(delivery => {
          const deliveryDate = new Date(delivery.scheduledDate);
          return deliveryDate >= startOfNextWeek && deliveryDate <= endOfNextWeek;
        });
        break;
      case 'this-month':
        result = result.filter(delivery => {
          const deliveryDate = new Date(delivery.scheduledDate);
          return deliveryDate.getMonth() === today.getMonth() && 
                 deliveryDate.getFullYear() === today.getFullYear();
        });
        break;
      default:
        // 'all' or 'custom' (custom would need a date picker)
        break;
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(delivery => 
        delivery.deliveryId.toLowerCase().includes(search) ||
        delivery.customer.name.toLowerCase().includes(search) ||
        delivery.customer.contact.toLowerCase().includes(search) ||
        delivery.pickupAddress.toLowerCase().includes(search) ||
        delivery.deliveryAddress.toLowerCase().includes(search) ||
        delivery.driver.name.toLowerCase().includes(search)
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
      } else if (sortField === 'driver.name') {
        fieldA = a.driver.name;
        fieldB = b.driver.name;
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
    
    setFilteredDeliveries(result);
  }, [deliveries, searchTerm, statusFilter, driverFilter, dateFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastDelivery = currentPage * deliveriesPerPage;
  const indexOfFirstDelivery = indexOfLastDelivery - deliveriesPerPage;
  const currentDeliveries = filteredDeliveries.slice(indexOfFirstDelivery, indexOfLastDelivery);
  const totalPages = Math.ceil(filteredDeliveries.length / deliveriesPerPage);

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

  // Format time
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format datetime
  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  // Get status badge
  const getStatusBadge = (statusValue) => {
    const status = deliveryStatuses.find(s => s.value === statusValue);
    return status ? (
      <Badge bg={status.color} className="text-uppercase">
        {status.label}
      </Badge>
    ) : null;
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <Badge bg="danger">Urgent</Badge>;
      case 'high':
        return <Badge bg="warning">High</Badge>;
      case 'standard':
        return <Badge bg="info">Standard</Badge>;
      case 'low':
        return <Badge bg="secondary">Low</Badge>;
      default:
        return <Badge bg="light" text="dark">{priority}</Badge>;
    }
  };

  // Handle delete confirmation
  const confirmDelete = (delivery) => {
    setDeliveryToDelete(delivery);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (deliveryToDelete) {
      // In a real app, this would be an API call
      setDeliveries(deliveries.filter(d => d.id !== deliveryToDelete.id));
      setShowDeleteModal(false);
      setDeliveryToDelete(null);
    }
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    const totalDeliveries = deliveries.length;
    const scheduledDeliveries = deliveries.filter(d => d.status === 'scheduled').length;
    const inProgressDeliveries = deliveries.filter(d => d.status === 'in-progress').length;
    const completedDeliveries = deliveries.filter(d => d.status === 'completed').length;
    const delayedDeliveries = deliveries.filter(d => d.status === 'delayed').length;
    const cancelledDeliveries = deliveries.filter(d => d.status === 'cancelled').length;
    
    // Calculate today's deliveries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayDeliveries = deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.scheduledDate);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate.getTime() === today.getTime();
    }).length;
    
    return {
      totalDeliveries,
      scheduledDeliveries,
      inProgressDeliveries,
      completedDeliveries,
      delayedDeliveries,
      cancelledDeliveries,
      todayDeliveries
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

  // Render delivery summary
  const renderSummary = () => {
    const stats = getSummaryStats();
    
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-primary bg-opacity-10 rounded p-3 me-3">
                <FaTruck className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Deliveries</h6>
                <h3 className="mb-0">{stats.totalDeliveries}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-info bg-opacity-10 rounded p-3 me-3">
                <FaCalendarAlt className="text-info" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Today's Deliveries</h6>
                <h3 className="mb-0">{stats.todayDeliveries}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-success bg-opacity-10 rounded p-3 me-3">
                <FaTruck className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Completed</h6>
                <h3 className="mb-0">{stats.completedDeliveries}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-warning bg-opacity-10 rounded p-3 me-3">
                <FaTruck className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Delayed/Issues</h6>
                <h3 className="mb-0">{stats.delayedDeliveries + stats.cancelledDeliveries}</h3>
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
        title="Deliveries"
        backButton={false}
      />
      
      <div className="d-flex justify-content-end mb-4">
        <Button 
          variant="outline-primary"
          className="me-2"
          onClick={() => navigate('/deliveries/schedule')}
        >
          <FaCalendarAlt className="me-1" /> Schedule View
        </Button>
        <Button 
          variant="outline-primary"
          className="me-2"
          onClick={() => navigate('/deliveries/map')}
        >
          <FaMapMarkerAlt className="me-1" /> Map View
        </Button>
        <Button 
          variant="primary"
          onClick={() => navigate('/deliveries/new')}
        >
          <FaPlus className="me-1" /> Add Delivery
        </Button>
      </div>
      
      {showSummary && renderSummary()}
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search deliveries..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {deliveryStatuses.map(status => (
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
                  <FaUser />
                </InputGroup.Text>
                <Form.Select 
                  value={driverFilter}
                  onChange={(e) => setDriverFilter(e.target.value)}
                >
                  <option value="all">All Drivers</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
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
                  setStatusFilter('all');
                  setDriverFilter('all');
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
              <p className="mt-3">Loading deliveries...</p>
            </div>
          ) : (
            <>
              {filteredDeliveries.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No deliveries found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/deliveries/new')}
                  >
                    <FaPlus className="me-1" /> Add Delivery
                  </Button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('deliveryId')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          ID {sortField === 'deliveryId' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('customer.name')} style={{ cursor: 'pointer' }}>
                          Customer {sortField === 'customer.name' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('scheduledDate')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Scheduled Date {sortField === 'scheduledDate' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Addresses</th>
                        <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                          Status {sortField === 'status' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('driver.name')} style={{ cursor: 'pointer' }}>
                          Driver {sortField === 'driver.name' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Priority</th>
                        <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Amount {sortField === 'amount' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDeliveries.map(delivery => (
                        <tr key={delivery.id}>
                          <td>
                            <Link to={`/deliveries/${delivery.id}`} className="fw-bold text-decoration-none">
                              {delivery.deliveryId}
                            </Link>
                          </td>
                          <td>
                            <div>
                              <div className="fw-bold">{delivery.customer.name}</div>
                              <div className="text-muted small">{delivery.customer.contact}</div>
                            </div>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <div>{formatDate(delivery.scheduledDate)}</div>
                            <div className="text-muted small">{formatTime(delivery.scheduledDate)}</div>
                          </td>
                          <td>
                            <div className="small text-truncate" style={{ maxWidth: '200px' }}>
                              <div><strong>From:</strong> {delivery.pickupAddress}</div>
                              <div><strong>To:</strong> {delivery.deliveryAddress}</div>
                            </div>
                          </td>
                          <td>{getStatusBadge(delivery.status)}</td>
                          <td>
                            <div>{delivery.driver.name}</div>
                            <div className="text-muted small">{delivery.vehicle}</div>
                          </td>
                          <td>{getPriorityBadge(delivery.priority)}</td>
                          <td>${delivery.amount.toFixed(2)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${delivery.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/deliveries/${delivery.id}`}>
                                  <FaTruck className="me-2" /> View Details
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/deliveries/${delivery.id}/edit`}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/deliveries/${delivery.id}/track`}>
                                  <FaMapMarkerAlt className="me-2" /> Track
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => confirmDelete(delivery)}
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
                  {currentDeliveries.map(delivery => (
                    <Col md={4} key={delivery.id} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                          <span className="fw-bold">{delivery.deliveryId}</span>
                          {getStatusBadge(delivery.status)}
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-3">
                            <div className="fw-bold mb-1">{delivery.customer.name}</div>
                            <div className="text-muted small mb-2">
                              Contact: {delivery.customer.contact} | {delivery.customer.phone}
                            </div>
                            <div className="small mb-1">
                              <FaMapMarkerAlt className="me-1 text-muted" />
                              <strong>From:</strong> {delivery.pickupAddress}
                            </div>
                            <div className="small mb-1">
                              <FaMapMarkerAlt className="me-1 text-muted" />
                              <strong>To:</strong> {delivery.deliveryAddress}
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <div className="text-muted small">Scheduled</div>
                              <div>{formatDateTime(delivery.scheduledDate)}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Driver</div>
                              <div>{delivery.driver.name}</div>
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <div>{getPriorityBadge(delivery.priority)}</div>
                            <div className="fw-bold">${delivery.amount.toFixed(2)}</div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <div className="d-flex justify-content-between">
                            <Button as={Link} to={`/deliveries/${delivery.id}`} variant="outline-primary" size="sm">
                              View
                            </Button>
                            <Button as={Link} to={`/deliveries/${delivery.id}/track`} variant="outline-info" size="sm">
                              Track
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
          Are you sure you want to delete delivery <strong>{deliveryToDelete?.deliveryId}</strong> for{' '}
          <strong>{deliveryToDelete?.customer.name}</strong>?
          
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Delivery
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeliveryList;