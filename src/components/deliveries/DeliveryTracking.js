import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaMapMarkerAlt, FaDirections, FaClock, FaPhone } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const DeliveryTracking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          { id: 1, description: 'Servers', quantity: 2, weight: '150 lbs' },
          { id: 2, description: 'Networking Equipment', quantity: 5, weight: '50 lbs' }
        ],
        eta: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
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
          progress: 65,
          stops: [
            { address: '123 Warehouse St, Atlanta, GA 30303', type: 'pickup', status: 'completed', arrivalTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0), departureTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 15) },
            { address: '101 Tech Park, Norcross, GA 30092', type: 'delivery', status: 'pending', estimatedArrival: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30) }
          ]
        }
      };
      
      setDelivery(mockDelivery);
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

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={`Tracking ${delivery.deliveryId}`}
        backButton={true}
      />
      
      <div className="d-flex justify-content-end mb-4">
        <Button variant="outline-primary" className="me-2" onClick={() => window.location.reload()}>
          <FaDirections className="me-1" /> Refresh
        </Button>
        <Button variant="primary" href={`tel:${delivery.driver.phone}`}>
          <FaPhone className="me-1" /> Call Driver
        </Button>
      </div>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="mb-4">
                <h5>Live Tracking Map</h5>
                <div className="map-placeholder bg-light text-center p-5 rounded">
                  <p className="mb-4">Map would be displayed here</p>
                  <p className="text-muted mb-3">Current location: {delivery.currentLocation.address}</p>
                  <div className="d-flex justify-content-center">
                    <FaMapMarkerAlt className="text-danger me-2" size={24} />
                    <FaTruck className="text-primary" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="route-progress">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>Route Progress</div>
                  <div>{delivery.route.progress}%</div>
                </div>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${delivery.route.progress}%` }}
                    aria-valuenow={delivery.route.progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <div>Pickup</div>
                  <div>Delivery</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Delivery Status</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="px-3 py-3">
                  <div className="d-flex align-items-center">
                    <div className="status-icon bg-info rounded-circle p-2 me-3">
                      <FaTruck className="text-white" />
                    </div>
                    <div>
                      <div className="fw-bold">In Transit</div>
                      <div className="text-muted small">
                        Updated {formatDateTime(delivery.currentLocation.updatedAt)}
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Estimated Arrival</div>
                  <div className="d-flex align-items-center">
                    <FaClock className="me-2 text-primary" />
                    <div>
                      <div className="fw-bold">{formatTime(delivery.eta)}</div>
                      <div className="small text-muted">
                        {delivery.route && `Distance: ${delivery.route.distance} (${delivery.route.duration} remaining)`}
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Driver Information</div>
                  <div className="d-flex align-items-center">
                    <div className="driver-icon bg-secondary rounded-circle p-2 me-3">
                      <FaTruck className="text-white" />
                    </div>
                    <div>
                      <div className="fw-bold">{delivery.driver.name}</div>
                      <div className="small">{delivery.driver.phone}</div>
                      <div className="small text-muted">{delivery.vehicle}</div>
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Delivery Details</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Order Number</div>
                  <div>{delivery.deliveryId}</div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Pickup Location</div>
                  <div className="small d-flex">
                    <FaMapMarkerAlt className="me-2 text-primary flex-shrink-0 mt-1" />
                    <div>{delivery.pickupAddress}</div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Delivery Location</div>
                  <div className="small d-flex">
                    <FaMapMarkerAlt className="me-2 text-danger flex-shrink-0 mt-1" />
                    <div>{delivery.deliveryAddress}</div>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Items</div>
                  <div className="small">
                    {delivery.items.map((item) => (
                      <div key={item.id}>
                        {item.quantity}x {item.description}
                      </div>
                    ))}
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-3 py-3">
                  <div className="text-muted mb-1">Recipient</div>
                  <div>{delivery.customer.contact}</div>
                  <div className="small">{delivery.customer.phone}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DeliveryTracking;