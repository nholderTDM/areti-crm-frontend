// src/components/routes/RouteDetail.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, ListGroup, Table, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaRoute, FaMapMarkedAlt, FaUser, FaTruck, FaCalendarAlt, 
         FaClock, FaMapMarkerAlt, FaDirections, FaPencilAlt, FaPrint, 
         FaExchangeAlt, FaShippingFast } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const RouteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load route data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock data for the route
      const today = new Date();
      
      const mockRoute = {
        id: parseInt(id),
        routeId: 'RT-10001',
        name: 'Downtown Atlanta Delivery Route',
        date: today,
        status: 'active',
        driver: {
          id: 1,
          name: 'David Wilson',
          phone: '(555) 765-4321',
          email: 'david.wilson@aretialliance.com'
        },
        vehicle: {
          id: 3,
          name: 'Cargo Van - AT-789',
          type: 'Cargo Van',
          licensePlate: 'AT-789',
          capacity: '1,000 lbs'
        },
        startLocation: '123 Warehouse St, Atlanta, GA 30303',
        endLocation: '123 Warehouse St, Atlanta, GA 30303',
        stops: [
          {
            id: 1,
            address: '123 Warehouse St, Atlanta, GA 30303',
            type: 'depot',
            status: 'completed',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
            actualTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
            notes: 'Route start - loading completed'
          },
          {
            id: 2,
            address: '101 Marietta St NW, Atlanta, GA 30303',
            type: 'delivery',
            status: 'completed',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
            actualTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 35),
            customer: 'Peachtree Office Supplies',
            contact: 'Sarah Johnson',
            phone: '(555) 123-4567',
            deliveryId: 'DEL-10015',
            notes: 'Leave packages at front desk'
          },
          {
            id: 3,
            address: '55 Park Place NE, Atlanta, GA 30303',
            type: 'delivery',
            status: 'completed',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
            actualTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 5),
            customer: 'GSU Business School',
            contact: 'Robert Chen',
            phone: '(555) 234-5678',
            deliveryId: 'DEL-10016',
            notes: 'Signature required from recipient'
          },
          {
            id: 4,
            address: '100 Piedmont Ave NE, Atlanta, GA 30303',
            type: 'delivery',
            status: 'completed',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
            actualTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 45),
            customer: 'Student Center',
            contact: 'James Wilson',
            phone: '(555) 345-6789',
            deliveryId: 'DEL-10017',
            notes: 'Deliver to loading dock in rear'
          },
          {
            id: 5,
            address: '30 Pryor St SW, Atlanta, GA 30303',
            type: 'delivery',
            status: 'in-progress',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
            actualTime: null,
            customer: 'City Law Offices',
            contact: 'Amanda Garcia',
            phone: '(555) 456-7890',
            deliveryId: 'DEL-10018',
            notes: 'Call customer upon arrival'
          },
          {
            id: 6,
            address: '200 Peachtree St NE, Atlanta, GA 30303',
            type: 'delivery',
            status: 'pending',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
            actualTime: null,
            customer: 'Downtown Hotel',
            contact: 'Michael Brown',
            phone: '(555) 567-8901',
            deliveryId: 'DEL-10019',
            notes: 'Deliver to concierge'
          },
          {
            id: 7,
            address: '265 Park Ave W NW, Atlanta, GA 30313',
            type: 'delivery',
            status: 'pending',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
            actualTime: null,
            customer: 'Centennial Park Offices',
            contact: 'David Lee',
            phone: '(555) 678-9012',
            deliveryId: 'DEL-10020',
            notes: 'Security check required at entrance'
          },
          {
            id: 8,
            address: '190 Marietta St NW, Atlanta, GA 30303',
            type: 'delivery',
            status: 'pending',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
            actualTime: null,
            customer: 'CNN Center',
            contact: 'Lisa Miller',
            phone: '(555) 789-0123',
            deliveryId: 'DEL-10021',
            notes: 'Visitor badge will be provided at security'
          },
          {
            id: 9,
            address: '123 Warehouse St, Atlanta, GA 30303',
            type: 'depot',
            status: 'pending',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
            actualTime: null,
            notes: 'Route end - return to warehouse'
          }
        ],
        distance: '32.5 miles',
        duration: '4 hours 30 minutes',
        deliveries: 7,
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      };
      
      setRoute(mockRoute);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Format time
  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Format datetime
  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusColors = {
      'active': 'success',
      'completed': 'info',
      'scheduled': 'primary',
      'cancelled': 'danger',
      'delayed': 'warning',
      'in-progress': 'success',
      'pending': 'secondary'
    };
    
    const statusLabels = {
      'active': 'Active',
      'completed': 'Completed',
      'scheduled': 'Scheduled',
      'cancelled': 'Cancelled',
      'delayed': 'Delayed',
      'in-progress': 'In Progress',
      'pending': 'Pending'
    };
    
    return (
      <Badge bg={statusColors[status] || 'secondary'} className="text-uppercase">
        {statusLabels[status] || status}
      </Badge>
    );
  };

  // Get stop type badge
  const getStopTypeBadge = (type) => {
    const typeColors = {
      'depot': 'dark',
      'delivery': 'primary',
      'pickup': 'info'
    };
    
    const typeLabels = {
      'depot': 'Depot',
      'delivery': 'Delivery',
      'pickup': 'Pickup'
    };
    
    return (
      <Badge bg={typeColors[type] || 'secondary'} className="text-uppercase">
        {typeLabels[type] || type}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading route details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={`Route ${route.routeId}`}
        subtitle={route.name}
        backButton={true}
      />
      
      <div className="d-flex justify-content-end mb-4">
        <Button variant="outline-info" className="me-2" onClick={() => navigate(`/routes/${id}/map`)}>
          <FaMapMarkedAlt className="me-1" /> View on Map
        </Button>
        <Button variant="outline-secondary" className="me-2" onClick={() => window.print()}>
          <FaPrint className="me-1" /> Print
        </Button>
        <Button variant="outline-primary" className="me-2" onClick={() => navigate(`/routes/${id}/edit`)}>
          <FaPencilAlt className="me-1" /> Edit Route
        </Button>
        <Button variant="primary" onClick={() => navigate(`/routes/optimize?routeId=${id}`)}>
          <FaExchangeAlt className="me-1" /> Optimize Route
        </Button>
      </div>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Route Stops</h5>
                <div>{getStatusBadge(route.status)}</div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="route-map-preview mb-3 bg-light p-4 text-center">
                <p className="text-muted">Map visualization would be displayed here</p>
                <p className="mb-0 small text-muted">Distance: {route.distance} | Duration: {route.duration}</p>
              </div>
              
              <ListGroup variant="flush">
                {route.stops.map((stop, index) => (
                  <ListGroup.Item key={stop.id} className="p-3">
                    <div className="d-flex">
                      <div className="me-3 text-center">
                        <div className="timeline-icon mb-2 rounded-circle bg-light p-2">
                          {stop.type === 'depot' ? (
                            <FaMapMarkerAlt className="text-dark" />
                          ) : stop.type === 'delivery' ? (
                            <FaShippingFast className="text-primary" />
                          ) : (
                            <FaTruck className="text-info" />
                          )}
                        </div>
                        <div className="small text-muted">Stop {index + 1}</div>
                      </div>
                      
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-0">
                              {stop.customer || (stop.type === 'depot' ? 'Depot / Warehouse' : stop.address)}
                            </h6>
                            <div className="text-muted small">{stop.address}</div>
                          </div>
                          <div className="d-flex">
                            {getStopTypeBadge(stop.type)}
                            <div className="ms-2">{getStatusBadge(stop.status)}</div>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between mb-2">
                          <div>
                            <div className="text-muted small">Scheduled Time</div>
                            <div>{formatTime(stop.scheduledTime)}</div>
                          </div>
                          <div className="text-end">
                            <div className="text-muted small">Actual Time</div>
                            <div>{stop.actualTime ? formatTime(stop.actualTime) : 'Pending'}</div>
                          </div>
                        </div>
                        
                        {stop.type === 'delivery' && (
                          <div className="mb-2">
                            <div className="text-muted small">Contact</div>
                            <div>{stop.contact} | {stop.phone}</div>
                            <div>
                              <Link to={`/deliveries/${stop.deliveryId.split('-')[1]}`}>
                                {stop.deliveryId}
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {stop.notes && (
                          <div className="mt-2 bg-light p-2 rounded small">
                            <strong>Notes:</strong> {stop.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Route Information</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="p-3">
                  <div className="text-muted small">Route ID</div>
                  <div className="fw-bold">{route.routeId}</div>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <div className="text-muted small">Route Name</div>
                  <div>{route.name}</div>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <div className="text-muted small">Date</div>
                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="text-primary me-2" />
                    <span>{formatDate(route.date)}</span>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <div className="text-muted small">Driver</div>
                  <div className="d-flex align-items-center">
                    <FaUser className="text-primary me-2" />
                    <div>
                      <div>{route.driver.name}</div>
                      <div className="small text-muted">{route.driver.phone}</div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <div className="text-muted small">Vehicle</div>
                  <div className="d-flex align-items-center">
                    <FaTruck className="text-primary me-2" />
                    <div>
                      <div>{route.vehicle.name}</div>
                      <div className="small text-muted">Capacity: {route.vehicle.capacity}</div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <Row>
                    <Col xs={6}>
                      <div className="text-muted small">Distance</div>
                      <div>{route.distance}</div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-muted small">Duration</div>
                      <div>{route.duration}</div>
                    </Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <Row>
                    <Col xs={6}>
                      <div className="text-muted small">Stops</div>
                      <div>{route.stops.length}</div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-muted small">Deliveries</div>
                      <div>{route.deliveries}</div>
                    </Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <div className="text-muted small">Status</div>
                  <div>{getStatusBadge(route.status)}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Route Timeline</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="p-3">
                  <div className="timeline-item d-flex">
                    <div className="timeline-icon bg-primary rounded-circle p-2 me-3">
                      <FaRoute className="text-white" size={14} />
                    </div>
                    <div className="timeline-content">
                      <div className="fw-bold">Route Created</div>
                      <div className="text-muted small">{formatDateTime(route.createdAt)}</div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <div className="timeline-item d-flex">
                    <div className="timeline-icon bg-info rounded-circle p-2 me-3">
                      <FaPencilAlt className="text-white" size={14} />
                    </div>
                    <div className="timeline-content">
                      <div className="fw-bold">Route Updated</div>
                      <div className="text-muted small">{formatDateTime(route.updatedAt)}</div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <div className="timeline-item d-flex">
                    <div className="timeline-icon bg-success rounded-circle p-2 me-3">
                      <FaMapMarkerAlt className="text-white" size={14} />
                    </div>
                    <div className="timeline-content">
                      <div className="fw-bold">Route Started</div>
                      <div className="text-muted small">{formatDateTime(route.stops[0].actualTime)}</div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                {route.status === 'active' && (
                  <ListGroup.Item className="p-3">
                    <div className="timeline-item d-flex">
                      <div className="timeline-icon bg-warning rounded-circle p-2 me-3">
                        <FaTruck className="text-white" size={14} />
                      </div>
                      <div className="timeline-content">
                        <div className="fw-bold">Route In Progress</div>
                        <div className="text-muted small">
                          {route.stops.filter(s => s.status === 'completed').length} of {route.stops.length} stops completed
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RouteDetail;