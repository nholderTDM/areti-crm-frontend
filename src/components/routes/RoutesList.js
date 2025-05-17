// src/components/routes/RoutesList.js
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Row, Col, Badge, Modal, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, 
         FaRoute, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTruck, 
         FaFileExport, FaListUl, FaTh, FaExchangeAlt, FaDownload, FaMapMarked } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const RoutesList = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [routesPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);

  // Route statuses
  const routeStatuses = [
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'completed', label: 'Completed', color: 'info' },
    { value: 'scheduled', label: 'Scheduled', color: 'primary' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' },
    { value: 'delayed', label: 'Delayed', color: 'warning' }
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

  // Load routes data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      // Mock data for drivers
      const mockDrivers = [
        { id: 1, name: 'David Wilson' },
        { id: 2, name: 'Sarah Johnson' },
        { id: 3, name: 'Michael Brown' },
        { id: 4, name: 'Jennifer Davis' },
        { id: 5, name: 'Robert Martinez' }
      ];
      
      setDrivers(mockDrivers);
      
      // Mock data for routes
      const mockRoutes = [
        {
          id: 1,
          routeId: 'RT-10001',
          name: 'Downtown Atlanta Delivery Route',
          date: today,
          status: 'active',
          driver: mockDrivers[0],
          vehicle: 'Cargo Van - AT-789',
          startLocation: '123 Warehouse St, Atlanta, GA 30303',
          endLocation: '123 Warehouse St, Atlanta, GA 30303',
          stops: 8,
          distance: '32.5 miles',
          duration: '2 hours 15 minutes',
          deliveries: 12,
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)
        },
        {
          id: 2,
          routeId: 'RT-10002',
          name: 'Buckhead Business District Route',
          date: today,
          status: 'completed',
          driver: mockDrivers[1],
          vehicle: 'Box Truck - AT-456',
          startLocation: '123 Warehouse St, Atlanta, GA 30303',
          endLocation: '123 Warehouse St, Atlanta, GA 30303',
          stops: 6,
          distance: '28.3 miles',
          duration: '1 hour 50 minutes',
          deliveries: 9,
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)
        },
        {
          id: 3,
          routeId: 'RT-10003',
          name: 'Midtown Express Route',
          date: tomorrow,
          status: 'scheduled',
          driver: mockDrivers[2],
          vehicle: 'Cargo Van - AT-123',
          startLocation: '123 Warehouse St, Atlanta, GA 30303',
          endLocation: '123 Warehouse St, Atlanta, GA 30303',
          stops: 12,
          distance: '40.8 miles',
          duration: '2 hours 45 minutes',
          deliveries: 15,
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
        },
        {
          id: 4,
          routeId: 'RT-10004',
          name: 'Decatur Area Route',
          date: tomorrow,
          status: 'scheduled',
          driver: mockDrivers[3],
          vehicle: 'Box Truck - AT-789',
          startLocation: '123 Warehouse St, Atlanta, GA 30303',
          endLocation: '123 Warehouse St, Atlanta, GA 30303',
          stops: 7,
          distance: '35.2 miles',
          duration: '2 hours 10 minutes',
          deliveries: 10,
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)
        },
        {
          id: 5,
          routeId: 'RT-10005',
          name: 'Sandy Springs Commercial Route',
          date: nextWeek,
          status: 'scheduled',
          driver: mockDrivers[4],
          vehicle: 'Box Truck - AT-456',
          startLocation: '123 Warehouse St, Atlanta, GA 30303',
          endLocation: '123 Warehouse St, Atlanta, GA 30303',
          stops: 9,
          distance: '42.6 miles',
          duration: '2 hours 30 minutes',
          deliveries: 14,
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)
        },
        {
          id: 6,
          routeId: 'RT-10006',
          name: 'Marietta Express Route',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          status: 'completed',
          driver: mockDrivers[0],
          vehicle: 'Cargo Van - AT-123',
          startLocation: '123 Warehouse St, Atlanta, GA 30303',
          endLocation: '123 Warehouse St, Atlanta, GA 30303',
          stops: 10,
          distance: '38.9 miles',
          duration: '2 hours 20 minutes',
          deliveries: 13,
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
        }
      ];
      
      setRoutes(mockRoutes);
      setFilteredRoutes(mockRoutes);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort routes
  useEffect(() => {
    let result = [...routes];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(route => route.status === statusFilter);
    }
    
    // Apply driver filter
    if (driverFilter !== 'all') {
      const driverId = parseInt(driverFilter);
      result = result.filter(route => route.driver.id === driverId);
    }
    
    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay());
    
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(endOfThisWeek.getDate() + 6);
    
    const startOfNextWeek = new Date(endOfThisWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 1);
    
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);
    
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    switch (dateFilter) {
      case 'today':
        result = result.filter(route => {
          const routeDate = new Date(route.date);
          routeDate.setHours(0, 0, 0, 0);
          return routeDate.getTime() === today.getTime();
        });
        break;
      case 'tomorrow':
        result = result.filter(route => {
          const routeDate = new Date(route.date);
          routeDate.setHours(0, 0, 0, 0);
          return routeDate.getTime() === tomorrow.getTime();
        });
        break;
      case 'this-week':
        result = result.filter(route => {
          const routeDate = new Date(route.date);
          routeDate.setHours(0, 0, 0, 0);
          return routeDate >= startOfThisWeek && routeDate <= endOfThisWeek;
        });
        break;
      case 'next-week':
        result = result.filter(route => {
          const routeDate = new Date(route.date);
          routeDate.setHours(0, 0, 0, 0);
          return routeDate >= startOfNextWeek && routeDate <= endOfNextWeek;
        });
        break;
      case 'this-month':
        result = result.filter(route => {
          const routeDate = new Date(route.date);
          routeDate.setHours(0, 0, 0, 0);
          return routeDate >= startOfThisMonth && routeDate <= endOfThisMonth;
        });
        break;
      default:
        // 'all' or 'custom' (custom would need a date picker)
        break;
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(route => 
        route.routeId.toLowerCase().includes(search) ||
        route.name.toLowerCase().includes(search) ||
        route.driver.name.toLowerCase().includes(search) ||
        route.startLocation.toLowerCase().includes(search) ||
        route.endLocation.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle nested fields
      if (sortField === 'driver.name') {
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
    
    setFilteredRoutes(result);
  }, [routes, searchTerm, statusFilter, dateFilter, driverFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstRoute, indexOfLastRoute);
  const totalPages = Math.ceil(filteredRoutes.length / routesPerPage);

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

  // Get route status badge
  const getStatusBadge = (status) => {
    const routeStatus = routeStatuses.find(s => s.value === status);
    return routeStatus ? (
      <Badge bg={routeStatus.color} className="text-uppercase">
        {routeStatus.label}
      </Badge>
    ) : null;
  };

  // Handle delete confirmation
  const confirmDelete = (route) => {
    setRouteToDelete(route);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (routeToDelete) {
      // In a real app, this would be an API call
      setRoutes(routes.filter(r => r.id !== routeToDelete.id));
      setShowDeleteModal(false);
      setRouteToDelete(null);
    }
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const activeRoutes = routes.filter(r => r.status === 'active').length;
    const routesToday = routes.filter(r => {
      const routeDate = new Date(r.date);
      routeDate.setHours(0, 0, 0, 0);
      return routeDate.getTime() === today.getTime();
    }).length;
    
    const routesTomorrow = routes.filter(r => {
      const routeDate = new Date(r.date);
      routeDate.setHours(0, 0, 0, 0);
      return routeDate.getTime() === tomorrow.getTime();
    }).length;
    
    const totalDeliveries = routes.reduce((total, route) => total + route.deliveries, 0);
    
    return {
      totalRoutes: routes.length,
      activeRoutes,
      routesToday,
      routesTomorrow,
      totalDeliveries
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
                <FaRoute className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Routes</h6>
                <h3 className="mb-0">{stats.totalRoutes}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-success bg-opacity-10 rounded p-3 me-3">
                <FaRoute className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Active Routes</h6>
                <h3 className="mb-0">{stats.activeRoutes}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-info bg-opacity-10 rounded p-3 me-3">
                <FaRoute className="text-info" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Routes Today</h6>
                <h3 className="mb-0">{stats.routesToday}</h3>
                <div className="small text-muted">Tomorrow: {stats.routesTomorrow}</div>
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
                <h6 className="text-muted mb-1">Total Deliveries</h6>
                <h3 className="mb-0">{stats.totalDeliveries}</h3>
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
        title="Routes"
        backButton={true}
      />
      
      <div className="d-flex justify-content-end align-items-center mb-4">
        <Button 
          variant="outline-primary"
          className="me-2"
          onClick={() => navigate('/routes/map')}
        >
          <FaMapMarked className="me-1" /> Route Map
        </Button>
        <Button 
          variant="outline-success"
          className="me-2"
          onClick={() => navigate('/routes/optimize')}
        >
          <FaExchangeAlt className="me-1" /> Optimize Routes
        </Button>
        <Button 
          variant="primary"
          onClick={() => navigate('/routes/new')}
        >
          <FaPlus className="me-1" /> Create Route
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
                  placeholder="Search routes..."
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
                  {routeStatuses.map(status => (
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
            <Col md={1}>
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('all');
                  setDriverFilter('all');
                }}
              >
                Clear
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
              <p className="mt-3">Loading routes...</p>
            </div>
          ) : (
            <>
              {filteredRoutes.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No routes found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/routes/new')}
                  >
                    <FaPlus className="me-1" /> Create Route
                  </Button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('routeId')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Route ID {sortField === 'routeId' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                          Name {sortField === 'name' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Date {sortField === 'date' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('driver.name')} style={{ cursor: 'pointer' }}>
                          Driver {sortField === 'driver.name' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('stops')} style={{ cursor: 'pointer' }}>
                          Stops {sortField === 'stops' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('distance')} style={{ cursor: 'pointer' }}>
                          Distance {sortField === 'distance' && (
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
                      {currentRoutes.map(route => (
                        <tr key={route.id}>
                          <td>
                            <Link to={`/routes/${route.id}`} className="fw-bold text-decoration-none">
                              {route.routeId}
                            </Link>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {route.name}
                            </div>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(route.date)}
                          </td>
                          <td>{route.driver.name}</td>
                          <td>{route.stops}</td>
                          <td>{route.distance}</td>
                          <td>{getStatusBadge(route.status)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${route.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/routes/${route.id}`}>
                                  <FaRoute className="me-2" /> View Details
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/routes/${route.id}/map`}>
                                  <FaMapMarkerAlt className="me-2" /> View on Map
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/routes/${route.id}/edit`}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => confirmDelete(route)}
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
                  {currentRoutes.map(route => (
                    <Col md={4} key={route.id} className="mb-4">
                      <Card className="h-100 shadow-sm border-top-0 border-end-0 border-bottom-0 border-3 
                                       border-start-0">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                          <span className="fw-bold">{route.routeId}</span>
                          {getStatusBadge(route.status)}
                        </Card.Header>
                        <Card.Body>
                          <h5 className="mb-3">{route.name}</h5>
                          
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <div className="text-muted small">Date</div>
                              <div>{formatDate(route.date)}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Driver</div>
                              <div>{route.driver.name}</div>
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <div className="text-muted small">Stops</div>
                              <div>{route.stops}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Deliveries</div>
                              <div>{route.deliveries}</div>
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <div className="text-muted small">Distance</div>
                              <div>{route.distance}</div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Duration</div>
                              <div>{route.duration}</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-muted small">Start Location</div>
                            <div className="small text-truncate">{route.startLocation}</div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <div className="d-flex justify-content-between">
                            <Button 
                              as={Link} 
                              to={`/routes/${route.id}`} 
                              variant="outline-primary" 
                              size="sm"
                            >
                              View
                            </Button>
                            <Button 
                              as={Link} 
                              to={`/routes/${route.id}/map`} 
                              variant="outline-info" 
                              size="sm"
                            >
                              Map
                            </Button>
                            <Button 
                              as={Link} 
                              to={`/routes/${route.id}/edit`} 
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
          Are you sure you want to delete route <strong>{routeToDelete?.routeId}</strong> - <strong>{routeToDelete?.name}</strong>?
          
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Route
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoutesList;