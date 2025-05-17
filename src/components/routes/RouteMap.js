// src/components/routes/RouteMap.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaRoute, FaMapMarkedAlt, FaUser, FaTruck, FaCalendarAlt, 
         FaClock, FaMapMarkerAlt, FaDirections, FaPencilAlt, FaPrint, 
         FaExchangeAlt, FaShippingFast } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const RouteMap = () => {
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
            notes: 'Leave packages at front desk',
            coordinates: { lat: 33.7564, lng: -84.3902 }
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
            notes: 'Signature required from recipient',
            coordinates: { lat: 33.7558, lng: -84.3856 }
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
            notes: 'Deliver to loading dock in rear',
            coordinates: { lat: 33.7530, lng: -84.3845 }
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
            notes: 'Call customer upon arrival',
            coordinates: { lat: 33.7533, lng: -84.3903 }
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
            notes: 'Deliver to concierge',
            coordinates: { lat: 33.7592, lng: -84.3871 }
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
            notes: 'Security check required at entrance',
            coordinates: { lat: 33.7615, lng: -84.3935 }
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
            notes: 'Visitor badge will be provided at security',
            coordinates: { lat: 33.7590, lng: -84.3944 }
          },
          {
            id: 9,
            address: '123 Warehouse St, Atlanta, GA 30303',
            type: 'depot',
            status: 'pending',
            scheduledTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
            actualTime: null,
            notes: 'Route end - return to warehouse',
            coordinates: { lat: 33.7528, lng: -84.3945 }
          }
        ],
        distance: '32.5 miles',
        duration: '4 hours 30 minutes',
        deliveries: 7,
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        currentLocation: {
          lat: 33.7533,
          lng: -84.3903,
          updatedAt: new Date(),
          status: 'in-progress'
        },
        progress: 55
      };
      
      setRoute(mockRoute);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Format time
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
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

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading route map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={`Route Map: ${route.routeId}`}
        subtitle={route.name}
        backButton={true}
      />
      
      <div className="d-flex justify-content-end mb-4">
        <Button variant="outline-primary" className="me-2" onClick={() => navigate(`/routes/${id}`)}>
          <FaRoute className="me-1" /> View Route Details
        </Button>
        <Button variant="outline-secondary" className="me-2" onClick={() => window.print()}>
          <FaPrint className="me-1" /> Print Map
        </Button>
        <Button variant="primary" onClick={() => navigate(`/routes/${id}/edit`)}>
          <FaPencilAlt className="me-1" /> Edit Route
        </Button>
      </div>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="route-map-container" style={{ height: '600px' }}>
                <div className="bg-light h-100 d-flex flex-column justify-content-center align-items-center">
                  <FaMapMarkedAlt size={48} className="text-primary mb-3" />
                  <h5>Interactive Map</h5>
                  <p className="text-muted">A real map integration would be displayed here</p>
                  <p className="text-muted">Showing route with {route.stops.length} stops</p>
                  <div className="mt-3">
                    <div className="d-flex align-items-center mb-2">
                      <div style={{ width: '20px', height: '20px', backgroundColor: '#198754', borderRadius: '50%', marginRight: '10px' }}></div>
                      <span>Completed Stops ({route.stops.filter(s => s.status === 'completed').length})</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <div style={{ width: '20px', height: '20px', backgroundColor: '#0d6efd', borderRadius: '50%', marginRight: '10px' }}></div>
                      <span>Current Stop (1)</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div style={{ width: '20px', height: '20px', backgroundColor: '#6c757d', borderRadius: '50%', marginRight: '10px' }}></div>
                      <span>Pending Stops ({route.stops.filter(s => s.status === 'pending').length})</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="route-progress mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>Route Progress</div>
                  <div>{route.progress}%</div>
                </div>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${route.progress}%` }}
                    aria-valuenow={route.progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <div>Start: {formatTime(route.stops[0].scheduledTime)}</div>
                  <div>Current Time</div>
                  <div>End: {formatTime(route.stops[route.stops.length-1].scheduledTime)}</div>
                </div>
              </div>
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
                  <div className="text-muted small">Status</div>
                  <div>{getStatusBadge(route.status)}</div>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="text-muted small">Distance</div>
                      <div>{route.distance}</div>
                    </div>
                    <div className="text-end">
                      <div className="text-muted small">Duration</div>
                      <div>{route.duration}</div>
                    </div>
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
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Stops</h5>
              <Badge bg="info">{route.stops.length} stops</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {route.stops.map((stop, index) => {
                  let bgClass = '';
                  if (stop.status === 'completed') {
                    bgClass = 'bg-success bg-opacity-10';
                  } else if (stop.status === 'in-progress') {
                    bgClass = 'bg-primary bg-opacity-10';
                  }
                  
                  return (
                    <ListGroup.Item key={stop.id} className={`p-3 ${bgClass}`}>
                      <div className="d-flex">
                        <div className="me-3 text-center">
                          <div className="bg-light rounded-circle p-2 mb-1 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                            {stop.type === 'depot' ? (
                              <FaMapMarkerAlt className="text-dark" />
                            ) : (
                              <FaShippingFast className="text-primary" />
                            )}
                          </div>
                          <div className="small fw-bold">{index + 1}</div>
                        </div>
                        
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div className="fw-bold">
                              {stop.customer || (stop.type === 'depot' ? 'Depot / Warehouse' : '')}
                            </div>
                            <div>{getStatusBadge(stop.status)}</div>
                          </div>
                          
                          <div className="small text-muted mb-1">{stop.address}</div>
                          
                          <div className="d-flex justify-content-between small">
                            <div>
                              <span className="text-muted">Scheduled: </span>
                              {formatTime(stop.scheduledTime)}
                            </div>
                            {stop.status !== 'pending' && (
                              <div>
                                <span className="text-muted">Actual: </span>
                                {formatTime(stop.actualTime) || 'In progress'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RouteMap;