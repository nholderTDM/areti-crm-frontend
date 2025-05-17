// src/components/routes/RouteForm.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, Alert, Table, Badge } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTruck, 
         FaPlus, FaMinus, FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const RouteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    routeId: '',
    name: '',
    date: '',
    status: 'scheduled',
    driverId: '',
    vehicleId: '',
    startLocation: '',
    endLocation: '',
    notes: '',
    stops: []
  });
  
  // Options for form dropdowns
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  
  // Route statuses
  const routeStatuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'delayed', label: 'Delayed' }
  ];
  
  // Load route data if in edit mode and fetch required data
  useEffect(() => {
    // Fetch dropdown options
    // Simulate API calls
    const mockDrivers = [
      { id: 1, name: 'David Wilson' },
      { id: 2, name: 'Sarah Johnson' },
      { id: 3, name: 'Michael Brown' },
      { id: 4, name: 'Jennifer Davis' },
      { id: 5, name: 'Robert Martinez' }
    ];
    
    const mockVehicles = [
      { id: 1, name: 'Cargo Van - AT-123', type: 'Cargo Van', licensePlate: 'AT-123', capacity: '1,000 lbs' },
      { id: 2, name: 'Box Truck - AT-456', type: 'Box Truck', licensePlate: 'AT-456', capacity: '5,000 lbs' },
      { id: 3, name: 'Cargo Van - AT-789', type: 'Cargo Van', licensePlate: 'AT-789', capacity: '1,000 lbs' },
      { id: 4, name: 'Sprinter - AT-321', type: 'Sprinter', licensePlate: 'AT-321', capacity: '3,000 lbs' },
      { id: 5, name: 'Box Truck - AT-654', type: 'Box Truck', licensePlate: 'AT-654', capacity: '5,000 lbs' }
    ];
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const mockDeliveries = [
      { 
        id: 1, 
        deliveryId: 'DEL-10015', 
        customer: 'Peachtree Office Supplies',
        contact: 'Sarah Johnson',
        phone: '(555) 123-4567',
        address: '101 Marietta St NW, Atlanta, GA 30303',
        scheduledDate: tomorrow
      },
      { 
        id: 2, 
        deliveryId: 'DEL-10016', 
        customer: 'GSU Business School',
        contact: 'Robert Chen',
        phone: '(555) 234-5678',
        address: '55 Park Place NE, Atlanta, GA 30303',
        scheduledDate: tomorrow
      },
      { 
        id: 3, 
        deliveryId: 'DEL-10017', 
        customer: 'Student Center',
        contact: 'James Wilson',
        phone: '(555) 345-6789',
        address: '100 Piedmont Ave NE, Atlanta, GA 30303',
        scheduledDate: tomorrow
      },
      { 
        id: 4, 
        deliveryId: 'DEL-10018', 
        customer: 'City Law Offices',
        contact: 'Amanda Garcia',
        phone: '(555) 456-7890',
        address: '30 Pryor St SW, Atlanta, GA 30303',
        scheduledDate: tomorrow
      },
      { 
        id: 5, 
        deliveryId: 'DEL-10019', 
        customer: 'Downtown Hotel',
        contact: 'Michael Brown',
        phone: '(555) 567-8901',
        address: '200 Peachtree St NE, Atlanta, GA 30303',
        scheduledDate: tomorrow
      },
      { 
        id: 6, 
        deliveryId: 'DEL-10020', 
        customer: 'Centennial Park Offices',
        contact: 'David Lee',
        phone: '(555) 678-9012',
        address: '265 Park Ave W NW, Atlanta, GA 30313',
        scheduledDate: tomorrow
      },
      { 
        id: 7, 
        deliveryId: 'DEL-10021', 
        customer: 'CNN Center',
        contact: 'Lisa Miller',
        phone: '(555) 789-0123',
        address: '190 Marietta St NW, Atlanta, GA 30303',
        scheduledDate: tomorrow
      }
    ];
    
    setDrivers(mockDrivers);
    setVehicles(mockVehicles);
    setDeliveries(mockDeliveries);
    
    if (isEditMode) {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data for the route
        const today = new Date();
        
        const mockRoute = {
          id: parseInt(id),
          routeId: 'RT-10001',
          name: 'Downtown Atlanta Delivery Route',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0],
          status: 'scheduled',
          driverId: 1,
          vehicleId: 3,
          startLocation: '123 Warehouse St, Atlanta, GA 30303',
          endLocation: '123 Warehouse St, Atlanta, GA 30303',
          notes: 'This route covers the downtown Atlanta business district. Several deliveries require security check-in.',
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
          ]
        };
        
        setFormData({
          ...mockRoute,
          stops: mockRoute.stops.map(stop => {
            if (stop.type === 'delivery' && stop.deliveryId) {
              const delivery = mockDeliveries.find(d => d.id === stop.deliveryId);
              return {
                ...stop,
                deliveryDetails: delivery || null
              };
            }
            return stop;
          })
        });
        setIsLoading(false);
      }, 1000);
    } else {
      // Set default values for new route
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const warehouseAddress = '123 Warehouse St, Atlanta, GA 30303';
      const newRouteId = `RT-${10000 + Math.floor(Math.random() * 90000)}`;
      
      setFormData(prev => ({
        ...prev,
        routeId: newRouteId,
        date: tomorrow.toISOString().split('T')[0],
        startLocation: warehouseAddress,
        endLocation: warehouseAddress,
        stops: [
          {
            id: Date.now(),
            type: 'depot',
            address: warehouseAddress,
            scheduledTime: '08:00',
            notes: 'Route start'
          }
        ]
      }));
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle driver selection
  const handleDriverSelect = (driverId) => {
    setFormData({
      ...formData,
      driverId: parseInt(driverId)
    });
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId) => {
    setFormData({
      ...formData,
      vehicleId: parseInt(vehicleId)
    });
  };

  // Handle stop type change
  const handleStopTypeChange = (index, type) => {
    const updatedStops = [...formData.stops];
    updatedStops[index] = {
      ...updatedStops[index],
      type,
      // Clear delivery ID if it's not a delivery anymore
      deliveryId: type === 'delivery' ? updatedStops[index].deliveryId : null,
      deliveryDetails: type === 'delivery' ? updatedStops[index].deliveryDetails : null
    };
    
    setFormData({
      ...formData,
      stops: updatedStops
    });
  };

  // Handle stop delivery selection
  const handleStopDeliverySelect = (index, deliveryId) => {
    const delivery = deliveries.find(d => d.id === parseInt(deliveryId));
    
    const updatedStops = [...formData.stops];
    updatedStops[index] = {
      ...updatedStops[index],
      deliveryId: parseInt(deliveryId),
      deliveryDetails: delivery || null,
      address: delivery ? delivery.address : updatedStops[index].address
    };
    
    setFormData({
      ...formData,
      stops: updatedStops
    });
  };

  // Handle stop input change
  const handleStopInputChange = (index, field, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index] = {
      ...updatedStops[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      stops: updatedStops
    });
  };

  // Add new stop
  const addStop = () => {
    const newStop = {
      id: Date.now(),
      type: 'delivery',
      address: '',
      scheduledTime: '',
      notes: ''
    };
    
    setFormData({
      ...formData,
      stops: [...formData.stops, newStop]
    });
  };

  // Add a depot stop at the end
  const addDepotStop = () => {
    const newStop = {
      id: Date.now(),
      type: 'depot',
      address: formData.endLocation || formData.startLocation,
      scheduledTime: '',
      notes: 'Route end - return to warehouse'
    };
    
    setFormData({
      ...formData,
      stops: [...formData.stops, newStop]
    });
  };

  // Remove stop
  const removeStop = (index) => {
    const updatedStops = [...formData.stops];
    updatedStops.splice(index, 1);
    
    setFormData({
      ...formData,
      stops: updatedStops
    });
  };

  // Move stop up
  const moveStopUp = (index) => {
    if (index === 0) return;
    
    const updatedStops = [...formData.stops];
    const temp = updatedStops[index];
    updatedStops[index] = updatedStops[index - 1];
    updatedStops[index - 1] = temp;
    
    setFormData({
      ...formData,
      stops: updatedStops
    });
  };

  // Move stop down
  const moveStopDown = (index) => {
    if (index === formData.stops.length - 1) return;
    
    const updatedStops = [...formData.stops];
    const temp = updatedStops[index];
    updatedStops[index] = updatedStops[index + 1];
    updatedStops[index + 1] = temp;
    
    setFormData({
      ...formData,
      stops: updatedStops
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Route name is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.driverId) {
      errors.driverId = 'Please select a driver';
    }
    
    if (!formData.vehicleId) {
      errors.vehicleId = 'Please select a vehicle';
    }
    
    if (!formData.startLocation.trim()) {
      errors.startLocation = 'Start location is required';
    }
    
    if (!formData.endLocation.trim()) {
      errors.endLocation = 'End location is required';
    }
    
    if (formData.stops.length < 2) {
      errors.stops = 'Route must have at least 2 stops';
    }
    
    // Validate stops
    const stopErrors = [];
    let hasStopErrors = false;
    
    formData.stops.forEach((stop, index) => {
      const stopError = {};
      
      if (!stop.address.trim()) {
        stopError.address = 'Address is required';
        hasStopErrors = true;
      }
      
      if (!stop.scheduledTime) {
        stopError.scheduledTime = 'Time is required';
        hasStopErrors = true;
      }
      
      if (stop.type === 'delivery' && !stop.deliveryId) {
        stopError.deliveryId = 'Please select a delivery';
        hasStopErrors = true;
      }
      
      stopErrors[index] = stopError;
    });
    
    if (hasStopErrors) {
      errors.stopErrors = stopErrors;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSaveError('');
    
    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Save the route
        console.log('Saving route:', formData);
        
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/routes');
        }, 1500);
      } catch (error) {
        setSaveError(error.message || 'An error occurred while saving the route');
        setIsLoading(false);
      }
    }, 1000);
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

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={isEditMode ? 'Edit Route' : 'Create New Route'}
        backButton={true}
      />
      
      <Form onSubmit={handleSubmit}>
        {saveSuccess && (
          <Alert variant="success" className="mb-4">
            Route {isEditMode ? 'updated' : 'created'} successfully!
          </Alert>
        )}
        
        {saveError && (
          <Alert variant="danger" className="mb-4">
            {saveError}
          </Alert>
        )}
        
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Route Information</h5>
          </Card.Header>
          <Card.Body>
            {isLoading && isEditMode ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading route data...</p>
              </div>
            ) : (
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Route ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="routeId"
                      value={formData.routeId}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Route Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.name}
                      placeholder="e.g., Downtown Atlanta Delivery Route"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaCalendarAlt className="me-1" />
                      Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.date}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.date}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      {routeStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser className="me-1" />
                      Driver <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={formData.driverId || ''}
                      onChange={(e) => handleDriverSelect(e.target.value)}
                      isInvalid={!!formErrors.driverId}
                      required
                    >
                      <option value="">-- Select Driver --</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.driverId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaTruck className="me-1" />
                      Vehicle <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={formData.vehicleId || ''}
                      onChange={(e) => handleVehicleSelect(e.target.value)}
                      isInvalid={!!formErrors.vehicleId}
                      required
                    >
                      <option value="">-- Select Vehicle --</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.capacity})
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.vehicleId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaMapMarkerAlt className="me-1" />
                      Start Location <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="startLocation"
                      value={formData.startLocation}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.startLocation}
                      placeholder="Enter warehouse or starting point address"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.startLocation}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaMapMarkerAlt className="me-1" />
                      End Location <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="endLocation"
                      value={formData.endLocation}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.endLocation}
                      placeholder="Enter warehouse or ending point address"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.endLocation}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes about this route"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
        
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Route Stops</h5>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={addStop}
              >
                <FaPlus className="me-1" /> Add Delivery Stop
              </Button>
              <Button 
                variant="outline-dark" 
                size="sm"
                onClick={addDepotStop}
              >
                <FaPlus className="me-1" /> Add Depot Stop
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {isLoading && isEditMode ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading route data...</p>
              </div>
            ) : (
              <>
                {formErrors.stops && (
                  <Alert variant="danger" className="mb-3">
                    {formErrors.stops}
                  </Alert>
                )}
                
                {formData.stops.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">No stops added to this route yet.</p>
                    <Button 
                      variant="primary"
                      onClick={addStop}
                    >
                      <FaPlus className="me-1" /> Add Stop
                    </Button>
                  </div>
                ) : (
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>#</th>
                        <th style={{ width: '120px' }}>Type</th>
                        <th>Address / Delivery</th>
                        <th style={{ width: '150px' }}>Time</th>
                        <th style={{ width: '200px' }}>Notes</th>
                        <th style={{ width: '180px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.stops.map((stop, index) => (
                        <tr key={stop.id}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={stop.type}
                              onChange={(e) => handleStopTypeChange(index, e.target.value)}
                            >
                              <option value="depot">Depot</option>
                              <option value="delivery">Delivery</option>
                              <option value="pickup">Pickup</option>
                            </Form.Select>
                          </td>
                          <td>
                            {stop.type === 'delivery' ? (
                              <Form.Group>
                                <Form.Select
                                  size="sm"
                                  value={stop.deliveryId || ''}
                                  onChange={(e) => handleStopDeliverySelect(index, e.target.value)}
                                  isInvalid={formErrors.stopErrors && formErrors.stopErrors[index]?.deliveryId}
                                >
                                  <option value="">-- Select Delivery --</option>
                                  {deliveries.map(delivery => (
                                    <option key={delivery.id} value={delivery.id}>
                                      {delivery.deliveryId} - {delivery.customer}
                                    </option>
                                  ))}
                                </Form.Select>
                                {stop.deliveryDetails && (
                                  <div className="small text-muted mt-1">
                                    {stop.deliveryDetails.address}
                                  </div>
                                )}
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.stopErrors && formErrors.stopErrors[index]?.deliveryId}
                                </Form.Control.Feedback>
                              </Form.Group>
                            ) : (
                              <Form.Control
                                size="sm"
                                type="text"
                                value={stop.address || ''}
                                onChange={(e) => handleStopInputChange(index, 'address', e.target.value)}
                                isInvalid={formErrors.stopErrors && formErrors.stopErrors[index]?.address}
                              />
                            )}
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              type="time"
                              value={stop.scheduledTime || ''}
                              onChange={(e) => handleStopInputChange(index, 'scheduledTime', e.target.value)}
                              isInvalid={formErrors.stopErrors && formErrors.stopErrors[index]?.scheduledTime}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              type="text"
                              value={stop.notes || ''}
                              onChange={(e) => handleStopInputChange(index, 'notes', e.target.value)}
                            />
                          </td>
                          <td>
                            <div className="d-flex">
                              <Button
                                variant="light"
                                size="sm"
                                className="me-1"
                                onClick={() => moveStopUp(index)}
                                disabled={index === 0}
                              >
                                <FaArrowUp />
                              </Button>
                              <Button
                                variant="light"
                                size="sm"
                                className="me-1"
                                onClick={() => moveStopDown(index)}
                                disabled={index === formData.stops.length - 1}
                              >
                                <FaArrowDown />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeStop(index)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                
                <div className="text-center mt-3">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => addStop()}
                  >
                    <FaPlus className="me-1" /> Add Delivery Stop
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
          {!isLoading && (
            <Card.Footer className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {formData.stops.length > 0 && (
                    <div className="text-muted">
                      {formData.stops.length} stops in this route
                    </div>
                  )}
                </div>
                <div>
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => {
                      // Simulate route optimization
                      alert('Route optimization would be implemented in a real application');
                    }}
                  >
                    <FaExchangeAlt className="me-1" /> Optimize Route
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    <FaSave className="me-1" /> Save Route
                  </Button>
                </div>
              </div>
            </Card.Footer>
          )}
        </Card>
        
        <div className="d-flex justify-content-between mt-4">
          {isEditMode && (
            <Button 
              variant="outline-danger" 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this route?')) {
                  // In a real app, this would be an API call
                  navigate('/routes');
                }
              }}
            >
              <FaTrash className="me-1" /> Delete Route
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default RouteForm;