// src/components/routes/RouteOptimizer.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Badge, ListGroup, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRoute, FaMapMarkedAlt, FaSave, FaTimes, FaRedo, FaTruckLoading, 
         FaMapMarkerAlt, FaDirections, FaExchangeAlt, FaArrowRight, 
         FaTruck, FaStopwatch, FaBoxOpen, FaUser, FaCalendarAlt } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const RouteOptimizer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const routeId = queryParams.get('routeId');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [existingRoutes, setExistingRoutes] = useState([]);
  
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);
  const [optimizationSettings, setOptimizationSettings] = useState({
    startLocation: '123 Warehouse St, Atlanta, GA 30303',
    endLocation: '123 Warehouse St, Atlanta, GA 30303',
    optimizationMethod: 'distance', // 'distance', 'time', or 'balanced'
    vehicleType: 'all',
    driverId: '',
    maxStops: 10,
    timeWindow: '8:00-17:00',
    includeExistingRoute: !!routeId
  });
  
  const [originalRoute, setOriginalRoute] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  
  // Load data
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch required data
    Promise.all([
      // These would be real API calls in a production app
      fetchDrivers(),
      fetchVehicles(),
      fetchDeliveries(),
      fetchExistingRoutes(),
      routeId ? fetchRoute(routeId) : Promise.resolve(null)
    ])
      .then(([driversData, vehiclesData, deliveriesData, routesData, routeData]) => {
        setDrivers(driversData);
        setVehicles(vehiclesData);
        setDeliveries(deliveriesData);
        setExistingRoutes(routesData);
        
        if (routeData) {
          setOriginalRoute(routeData);
          
          // Pre-select deliveries from the existing route
          const routeDeliveryIds = routeData.stops
            .filter(stop => stop.type === 'delivery' && stop.deliveryId)
            .map(stop => stop.deliveryId);
          
          setSelectedDeliveries(routeDeliveryIds);
          
          // Set optimization settings based on existing route
          setOptimizationSettings({
            ...optimizationSettings,
            startLocation: routeData.startLocation,
            endLocation: routeData.endLocation,
            driverId: routeData.driverId.toString(),
            vehicleType: vehiclesData.find(v => v.id === routeData.vehicleId)?.type || 'all'
          });
        }
        
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading data:", error);
        setIsLoading(false);
      });
  }, [routeId]);
  
  // Simulate fetching drivers
  const fetchDrivers = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'David Wilson', available: true },
          { id: 2, name: 'Sarah Johnson', available: true },
          { id: 3, name: 'Michael Brown', available: false },
          { id: 4, name: 'Jennifer Davis', available: true },
          { id: 5, name: 'Robert Martinez', available: true }
        ]);
      }, 300);
    });
  };
  
  // Simulate fetching vehicles
  const fetchVehicles = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Cargo Van - AT-123', type: 'Cargo Van', available: true, capacity: '1,000 lbs' },
          { id: 2, name: 'Box Truck - AT-456', type: 'Box Truck', available: true, capacity: '5,000 lbs' },
          { id: 3, name: 'Cargo Van - AT-789', type: 'Cargo Van', available: false, capacity: '1,000 lbs' },
          { id: 4, name: 'Sprinter - AT-321', type: 'Sprinter', available: true, capacity: '3,000 lbs' },
          { id: 5, name: 'Box Truck - AT-654', type: 'Box Truck', available: true, capacity: '5,000 lbs' }
        ]);
      }, 300);
    });
  };
  
  // Simulate fetching deliveries
  const fetchDeliveries = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        resolve([
          { 
            id: 1, 
            deliveryId: 'DEL-10015', 
            customer: 'Peachtree Office Supplies',
            contact: 'Sarah Johnson',
            phone: '(555) 123-4567',
            address: '101 Marietta St NW, Atlanta, GA 30303',
            scheduledDate: tomorrow,
            weight: '150 lbs',
            priority: 'standard',
            assigned: true
          },
          { 
            id: 2, 
            deliveryId: 'DEL-10016', 
            customer: 'GSU Business School',
            contact: 'Robert Chen',
            phone: '(555) 234-5678',
            address: '55 Park Place NE, Atlanta, GA 30303',
            scheduledDate: tomorrow,
            weight: '75 lbs',
            priority: 'standard',
            assigned: true
          },
          { 
            id: 3, 
            deliveryId: 'DEL-10017', 
            customer: 'Student Center',
            contact: 'James Wilson',
            phone: '(555) 345-6789',
            address: '100 Piedmont Ave NE, Atlanta, GA 30303',
            scheduledDate: tomorrow,
            weight: '200 lbs',
            priority: 'standard',
            assigned: true
          },
          { 
            id: 4, 
            deliveryId: 'DEL-10018', 
            customer: 'City Law Offices',
            contact: 'Amanda Garcia',
            phone: '(555) 456-7890',
            address: '30 Pryor St SW, Atlanta, GA 30303',
            scheduledDate: tomorrow,
            weight: '120 lbs',
            priority: 'expedited',
            assigned: true
          },
          { 
            id: 5, 
            deliveryId: 'DEL-10019', 
            customer: 'Downtown Hotel',
            contact: 'Michael Brown',
            phone: '(555) 567-8901',
            address: '200 Peachtree St NE, Atlanta, GA 30303',
            scheduledDate: tomorrow,
            weight: '85 lbs',
            priority: 'standard',
            assigned: false
          },
          { 
            id: 6, 
            deliveryId: 'DEL-10020', 
            customer: 'Centennial Park Offices',
            contact: 'David Lee',
            phone: '(555) 678-9012',
            address: '265 Park Ave W NW, Atlanta, GA 30313',
            scheduledDate: tomorrow,
            weight: '250 lbs',
            priority: 'standard',
            assigned: false
          },
          { 
            id: 7, 
            deliveryId: 'DEL-10021', 
            customer: 'CNN Center',
            contact: 'Lisa Miller',
            phone: '(555) 789-0123',
            address: '190 Marietta St NW, Atlanta, GA 30303',
            scheduledDate: tomorrow,
            weight: '300 lbs',
            priority: 'standard',
            assigned: false
          },
          { 
            id: 8, 
            deliveryId: 'DEL-10022', 
            customer: 'Fairlie-Poplar District Office',
            contact: 'Thomas Wright',
            phone: '(555) 890-1234',
            address: '75 Marietta St NW, Atlanta, GA 30303',
            scheduledDate: tomorrow,
            weight: '180 lbs',
            priority: 'standard',
            assigned: false
          },
          { 
            id: 9, 
            deliveryId: 'DEL-10023', 
            customer: 'Sweet Auburn Market',
            contact: 'Emily Johnson',
            phone: '(555) 901-2345',
            address: '209 Edgewood Ave SE, Atlanta, GA 30303',
            scheduledDate: tomorrow,
            weight: '225 lbs',
            priority: 'expedited',
            assigned: false
          },
          { 
            id: 10, 
            deliveryId: 'DEL-10024', 
            customer: 'Georgia State Capitol',
            contact: 'William Harris',
            phone: '(555) 012-3456',
            address: '206 Washington St SW, Atlanta, GA 30334',
            scheduledDate: tomorrow,
            weight: '95 lbs',
            priority: 'standard',
            assigned: false
          }
        ]);
      }, 500);
    });
  };
  
  // Simulate fetching existing routes
  const fetchExistingRoutes = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        resolve([
          {
            id: 1,
            routeId: 'RT-10001',
            name: 'Downtown Atlanta Delivery Route',
            date: tomorrow,
            driverId: 1,
            stops: 9
          },
          {
            id: 2,
            routeId: 'RT-10002',
            name: 'Buckhead Business District Route',
            date: tomorrow,
            driverId: 2,
            stops: 6
          }
        ]);
      }, 300);
    });
  };
  
  // Simulate fetching a specific route
  const fetchRoute = (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        resolve({
          id: parseInt(id),
          routeId: 'RT-10001',
          name: 'Downtown Atlanta Delivery Route',
          date: tomorrow.toISOString().split('T')[0],
          status: 'scheduled',
          driverId: 1,
          vehicleId: 3,
          startLocation: '123 Warehouse St, Atlanta, GA 30303',
          endLocation: '123 Warehouse St, Atlanta, GA 30303',
          notes: 'This route covers the downtown Atlanta business district.',
          stops: [
            {
              id: 1,
              type: 'depot',
              address: '123 Warehouse St, Atlanta, GA 30303',
              scheduledTime: '08:00',
              notes: 'Route start - loading'
            },
            {
              id: 2,
              type: 'delivery',
              deliveryId: 1,
              address: '101 Marietta St NW, Atlanta, GA 30303',
              scheduledTime: '08:30',
              notes: 'Leave packages at front desk'
            },
            {
              id: 3,
              type: 'delivery',
              deliveryId: 2,
              address: '55 Park Place NE, Atlanta, GA 30303',
              scheduledTime: '09:00',
              notes: 'Signature required from recipient'
            },
            {
              id: 4,
              type: 'delivery',
              deliveryId: 3,
              address: '100 Piedmont Ave NE, Atlanta, GA 30303',
              scheduledTime: '09:30',
              notes: 'Deliver to loading dock in rear'
            },
            {
              id: 5,
              type: 'delivery',
              deliveryId: 4,
              address: '30 Pryor St SW, Atlanta, GA 30303',
              scheduledTime: '10:00',
              notes: 'Call customer upon arrival'
            },
            {
              id: 6,
              type: 'depot',
              address: '123 Warehouse St, Atlanta, GA 30303',
              scheduledTime: '11:00',
              notes: 'Route end - return to warehouse'
            }
          ],
          distance: '32.5 miles',
          duration: '4 hours 30 minutes'
        });
      }, 500);
    });
  };
  
  // Handle settings change
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setOptimizationSettings({
      ...optimizationSettings,
      [name]: value
    });
  };
  
  // Handle delivery selection
  const handleDeliverySelect = (id) => {
    if (selectedDeliveries.includes(id)) {
      setSelectedDeliveries(selectedDeliveries.filter(deliveryId => deliveryId !== id));
    } else {
      setSelectedDeliveries([...selectedDeliveries, id]);
    }
  };
  
  // Handle select all deliveries
  const handleSelectAllDeliveries = () => {
    if (selectedDeliveries.length === deliveries.length) {
      setSelectedDeliveries([]);
    } else {
      setSelectedDeliveries(deliveries.map(delivery => delivery.id));
    }
  };
  
  // Handle optimization
  const handleOptimize = () => {
    if (selectedDeliveries.length === 0) {
      alert('Please select at least one delivery to optimize.');
      return;
    }
    
    setIsOptimizing(true);
    
    // Simulate route optimization
    setTimeout(() => {
      const optStops = [];
      
      // Add depot start
      optStops.push({
        id: 1,
        type: 'depot',
        address: optimizationSettings.startLocation,
        scheduledTime: '08:00',
        notes: 'Route start - loading'
      });
      
      // Add optimized delivery stops
      const selectedDeliveriesData = deliveries
        .filter(delivery => selectedDeliveries.includes(delivery.id))
        .sort((a, b) => {
          // Simulate sorting based on optimization method
          if (optimizationSettings.optimizationMethod === 'priority') {
            // Priority first
            if (a.priority === 'expedited' && b.priority !== 'expedited') return -1;
            if (a.priority !== 'expedited' && b.priority === 'expedited') return 1;
          }
          
          // Then by address (simple proxy for distance optimization)
          return a.address.localeCompare(b.address);
        });
      
      let currentTime = new Date();
      currentTime.setHours(8, 0, 0);
      
      selectedDeliveriesData.forEach((delivery, index) => {
        // Add 30 minutes for each stop
        currentTime.setMinutes(currentTime.getMinutes() + 30);
        
        optStops.push({
          id: index + 2,
          type: 'delivery',
          deliveryId: delivery.id,
          address: delivery.address,
          scheduledTime: currentTime.toTimeString().substring(0, 5),
          notes: `Delivery for ${delivery.customer}`
        });
      });
      
      // Add 30 minutes for return to depot
      currentTime.setMinutes(currentTime.getMinutes() + 30);
      
      // Add depot end
      optStops.push({
        id: optStops.length + 1,
        type: 'depot',
        address: optimizationSettings.endLocation,
        scheduledTime: currentTime.toTimeString().substring(0, 5),
        notes: 'Route end - return to warehouse'
      });
      
      // Calculate route stats
      const totalDistance = (Math.random() * 10 + 20).toFixed(1);
      const totalDuration = `${Math.floor(optStops.length * 0.5)} hours ${Math.round(Math.random() * 50) + 10} minutes`;
      
      // Create optimized route
      const optimizedRouteData = {
        routeId: routeId ? originalRoute.routeId : `RT-${10000 + Math.floor(Math.random() * 90000)}`,
        name: routeId ? originalRoute.name : 'Optimized Delivery Route',
        date: new Date().toISOString().split('T')[0],
        status: 'scheduled',
        driverId: optimizationSettings.driverId ? parseInt(optimizationSettings.driverId) : null,
        vehicleId: null, // Would be assigned based on settings
        startLocation: optimizationSettings.startLocation,
        endLocation: optimizationSettings.endLocation,
        notes: 'Route optimized with distance prioritization',
        stops: optStops,
        distance: `${totalDistance} miles`,
        duration: totalDuration,
        savings: {
          distance: `${(Math.random() * 5 + 2).toFixed(1)} miles`,
          time: `${Math.floor(Math.random() * 60) + 15} minutes`,
          percentage: `${Math.floor(Math.random() * 15) + 5}%`
        }
      };
      
      setOptimizedRoute(optimizedRouteData);
      setIsOptimizing(false);
      setOptimizationComplete(true);
    }, 2000);
  };
  
  // Handle save optimized route
  const handleSaveRoute = () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      navigate('/routes');
    }, 1000);
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title="Route Optimizer"
        subtitle={routeId ? `Optimizing: ${originalRoute?.routeId}` : 'Create optimized delivery routes'}
        backButton={true}
      />
      
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading data...</p>
        </div>
      ) : (
        <>
          {optimizationComplete ? (
            <Row>
              <Col lg={12} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Header className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <FaRoute className="me-2" /> Optimization Results
                      </h5>
                      <div>
                        <Button 
                          variant="outline-secondary" 
                          className="me-2"
                          onClick={() => {
                            setOptimizationComplete(false);
                            setOptimizedRoute(null);
                          }}
                        >
                          <FaRedo className="me-1" /> Re-optimize
                        </Button>
                        <Button 
                          variant="primary"
                          onClick={handleSaveRoute}
                        >
                          <FaSave className="me-1" /> Save Optimized Route
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4} className="mb-4">
                        <div className="border rounded p-3 h-100">
                          <h6 className="border-bottom pb-2 mb-3">Route Summary</h6>
                          <p><strong>Stops:</strong> {optimizedRoute.stops.length}</p>
                          <p><strong>Distance:</strong> {optimizedRoute.distance}</p>
                          <p><strong>Duration:</strong> {optimizedRoute.duration}</p>
                          <p><strong>Deliveries:</strong> {optimizedRoute.stops.filter(s => s.type === 'delivery').length}</p>
                          
                          <div className="alert alert-success mt-3">
                            <h6>Optimization Savings</h6>
                            <p className="mb-1"><FaRoute className="me-1" /> Distance: {optimizedRoute.savings.distance}</p>
                            <p className="mb-1"><FaStopwatch className="me-1" /> Time: {optimizedRoute.savings.time}</p>
                            <p className="mb-0"><FaExchangeAlt className="me-1" /> Efficiency: +{optimizedRoute.savings.percentage}</p>
                          </div>
                        </div>
                      </Col>
                      
                      <Col md={8}>
                        <div className="border rounded p-3 mb-4">
                          <h6 className="border-bottom pb-2 mb-3">Optimized Route Map</h6>
                          <div className="bg-light p-4 text-center rounded mb-3" style={{ height: '200px' }}>
                            <FaMapMarkedAlt size={36} className="text-primary mb-2" />
                            <p>Route map visualization would be displayed here</p>
                          </div>
                        </div>
                        
                        <div className="border rounded p-3">
                          <h6 className="border-bottom pb-2 mb-3">Stop Sequence</h6>
                          <Table responsive bordered hover size="sm">
                            <thead>
                              <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th style={{ width: '100px' }}>Type</th>
                                <th>Location</th>
                                <th style={{ width: '100px' }}>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {optimizedRoute.stops.map((stop, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>
                                    {stop.type === 'depot' ? (
                                      <Badge bg="dark">Depot</Badge>
                                    ) : (
                                      <Badge bg="primary">Delivery</Badge>
                                    )}
                                  </td>
                                  <td>
                                    {stop.address}
                                    {stop.type === 'delivery' && stop.deliveryId && (
                                      <div className="small text-muted">
                                        {deliveries.find(d => d.id === stop.deliveryId)?.customer}
                                      </div>
                                    )}
                                  </td>
                                  <td>{stop.scheduledTime}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col lg={5} className="mb-4">
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">
                      <FaRoute className="me-2" /> Optimization Settings
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaMapMarkerAlt className="me-1" /> Start Location
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="startLocation"
                              value={optimizationSettings.startLocation}
                              onChange={handleSettingsChange}
                              placeholder="Enter starting point address"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaMapMarkerAlt className="me-1" /> End Location
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="endLocation"
                              value={optimizationSettings.endLocation}
                              onChange={handleSettingsChange}
                              placeholder="Enter ending point address"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Optimization Method</Form.Label>
                            <Form.Select
                              name="optimizationMethod"
                              value={optimizationSettings.optimizationMethod}
                              onChange={handleSettingsChange}
                            >
                              <option value="distance">Minimize Distance</option>
                              <option value="time">Minimize Time</option>
                              <option value="balanced">Balanced</option>
                              <option value="priority">Delivery Priority</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Vehicle Type</Form.Label>
                            <Form.Select
                              name="vehicleType"
                              value={optimizationSettings.vehicleType}
                              onChange={handleSettingsChange}
                            >
                              <option value="all">Any Available Vehicle</option>
                              <option value="Cargo Van">Cargo Van</option>
                              <option value="Box Truck">Box Truck</option>
                              <option value="Sprinter">Sprinter</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaUser className="me-1" /> Driver
                            </Form.Label>
                            <Form.Select
                              name="driverId"
                              value={optimizationSettings.driverId}
                              onChange={handleSettingsChange}
                            >
                              <option value="">Any Available Driver</option>
                              {drivers.map(driver => (
                                <option 
                                  key={driver.id} 
                                  value={driver.id}
                                  disabled={!driver.available}
                                >
                                  {driver.name} {!driver.available && '(Unavailable)'}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Stops</Form.Label>
                            <Form.Control
                              type="number"
                              name="maxStops"
                              value={optimizationSettings.maxStops}
                              onChange={handleSettingsChange}
                              min="2"
                              max="20"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Time Window</Form.Label>
                            <Form.Control
                              type="text"
                              name="timeWindow"
                              value={optimizationSettings.timeWindow}
                              onChange={handleSettingsChange}
                              placeholder="e.g. 8:00-17:00"
                            />
                          </Form.Group>
                        </Col>
                        
                        {routeId && (
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Original Route</Form.Label>
                              <div>
                                <Badge bg="primary">{originalRoute?.routeId}</Badge>{' '}
                                <span className="small text-muted">{originalRoute?.name}</span>
                              </div>
                            </Form.Group>
                          </Col>
                        )}
                      </Row>
                    </Form>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <div className="d-grid">
                      <Button 
                        variant="primary" 
                        onClick={handleOptimize}
                        disabled={isOptimizing || selectedDeliveries.length === 0}
                      >
                        {isOptimizing ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Optimizing...
                          </>
                        ) : (
                          <>
                            <FaExchangeAlt className="me-1" /> Optimize Route
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
                
                {isOptimizing && (
                  <Card className="shadow-sm">
                    <Card.Body className="text-center py-5">
                      <Spinner animation="border" variant="primary" className="mb-3" />
                      <h5>Optimizing Route</h5>
                      <p className="text-muted mb-0">
                        Calculating the most efficient route for your deliveries...
                      </p>
                    </Card.Body>
                  </Card>
                )}
              </Col>
              
              <Col lg={7}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <FaBoxOpen className="me-2" /> Select Deliveries
                      </h5>
                      <div className="d-flex align-items-center">
                        <span className="me-3">
                          <Badge bg="primary">{selectedDeliveries.length}</Badge> selected
                        </span>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={handleSelectAllDeliveries}
                        >
                          {selectedDeliveries.length === deliveries.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="p-3">
                      <Form.Control
                        type="text"
                        placeholder="Search deliveries..."
                        className="mb-3"
                      />
                    </div>
                    
                    <ListGroup variant="flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      {deliveries.map(delivery => (
                        <ListGroup.Item 
                          key={delivery.id}
                          className={`p-3 ${selectedDeliveries.includes(delivery.id) ? 'bg-light' : ''}`}
                          action
                          onClick={() => handleDeliverySelect(delivery.id)}
                        >
                          <div className="d-flex align-items-start">
                            <Form.Check 
                              type="checkbox"
                              className="me-3 mt-1"
                              checked={selectedDeliveries.includes(delivery.id)}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between">
                                <div className="fw-bold">
                                  {delivery.deliveryId} - {delivery.customer}
                                </div>
                                <div>
                                  {delivery.priority === 'expedited' && (
                                    <Badge bg="danger" className="me-1">Expedited</Badge>
                                  )}
                                  {delivery.assigned && (
                                    <Badge bg="info">Assigned</Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="small text-muted mt-1">{delivery.address}</div>
                              
                              <div className="d-flex justify-content-between small mt-2">
                                <div><FaBoxOpen className="me-1" /> {delivery.weight}</div>
                                <div><FaCalendarAlt className="me-1" /> {new Date(delivery.scheduledDate).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-muted">
                        {deliveries.length} deliveries available
                      </div>
                      <div>
                        <Button 
                          variant="primary"
                          onClick={handleOptimize}
                          disabled={isOptimizing || selectedDeliveries.length === 0}
                        >
                          <FaExchangeAlt className="me-1" /> Optimize Selected
                        </Button>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default RouteOptimizer;