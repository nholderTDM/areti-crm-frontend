// src/components/activities/ActivitiesList.js
import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Alert, Form, InputGroup, Row, Col, Button, Pagination } from 'react-bootstrap';
import { FaSearch, FaFilter, FaUser, FaTruck, FaFileInvoice, FaCommentDots, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PhoneContact from '../common/PhoneContact';
import PageTitle from '../common/PageTitle';

const ActivitiesList = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage] = useState(20);
  
  // Activity types
  const activityTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'lead', label: 'Lead Activity' },
    { value: 'delivery', label: 'Delivery Activity' },
    { value: 'invoice', label: 'Invoice Activity' },
    { value: 'note', label: 'Notes' },
    { value: 'call', label: 'Calls' }
  ];
  
  // Date range options
  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];
  
  // Fetch activities from the API
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/activities');
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the received data
        setActivities(data);
        setFilteredActivities(data);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
        
        // Optionally set some fallback data
        setActivities([]);
        setFilteredActivities([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    let result = [...activities];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(activity => 
        (activity.action && activity.action.toLowerCase().includes(search)) ||
        (activity.subject && activity.subject.toLowerCase().includes(search))
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(activity => activity.type === typeFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (dateFilter === 'today') {
        result = result.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          return activityDate >= today;
        });
      } else if (dateFilter === 'yesterday') {
        result = result.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          return activityDate >= yesterday && activityDate < today;
        });
      } else if (dateFilter === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of current week (Sunday)
        
        result = result.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          return activityDate >= weekStart;
        });
      } else if (dateFilter === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        result = result.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          return activityDate >= monthStart;
        });
      } else if (dateFilter === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of the selected day
        
        result = result.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          return activityDate >= start && activityDate <= end;
        });
      }
    }
    
    // Sort by timestamp (newest first)
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredActivities(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activities, searchTerm, typeFilter, dateFilter, startDate, endDate]);
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const date = new Date(timestamp);
    
    if (date >= today) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date >= yesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
        ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setDateFilter('all');
    setStartDate('');
    setEndDate('');
  };
  
  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead':
        return <FaUser />;
      case 'delivery':
        return <FaTruck />;
      case 'invoice':
        return <FaFileInvoice />;
      case 'note':
        return <FaCommentDots />;
      case 'call':
        return <FaPhone />;
      default:
        return <FaCommentDots />;
    }
  };
  
  // Get activity icon color
  const getIconColor = (type) => {
    switch (type) {
      case 'lead':
        return 'primary';
      case 'delivery':
        return 'info';
      case 'invoice':
        return 'success';
      case 'note':
        return 'warning';
      case 'call':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  
  const handleActivityClick = (link) => {
    navigate(link);
  };
  
  // Pagination logic
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = filteredActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);
  
  // Generate pagination items
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    let items = [];
    
    // Previous button
    items.push(
      <Pagination.Item 
        key="prev" 
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Pagination.Item>
    );
    
    // Page numbers
    // Show first page, last page, and pages around current page
    const showPages = [];
    
    showPages.push(1);
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!showPages.includes(i)) {
        showPages.push(i);
      }
    }
    
    if (totalPages > 1) {
      showPages.push(totalPages);
    }
    
    // Sort and add ellipsis
    showPages.sort((a, b) => a - b);
    
    let prevPage = 0;
    for (const page of showPages) {
      if (page - prevPage > 1) {
        items.push(<Pagination.Ellipsis key={`ellipsis-${page}`} disabled />);
      }
      
      items.push(
        <Pagination.Item 
          key={page} 
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
      
      prevPage = page;
    }
    
    // Next button
    items.push(
      <Pagination.Item 
        key="next" 
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Pagination.Item>
    );
    
    return <Pagination>{items}</Pagination>;
  };
  
  return (
    <Container fluid className="py-4">
      <PageTitle 
        title="Activity Log"
        subtitle="View and filter all system activities"
        backButton={true}
      />
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col lg={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col lg={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <Form.Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col lg={2}>
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
          
          {dateFilter === 'custom' && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0">Activity Log</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading activities...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="m-3">
              {error}
            </Alert>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No activities found matching your filters.</p>
              <Button variant="outline-primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <ListGroup variant="flush">
              {currentActivities.map((activity) => (
                <ListGroup.Item 
                  key={activity.id} 
                  className="px-4 py-3 border-start-0 border-end-0"
                  onClick={activity.link ? () => handleActivityClick(activity.link) : undefined}
                  style={activity.link ? { cursor: 'pointer' } : undefined}
                >
                  <div className="d-flex">
                    <div className={`me-3 text-${getIconColor(activity.type)}`}>
                      {activity.icon || getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{activity.action}</div>
                      <div>{activity.subject}</div>
                      <div className="text-muted small mt-1">{formatTimestamp(activity.timestamp)}</div>
                      {activity.type === 'call' && activity.phoneNumber && (
                        <div className="mt-1">
                          <PhoneContact phoneNumber={activity.phoneNumber} buttonVariant="outline-secondary" showSms={false} />
                        </div>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
        <Card.Footer className="bg-white border-top-0 d-flex justify-content-center">
          {renderPagination()}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ActivitiesList;