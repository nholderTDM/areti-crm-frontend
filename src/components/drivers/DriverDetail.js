import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Table, ListGroup, Tabs, Tab, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, 
  FaStar, FaEdit, FaCalendarAlt, FaClipboardList, FaTruck, FaHistory 
} from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const DriverDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch driver data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      const mockDriver = {
        id: parseInt(id),
        name: 'John Doe', 
        phone: '(555) 123-4567', 
        email: 'john.doe@example.com',
        vehicleType: 'Delivery Van', 
        licensePlate: 'ABC-1234',
        vehicleYear: '2020',
        vehicleModel: 'Ford Transit',
        status: 'active',
        deliveries: {
          completed: 145,
          pending: 3,
          cancelled: 2
        },
        rating: 4.8,
        areasCovered: ['North Zone', 'Central Zone'],
        address: '123 Driver St, Atlanta, GA 30303',
        licenseNumber: 'DL-123456789',
        licenseExpiry: '2025-06-30',
        joinedDate: '2022-03-15',
        emergencyContact: {
          name: 'Jane Doe',
          relation: 'Spouse',
          phone: '(555) 987-6543'
        },
        notes: 'Excellent driver with consistent on-time deliveries. Prefers morning routes.',
        recentDeliveries: [
          {
            id: 1,
            deliveryId: 'DEL-10001',
            date: '2025-05-05',
            customer: 'ABC Logistics',
            status: 'completed',
            amount: 120.00
          },
          {
            id: 2,
            deliveryId: 'DEL-10002',
            date: '2025-05-06',
            customer: 'XYZ Retail',
            status: 'completed',
            amount: 85.50
          },
          {
            id: 3,
            deliveryId: 'DEL-10003',
            date: '2025-05-07',
            customer: 'Tech Solutions Inc.',
            status: 'in-progress',
            amount: 150.75
          }
        ],
        documents: [
          {
            id: 1,
            name: 'Driver License',
            dateUploaded: '2022-03-15',
            fileType: 'pdf'
          },
          {
            id: 2,
            name: 'Vehicle Insurance',
            dateUploaded: '2022-03-15',
            fileType: 'pdf'
          },
          {
            id: 3,
            name: 'Background Check',
            dateUploaded: '2022-03-16',
            fileType: 'pdf'
          }
        ]
      };
      
      setDriver(mockDriver);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="danger">Inactive</Badge>;
      case 'on-leave':
        return <Badge bg="warning">On Leave</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Get delivery status badge
  const getDeliveryStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'in-progress':
        return <Badge bg="info">In Progress</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  // Email the driver - opens default email client
  const emailDriver = (email) => {
    window.location.href = `mailto:${email}`;
  };
  
  // Call the driver - opens default phone dialer
  const callDriver = (phone) => {
    // Clean the phone number by removing non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  if (isLoading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading driver details...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <PageTitle
        title={`Driver: ${driver.name}`}
        backButton={true}
      />
      
      <div className="d-flex justify-content-end mb-4">
        <Button 
          variant="outline-primary" 
          className="me-2"
          as={Link}
          to={`/drivers/${id}/schedule`}
        >
          <FaCalendarAlt className="me-1" /> View Schedule
        </Button>
        <Button 
          variant="primary"
          as={Link}
          to={`/drivers/${id}/edit`}
        >
          <FaEdit className="me-1" /> Edit Driver
        </Button>
      </div>
      
      <Row>
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="display-1 text-muted mb-3">
                  <FaUser />
                </div>
                <h4>{driver.name}</h4>
                <div className="text-muted mb-3">{driver.vehicleType} Driver</div>
                <div className="mb-3">
                  {getStatusBadge(driver.status)}
                </div>
                <div className="d-flex justify-content-center mb-2">
                  <div className="mx-2">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => callDriver(driver.phone)}
                      size="sm"
                    >
                      <FaPhone className="me-1" /> Call
                    </Button>
                  </div>
                  <div className="mx-2">
                    <Button 
                      variant="outline-success" 
                      onClick={() => emailDriver(driver.email)}
                      size="sm"
                    >
                      <FaEnvelope className="me-1" /> Email
                    </Button>
                  </div>
                </div>
              </div>
              
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FaPhone />
                    </div>
                    <div>
                      <div className="text-muted small">Phone</div>
                      <div>
                        <a href={`tel:${driver.phone.replace(/\D/g, '')}`}>
                          {driver.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FaEnvelope />
                    </div>
                    <div>
                      <div className="text-muted small">Email</div>
                      <div>
                        <a href={`mailto:${driver.email}`}>
                          {driver.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <div className="text-muted small">Address</div>
                      <div>{driver.address}</div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FaIdCard />
                    </div>
                    <div>
                      <div className="text-muted small">License Number</div>
                      <div>{driver.licenseNumber}</div>
                      <div className="text-muted small">
                        Expires: {formatDate(driver.licenseExpiry)}
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FaStar />
                    </div>
                    <div>
                      <div className="text-muted small">Overall Rating</div>
                      <div className="d-flex align-items-center">
                        <div className="me-2">{driver.rating}</div>
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(driver.rating) ? "text-warning" : "text-muted"}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <div className="text-muted small">Joined On</div>
                      <div>{formatDate(driver.joinedDate)}</div>
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Vehicle Information</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FaCar />
                    </div>
                    <div>
                      <div className="text-muted small">Vehicle</div>
                      <div>{driver.vehicleYear} {driver.vehicleModel}</div>
                      <div className="text-muted small">{driver.vehicleType}</div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FaIdCard />
                    </div>
                    <div>
                      <div className="text-muted small">License Plate</div>
                      <div>{driver.licensePlate}</div>
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Emergency Contact</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="text-muted small">Name</div>
                <div>{driver.emergencyContact.name}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Relation</div>
                <div>{driver.emergencyContact.relation}</div>
              </div>
              <div>
                <div className="text-muted small">Phone</div>
                <div>
                  <a href={`tel:${driver.emergencyContact.phone.replace(/\D/g, '')}`}>
                    {driver.emergencyContact.phone}
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="overview" title="Overview">
                  <div className="mb-4">
                    <h5>Areas Covered</h5>
                    <div className="d-flex flex-wrap">
                      {driver.areasCovered.map(area => (
                        <Badge key={area} bg="info" className="me-2 mb-2 p-2">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5>Delivery Statistics</h5>
                    <Row>
                      <Col md={4}>
                        <Card className="text-center mb-3">
                          <Card.Body>
                            <h3 className="mb-0">{driver.deliveries.completed}</h3>
                            <div className="text-muted">Completed</div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="text-center mb-3">
                          <Card.Body>
                            <h3 className="mb-0">{driver.deliveries.pending}</h3>
                            <div className="text-muted">Pending</div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="text-center mb-3">
                          <Card.Body>
                            <h3 className="mb-0">{driver.deliveries.cancelled}</h3>
                            <div className="text-muted">Cancelled</div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="mb-4">
                    <h5>Notes</h5>
                    <Card bg="light">
                      <Card.Body>
                        {driver.notes}
                      </Card.Body>
                    </Card>
                  </div>
                </Tab>
                
                <Tab eventKey="deliveries" title="Recent Deliveries">
                  <div className="mb-4">
                    <h5 className="mb-3">Recent Deliveries</h5>
                    <Table hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Status</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {driver.recentDeliveries.map(delivery => (
                          <tr key={delivery.id}>
                            <td>
                              <Link to={`/deliveries/${delivery.id}`} className="text-decoration-none">
                                {delivery.deliveryId}
                              </Link>
                            </td>
                            <td>{formatDate(delivery.date)}</td>
                            <td>{delivery.customer}</td>
                            <td>{getDeliveryStatusBadge(delivery.status)}</td>
                            <td>${delivery.amount.toFixed(2)}</td>
                            <td>
                              <Button as={Link} to={`/deliveries/${delivery.id}`} variant="outline-primary" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="text-center mt-3">
                      <Button as={Link} to={`/deliveries?driver=${id}`} variant="outline-primary">
                        View All Deliveries
                      </Button>
                    </div>
                  </div>
                </Tab>
                
                <Tab eventKey="documents" title="Documents">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Driver Documents</h5>
                      <Button variant="outline-primary" size="sm">
                        <FaClipboardList className="me-1" /> Upload Document
                      </Button>
                    </div>
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Document</th>
                          <th>Date Uploaded</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {driver.documents.map(document => (
                          <tr key={document.id}>
                            <td>{document.name}</td>
                            <td>{formatDate(document.dateUploaded)}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2">
                                View
                              </Button>
                              <Button variant="outline-secondary" size="sm">
                                Download
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
                
                <Tab eventKey="history" title="History">
                  <Alert variant="info">
                    Driver activity history will be displayed here.
                  </Alert>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DriverDetail;