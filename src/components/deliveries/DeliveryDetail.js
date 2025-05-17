import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Table, Alert, ListGroup, Tabs, Tab, Form } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageTitle from '../common/PageTitle';
import { 
  FaTruck, FaArrowLeft, FaMapMarkerAlt, FaBuilding, FaUser, FaBox, 
  FaCalendarAlt, FaEdit, FaPrint, FaFileAlt, FaClock, FaMoneyBill,
  FaExclamationTriangle, FaCheck, FaTimes, FaComment, FaHistory, FaFilePdf, FaPlus
} from 'react-icons/fa';
import PhoneContact from '../common/PhoneContact';

const DeliveryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [deliveryEvents, setDeliveryEvents] = useState([]);

  // Delivery statuses
  const deliveryStatuses = [
    { value: 'scheduled', label: 'Scheduled', color: 'primary' },
    { value: 'in-progress', label: 'In Progress', color: 'info' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'delayed', label: 'Delayed', color: 'warning' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' },
    { value: 'failed', label: 'Failed', color: 'dark' }
  ];

  // Load delivery data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock data for the delivery
      const today = new Date();
      
      const mockDelivery = {
        id: parseInt(id),
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
          { id: 1, description: 'Servers', quantity: 2, weight: '150 lbs', dimensions: '24x36x12 in' },
          { id: 2, description: 'Networking Equipment', quantity: 5, weight: '50 lbs', dimensions: '12x12x12 in' }
        ],
        notes: 'Fragile equipment. Requires IT staff signature.',
        signature: null,
        completedAt: null,
        paymentStatus: 'pending',
        amount: 400.00,
        paymentMethod: 'invoice',
        referenceNumber: 'PO-12345',
        priority: 'urgent',
        eta: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
        instructions: 'Deliver to receiving dock at rear of building. Call contact 15 minutes before arrival.',
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        currentLocation: {
          lat: 33.9487,
          lng: -84.2089,
          address: 'I-285 S, Doraville, GA 30340',
          updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 45),
          status: 'moving'
        },
        route: {
          distance: '18.5 miles',
          duration: '35 minutes',
          stops: [
            { address: '123 Warehouse St, Atlanta, GA 30303', type: 'pickup', status: 'completed', arrivalTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0), departureTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 15) },
            { address: '101 Tech Park, Norcross, GA 30092', type: 'delivery', status: 'pending', estimatedArrival: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30) }
          ]
        },
        documents: [
          { id: 1, name: 'Delivery Manifest.pdf', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), type: 'manifest' },
          { id: 2, name: 'Invoice #A-12345.pdf', createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), type: 'invoice' }
        ]
      };
      
      setDelivery(mockDelivery);
      
      // Generate delivery events
      const mockEvents = [
        { id: 1, type: 'created', content: 'Delivery created', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 10, 15), user: 'Admin User' },
        { id: 2, type: 'assigned', content: 'Assigned to driver David Wilson', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 11, 30), user: 'Admin User' },
        { id: 3, type: 'status_changed', content: 'Status changed from Scheduled to In Progress', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0), user: 'David Wilson' },
        { id: 4, type: 'location_update', content: 'Left pickup location', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 15), user: 'System' },
        { id: 5, type: 'note', content: 'Driver called customer to confirm delivery time', timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30), user: 'David Wilson' }
      ];
      
      setDeliveryEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, [id]);

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

  // Add a new note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    // In a real app, this would be an API call
    const newEvent = {
      id: deliveryEvents.length + 1,
      type: 'note',
      content: newNote,
      timestamp: new Date(),
      user: 'Admin User'
    };
    
    setDeliveryEvents([newEvent, ...deliveryEvents]);
    setNewNote('');
  };

  // Calculate delivery status percentage
  const calculateProgressPercentage = () => {
    switch (delivery.status) {
      case 'scheduled':
        return 20;
      case 'in-progress':
        return 60;
      case 'completed':
        return 100;
      case 'delayed':
        return 40;
      case 'cancelled':
      case 'failed':
        return 100;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading delivery details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={`Delivery ${delivery.deliveryId}`}
        backButton={true}
      />
  
      <div className="d-flex justify-content-end align-items-center mb-4">
        <Button 
          variant="outline-secondary" 
          className="me-2"
          onClick={() => window.print()}
        >
          <FaPrint className="me-1" /> Print
        </Button>
        <Button 
          variant="outline-primary" 
          className="me-2"
          as={Link}
          to={`/deliveries/${id}/edit`}
        >
          <FaEdit className="me-1" /> Edit
        </Button>
        <Button 
          variant="primary"
          as={Link}
          to={`/deliveries/${id}/track`}
        >
          <FaMapMarkerAlt className="me-1" /> Track
        </Button>
      </div>
      
      <Row>
        <Col lg={4}>
          {/* Delivery Info Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Delivery Information</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="px-3 py-3 d-flex justify-content-between">
                  <div className="text-muted">Status</div>
                  <div>
                    {getStatusBadge(delivery.status)}
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
  <div className="text-muted mb-1">Customer</div>
  <div className="d-flex align-items-center">
    <FaBuilding className="me-2 text-secondary" />
    <div>
      <div className="fw-bold">{delivery.customer.name}</div>
      <div className="small">
        {delivery.customer.contact} | <PhoneContact phoneNumber={delivery.customer.phone} />
      </div>
    </div>
  </div>
</ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Pickup Location</div>
                  <div className="d-flex">
                    <FaMapMarkerAlt className="me-2 text-secondary flex-shrink-0 mt-1" />
                    <div>{delivery.pickupAddress}</div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Delivery Location</div>
                  <div className="d-flex">
                    <FaMapMarkerAlt className="me-2 text-secondary flex-shrink-0 mt-1" />
                    <div>{delivery.deliveryAddress}</div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Scheduled Date/Time</div>
                  <div className="d-flex">
                    <FaCalendarAlt className="me-2 text-secondary" />
                    <div>{formatDateTime(delivery.scheduledDate)}</div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
  <div className="text-muted mb-1">Driver & Vehicle</div>
  <div className="d-flex align-items-center">
    <FaUser className="me-2 text-secondary" />
    <div>
      <div>{delivery.driver.name}</div>
      <div className="small">
        <PhoneContact phoneNumber={delivery.driver.phone} />
      </div>
      <div className="small text-muted">{delivery.vehicle}</div>
    </div>
  </div>
</ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3 d-flex justify-content-between">
                  <div className="text-muted">Amount</div>
                  <div className="fw-bold">${delivery.amount.toFixed(2)}</div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3 d-flex justify-content-between">
                  <div className="text-muted">Payment Status</div>
                  <div className="text-capitalize">{delivery.paymentStatus}</div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3 d-flex justify-content-between">
                  <div className="text-muted">Priority</div>
                  <div>{getPriorityBadge(delivery.priority)}</div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3 d-flex justify-content-between">
                  <div className="text-muted">Reference #</div>
                  <div>{delivery.referenceNumber || 'N/A'}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          {/* Status Updates Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Current Status</h5>
            </Card.Header>
            <Card.Body>
              {/* Status Progress Bar */}
              <div className="mb-4">
                <div className="progress-wrapper">
                  <div className="progress-info d-flex justify-content-between mb-2">
                    <div>Delivery Progress</div>
                    <div>{calculateProgressPercentage()}%</div>
                  </div>
                  <div className="progress">
                    <div 
                      className={`progress-bar bg-${delivery.status === 'cancelled' || delivery.status === 'failed' ? 'danger' : delivery.status === 'delayed' ? 'warning' : 'success'}`}
                      role="progressbar" 
                      style={{ width: `${calculateProgressPercentage()}%` }}
                      aria-valuenow={calculateProgressPercentage()}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Current Location */}
              {delivery.status === 'in-progress' && delivery.currentLocation && (
                <div className="current-location mb-4">
                  <h6>Current Location</h6>
                  <div className="d-flex">
                    <FaMapMarkerAlt className="me-2 text-danger flex-shrink-0 mt-1" />
                    <div>
                      <div>{delivery.currentLocation.address}</div>
                      <div className="small text-muted">
                        Updated {formatDateTime(delivery.currentLocation.updatedAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      as={Link}
                      to={`/deliveries/${id}/track`}
                    >
                      <FaMapMarkerAlt className="me-1" /> View on Map
                    </Button>
                  </div>
                </div>
              )}
              
              {/* ETA Information */}
              {(delivery.status === 'scheduled' || delivery.status === 'in-progress') && delivery.eta && (
                <div className="eta-info">
                  <h6>Estimated Arrival</h6>
                  <div className="d-flex align-items-center">
                    <FaClock className="me-2 text-info" />
                    <div>
                      <div className="fw-bold">{formatDateTime(delivery.eta)}</div>
                      <div className="small text-muted">
                        {delivery.route && `${delivery.route.distance} (${delivery.route.duration} drive)`}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Status Alerts */}
              {delivery.status === 'delayed' && (
                <Alert variant="warning" className="mt-3 mb-0">
                  <div className="d-flex">
                    <FaExclamationTriangle className="me-2 flex-shrink-0 mt-1" />
                    <div>
                      <div className="fw-bold">Delivery Delayed</div>
                      <div className="small">The customer has been notified of the delay.</div>
                    </div>
                  </div>
                </Alert>
              )}
              
              {delivery.status === 'completed' && (
                <Alert variant="success" className="mt-3 mb-0">
                  <div className="d-flex">
                    <FaCheck className="me-2 flex-shrink-0 mt-1" />
                    <div>
                      <div className="fw-bold">Delivery Completed</div>
                      <div className="small">
                        Completed on {delivery.completedAt ? formatDateTime(delivery.completedAt) : 'N/A'}
                      </div>
                      {delivery.signature && <div className="small">Signed by: {delivery.signature}</div>}
                    </div>
                  </div>
                </Alert>
              )}
              
              {(delivery.status === 'cancelled' || delivery.status === 'failed') && (
                <Alert variant="danger" className="mt-3 mb-0">
                  <div className="d-flex">
                    <FaTimes className="me-2 flex-shrink-0 mt-1" />
                    <div>
                      <div className="fw-bold">Delivery {delivery.status === 'cancelled' ? 'Cancelled' : 'Failed'}</div>
                      <div className="small">
                        See activity log for details.
                      </div>
                    </div>
                  </div>
                </Alert>
              )}
            </Card.Body>
          </Card>
          
          {/* Documents Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Documents</h5>
              <Button variant="outline-primary" size="sm">
                <FaFilePdf className="me-1" /> Generate POD
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {delivery.documents.map(doc => (
                  <ListGroup.Item key={doc.id} className="px-3 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaFileAlt className="me-2 text-secondary" />
                        <div>
                          <div>{doc.name}</div>
                          <div className="small text-muted">
                            {formatDate(doc.createdAt)}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline-secondary" size="sm">
                        <FaFileAlt className="me-1" /> View
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Tabs defaultActiveKey="details" className="mb-4">
                <Tab eventKey="details" title="Delivery Details">
                  {/* Items Table */}
                  <h5 className="mb-3">
                    <FaBox className="me-2" />
                    Delivery Items
                  </h5>
                  
                  <Table responsive className="mb-4">
                    <thead className="bg-light">
                      <tr>
                        <th width="50%">Description</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Weight</th>
                        <th className="text-center">Dimensions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {delivery.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.description}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-center">{item.weight}</td>
                          <td className="text-center">{item.dimensions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  
                  {/* Instructions & Notes */}
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h5 className="mb-3">
                          <FaComment className="me-2" />
                          Delivery Instructions
                        </h5>
                        <Card className="bg-light">
                          <Card.Body>
                            {delivery.instructions || 'No specific instructions provided.'}
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <h5 className="mb-3">
                          <FaComment className="me-2" />
                          Internal Notes
                        </h5>
                        <Card className="bg-light">
                          <Card.Body>
                            {delivery.notes || 'No internal notes provided.'}
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                  
                  {/* Payment Information */}
                  <h5 className="mb-3">
                    <FaMoneyBill className="me-2" />
                    Payment Information
                  </h5>
                  
                  <Card className="mb-4">
                    <Card.Body>
                      <Row>
                        <Col md={4}>
                          <div className="mb-3">
                            <div className="text-muted">Amount</div>
                            <div className="fw-bold fs-4">${delivery.amount.toFixed(2)}</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <div className="text-muted">Payment Status</div>
                            <div className="fw-bold text-capitalize">
                              {delivery.paymentStatus}
                            </div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <div className="text-muted">Payment Method</div>
                            <div className="fw-bold text-capitalize">
                              {delivery.paymentMethod}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      
                      <div className="mb-0">
                        <div className="text-muted">Reference Number</div>
                        <div>{delivery.referenceNumber || 'N/A'}</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab>
                
                <Tab eventKey="activity" title="Activity Log">
                  {/* Add Note Form */}
                  <Form onSubmit={handleAddNote} className="mb-4">
                    <Form.Group>
                      <Form.Label>Add a Note</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Add a note about this delivery..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mb-2"
                      />
                      <div className="text-end">
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={!newNote.trim()}
                        >
                          Add Note
                        </Button>
                      </div>
                    </Form.Group>
                  </Form>
                  
                  <hr />
                  
                  <h5 className="mb-3">
                    <FaHistory className="me-2" />
                    Activity History
                  </h5>
                  
                  <div className="timeline">
                    {deliveryEvents.map((event, index) => (
                      <div key={event.id} className="timeline-item mb-4">
                        <div className="d-flex">
                          <div className="timeline-icon me-3">
                            {event.type === 'created' && <FaPlus className="text-success" />}
                            {event.type === 'assigned' && <FaUser className="text-primary" />}
                            {event.type === 'status_changed' && <FaTruck className="text-warning" />}
                            {event.type === 'location_update' && <FaMapMarkerAlt className="text-danger" />}
                            {event.type === 'note' && <FaComment className="text-info" />}
                          </div>
                          <div className="timeline-content flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <strong>{event.content}</strong>
                              <small className="text-muted">{formatDateTime(event.timestamp)}</small>
                            </div>
                            <small className="text-muted">By {event.user}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab>
                
                <Tab eventKey="route" title="Route Information">
                  {delivery.route ? (
                    <div>
                      <div className="mb-4">
                        <h5 className="mb-3">Route Summary</h5>
                        <Card className="bg-light mb-3">
                          <Card.Body>
                            <Row>
                              <Col md={6}>
                                <div className="mb-2">
                                  <strong>Total Distance:</strong> {delivery.route.distance}
                                </div>
                                <div className="mb-0">
                                  <strong>Estimated Duration:</strong> {delivery.route.duration}
                                </div>
                              </Col>
                              <Col md={6} className="text-md-end">
                                <Button 
                                  variant="outline-primary"
                                  size="sm"
                                  as={Link}
                                  to={`/deliveries/${id}/track`}
                                >
                                  <FaMapMarkerAlt className="me-1" /> View Full Map
                                </Button>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                      
                      <h5 className="mb-3">Route Stops</h5>
                      <Table responsive>
                        <thead className="bg-light">
                          <tr>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {delivery.route.stops.map((stop, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <FaMapMarkerAlt className={`me-2 text-${stop.type === 'pickup' ? 'primary' : 'danger'}`} />
                                  <div>{stop.address}</div>
                                </div>
                              </td>
                              <td className="text-capitalize">{stop.type}</td>
                              <td>
                                <Badge bg={
                                  stop.status === 'completed' ? 'success' : 
                                  stop.status === 'in-progress' ? 'info' : 'secondary'
                                }>
                                  {stop.status}
                                </Badge>
                              </td>
                              <td>
                                {stop.status === 'completed' ? (
                                  <div>
                                    <div>Arrived: {formatTime(stop.arrivalTime)}</div>
                                    <div>Departed: {formatTime(stop.departureTime)}</div>
                                  </div>
                                ) : (
                                  <div>ETA: {formatTime(stop.estimatedArrival)}</div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <Alert variant="info">
                      No route information available for this delivery.
                    </Alert>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DeliveryDetail;