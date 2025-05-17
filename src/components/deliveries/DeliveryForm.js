import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Tab, Tabs, ListGroup, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageTitle from '../common/PageTitle';
import { FaSave, FaTimes, FaTrash, FaPlus, FaMinus, FaMapMarkerAlt, FaBuilding, FaUser, FaTruck, FaBox, FaCalendarAlt, FaClock } from 'react-icons/fa';
import PhoneContact from '../common/PhoneContact';

const DeliveryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState('customer');
  const [formData, setFormData] = useState({
    deliveryId: '',
    customer: {
      id: '',
      name: '',
      contact: '',
      phone: ''
    },
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    scheduledDate: '',
    scheduledTime: '',
    driver: {
      id: '',
      name: ''
    },
    vehicle: '',
    items: [
      { id: 1, description: '', quantity: 1, weight: '', dimensions: '' }
    ],
    notes: '',
    priority: 'standard',
    amount: '',
    paymentStatus: 'pending',
    paymentMethod: 'invoice',
    referenceNumber: '',
    instructions: '',
    status: 'scheduled'
  });
  
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  
  // Delivery statuses
  const deliveryStatuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'delayed', label: 'Delayed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'failed', label: 'Failed' }
  ];
  
  // Delivery priorities
  const deliveryPriorities = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'standard', label: 'Standard' },
    { value: 'low', label: 'Low' }
  ];
  
  // Payment statuses
  const paymentStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'partial', label: 'Partial' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  // Payment methods
  const paymentMethods = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' }
  ];

  // Load delivery data if in edit mode
  useEffect(() => {
    // Load customers, drivers, and vehicles
    setCustomers([
      { id: 1, name: 'ABC Logistics', contact: 'John Doe', phone: '(555) 123-4567' },
      { id: 2, name: 'XYZ Retail', contact: 'Jane Smith', phone: '(555) 234-5678' },
      { id: 3, name: 'Tech Solutions Inc.', contact: 'Robert Brown', phone: '(555) 345-6789' },
      { id: 4, name: 'Global Shipping Co.', contact: 'Lisa Martinez', phone: '(555) 456-7890' },
      { id: 5, name: 'Metro Electronics', contact: 'Daniel Clark', phone: '(555) 567-8901' }
    ]);
    
    setDrivers([
      { id: 1, name: 'Michael Rodriguez', phone: '(555) 987-6543' },
      { id: 2, name: 'Sarah Johnson', phone: '(555) 876-5432' },
      { id: 3, name: 'David Wilson', phone: '(555) 765-4321' }
    ]);
    
    setVehicles([
      'Box Truck - AT-123',
      'Sprinter Van - AT-456',
      'Cargo Van - AT-789',
      'Semi Truck - AT-101',
      'Refrigerated Van - AT-202'
    ]);
    
    if (isEditMode) {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data for the delivery
        const today = new Date();
        const scheduledDate = new Date(today);
        scheduledDate.setHours(14, 0, 0);
        
        const scheduleDateString = scheduledDate.toISOString().split('T')[0];
        const scheduleTimeString = scheduledDate.toTimeString().split(' ')[0].substring(0, 5);
        
        const mockDelivery = {
          id: parseInt(id),
          deliveryId: 'DEL-10003',
          customer: {
            id: 3,
            name: 'Tech Solutions Inc.',
            contact: 'Robert Brown',
            phone: '(555) 345-6789'
          },
          pickupAddress: '123 Warehouse St',
          pickupCity: 'Atlanta',
          pickupState: 'GA',
          pickupZip: '30303',
          deliveryAddress: '101 Tech Park',
          deliveryCity: 'Norcross',
          deliveryState: 'GA',
          deliveryZip: '30092',
          scheduledDate: scheduleDateString,
          scheduledTime: scheduleTimeString,
          driver: {
            id: 3,
            name: 'David Wilson'
          },
          vehicle: 'Cargo Van - AT-789',
          items: [
            { id: 1, description: 'Servers', quantity: 2, weight: '150 lbs', dimensions: '24x36x12 in' },
            { id: 2, description: 'Networking Equipment', quantity: 5, weight: '50 lbs', dimensions: '12x12x12 in' }
          ],
          notes: 'Fragile equipment. Requires IT staff signature.',
          priority: 'urgent',
          amount: 400.00,
          paymentStatus: 'pending',
          paymentMethod: 'invoice',
          referenceNumber: 'PO-12345',
          instructions: 'Deliver to receiving dock at rear of building. Call contact 15 minutes before arrival.',
          status: 'in-progress'
        };
        
        setFormData(mockDelivery);
        setIsLoading(false);
      }, 1000);
    } else {
      // Set default values for new delivery
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      const defaultDate = tomorrow.toISOString().split('T')[0];
      const defaultTime = tomorrow.toTimeString().split(' ')[0].substring(0, 5);
      
      const newDeliveryId = `DEL-${10000 + Math.floor(Math.random() * 90000)}`;
      
      setFormData(prev => ({
        ...prev,
        deliveryId: newDeliveryId,
        scheduledDate: defaultDate,
        scheduledTime: defaultTime
      }));
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (customer, driver)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle customer selection
  const handleCustomerSelect = (customerId) => {
    const selectedCustomer = customers.find(c => c.id === parseInt(customerId));
    if (selectedCustomer) {
      setFormData({
        ...formData,
        customer: {
          id: selectedCustomer.id,
          name: selectedCustomer.name,
          contact: selectedCustomer.contact,
          phone: selectedCustomer.phone
        }
      });
    }
  };
  
  // Handle driver selection
  const handleDriverSelect = (driverId) => {
    const selectedDriver = drivers.find(d => d.id === parseInt(driverId));
    if (selectedDriver) {
      setFormData({
        ...formData,
        driver: {
          id: selectedDriver.id,
          name: selectedDriver.name
        }
      });
    }
  };
  
  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  // Add new item
  const handleAddItem = () => {
    const newItem = {
      id: formData.items.length + 1,
      description: '',
      quantity: 1,
      weight: '',
      dimensions: ''
    };
    
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };
  
  // Remove item
  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) return;
    
    const updatedItems = formData.items.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError('');
    
    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Validate required fields
        if (!formData.customer.id || !formData.pickupAddress || !formData.deliveryAddress || 
            !formData.scheduledDate || !formData.scheduledTime || !formData.driver.id) {
          throw new Error('Please fill in all required fields');
        }
        
        // Validate items
        if (formData.items.some(item => !item.description || !item.quantity)) {
          throw new Error('Please fill in all item details');
        }
        
        // Save the delivery
        console.log('Saving delivery:', formData);
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/deliveries');
        }, 1500);
      } catch (error) {
        setSaveError(error.message);
        setIsLoading(false);
      }
    }, 1000);
  };

  // Calculate full addresses
  const getFullPickupAddress = () => {
    return `${formData.pickupAddress}, ${formData.pickupCity}, ${formData.pickupState} ${formData.pickupZip}`;
  };
  
  const getFullDeliveryAddress = () => {
    return `${formData.deliveryAddress}, ${formData.deliveryCity}, ${formData.deliveryState} ${formData.deliveryZip}`;
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={isEditMode ? 'Edit Delivery' : 'Add New Delivery'}
        subtitle={isEditMode ? formData.deliveryId : "Create a new delivery"}
        backButton={true}
      />
      
      <Form onSubmit={handleSubmit}>
        {saveSuccess && (
          <Alert variant="success" className="mb-4">
            Delivery {isEditMode ? 'updated' : 'created'} successfully!
          </Alert>
        )}
        
        {saveError && (
          <Alert variant="danger" className="mb-4">
            {saveError}
          </Alert>
        )}
        
        <Row>
          <Col lg={9}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-0"
                >
                  <Tab eventKey="customer" title="Customer & Addresses">
                    <div className="pt-3">
                      <Row className="mb-3">
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Delivery ID</Form.Label>
                            <Form.Control
                              type="text"
                              name="deliveryId"
                              value={formData.deliveryId}
                              onChange={handleInputChange}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label>Select Customer <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                              value={formData.customer.id}
                              onChange={(e) => handleCustomerSelect(e.target.value)}
                              required
                            >
                              <option value="">-- Select Customer --</option>
                              {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                  {customer.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Contact Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="customer.contact"
                              value={formData.customer.contact}
                              onChange={handleInputChange}
                              placeholder="Contact person"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                        <Form.Group as={Row} className="mb-3">
  <Form.Label column sm={3}>Phone</Form.Label>
  <Col sm={9}>
    <div className="d-flex align-items-center">
      <Form.Control
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="Enter phone number"
      />
      {isEditMode && formData.phone && (
        <div className="ms-2">
          <PhoneContact phoneNumber={formData.phone} buttonVariant="outline-secondary" />
        </div>
      )}
    </div>
  </Col>
</Form.Group>
                        </Col>
                      </Row>
                      
                      <hr />
                      
                      <h5 className="mb-3">
                        <FaMapMarkerAlt className="me-2 text-primary" />
                        Pickup Location
                      </h5>
                      
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Pickup Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              name="pickupAddress"
                              value={formData.pickupAddress}
                              onChange={handleInputChange}
                              placeholder="Street address"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={5}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="pickupCity"
                              value={formData.pickupCity}
                              onChange={handleInputChange}
                              placeholder="City"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              name="pickupState"
                              value={formData.pickupState}
                              onChange={handleInputChange}
                              placeholder="State"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>ZIP Code</Form.Label>
                            <Form.Control
                              type="text"
                              name="pickupZip"
                              value={formData.pickupZip}
                              onChange={handleInputChange}
                              placeholder="ZIP Code"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <hr />
                      
                      <h5 className="mb-3">
                        <FaMapMarkerAlt className="me-2 text-danger" />
                        Delivery Location
                      </h5>
                      
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Delivery Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              name="deliveryAddress"
                              value={formData.deliveryAddress}
                              onChange={handleInputChange}
                              placeholder="Street address"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={5}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="deliveryCity"
                              value={formData.deliveryCity}
                              onChange={handleInputChange}
                              placeholder="City"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              name="deliveryState"
                              value={formData.deliveryState}
                              onChange={handleInputChange}
                              placeholder="State"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>ZIP Code</Form.Label>
                            <Form.Control
                              type="text"
                              name="deliveryZip"
                              value={formData.deliveryZip}
                              onChange={handleInputChange}
                              placeholder="ZIP Code"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  <Tab eventKey="schedule" title="Schedule & Driver">
                    <div className="pt-3">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaCalendarAlt className="me-2" />
                              Scheduled Date <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="scheduledDate"
                              value={formData.scheduledDate}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaClock className="me-2" />
                              Scheduled Time <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="time"
                              name="scheduledTime"
                              value={formData.scheduledTime}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <hr />
                      
                      <h5 className="mb-3">
                        <FaUser className="me-2 text-primary" />
                        Driver Assignment
                      </h5>
                      
                      <Row>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label>Assign Driver <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                              value={formData.driver.id}
                              onChange={(e) => handleDriverSelect(e.target.value)}
                              required
                            >
                              <option value="">-- Select Driver --</option>
                              {drivers.map(driver => (
                                <option key={driver.id} value={driver.id}>
                                  {driver.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Vehicle</Form.Label>
                            <Form.Select
                              name="vehicle"
                              value={formData.vehicle}
                              onChange={handleInputChange}
                            >
                              <option value="">-- Select Vehicle --</option>
                              {vehicles.map((vehicle, index) => (
                                <option key={index} value={vehicle}>
                                  {vehicle}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <hr />
                      
                      <h5 className="mb-3">
                        <FaTruck className="me-2 text-info" />
                        Delivery Settings
                      </h5>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                              name="priority"
                              value={formData.priority}
                              onChange={handleInputChange}
                            >
                              {deliveryPriorities.map(priority => (
                                <option key={priority.value} value={priority.value}>
                                  {priority.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                            >
                              {deliveryStatuses.map(status => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  <Tab eventKey="items" title="Items & Cargo">
                    <div className="pt-3">
                      <h5 className="mb-3">
                        <FaBox className="me-2 text-primary" />
                        Delivery Items
                      </h5>
                      
                      {formData.items.map((item, index) => (
                        <div key={index} className="item-row mb-3 p-3 border rounded">
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                  placeholder="Item description"
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group className="mb-3">
                                <Form.Label>Quantity <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group className="mb-3">
                                <Form.Label>Weight</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={item.weight}
                                  onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                                  placeholder="e.g., 50 lbs"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group className="mb-3">
                                <Form.Label>Dimensions</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={item.dimensions}
                                  onChange={(e) => handleItemChange(index, 'dimensions', e.target.value)}
                                  placeholder="e.g., 12x12x12"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="text-end">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              disabled={formData.items.length <= 1}
                            >
                              <FaMinus className="me-1" /> Remove Item
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center my-3">
                        <Button
                          variant="outline-primary"
                          onClick={handleAddItem}
                        >
                          <FaPlus className="me-1" /> Add Another Item
                        </Button>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="payment" title="Payment & Notes">
                    <div className="pt-3">
                      <h5 className="mb-3">Payment Information</h5>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Amount ($)</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>$</InputGroup.Text>
                              <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Payment Status</Form.Label>
                            <Form.Select
                              name="paymentStatus"
                              value={formData.paymentStatus}
                              onChange={handleInputChange}
                            >
                              {paymentStatuses.map(status => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Select
                              name="paymentMethod"
                              value={formData.paymentMethod}
                              onChange={handleInputChange}
                            >
                              {paymentMethods.map(method => (
                                <option key={method.value} value={method.value}>
                                  {method.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Reference Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="referenceNumber"
                          value={formData.referenceNumber}
                          onChange={handleInputChange}
                          placeholder="e.g., PO Number, Invoice Number"
                        />
                      </Form.Group>
                      
                      <hr />
                      
                      <h5 className="mb-3">Notes & Instructions</h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Special Instructions</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="instructions"
                          value={formData.instructions}
                          onChange={handleInputChange}
                          placeholder="Delivery instructions, access codes, etc."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Internal Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Notes for internal use only"
                        />
                      </Form.Group>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  {isEditMode && (
                    <Button 
                      variant="outline-danger" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this delivery?')) {
                          // In a real app, this would be an API call
                          navigate('/deliveries');
                        }
                      }}
                    >
                      <FaTrash className="me-1" /> Delete Delivery
                    </Button>
                  )}
                  
                  <div className="ms-auto">
                    <Button 
                      variant="outline-secondary" 
                      className="me-2"
                      onClick={() => navigate('/deliveries')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-1" /> {isEditMode ? 'Update Delivery' : 'Create Delivery'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Delivery Summary</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                    <strong>Delivery ID:</strong>
                    <span>{formData.deliveryId}</span>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2">
                    <div className="mb-1"><strong>Customer:</strong></div>
                    <div>{formData.customer.name || 'Not selected'}</div>
                    {formData.customer.contact && (
                      <div className="small text-muted mt-1">
                        Contact: {formData.customer.contact}
                      </div>
                    )}
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2">
                    <div className="mb-1"><strong>Pickup Location:</strong></div>
                    <div className="small">{getFullPickupAddress() || 'Not set'}</div>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2">
                    <div className="mb-1"><strong>Delivery Location:</strong></div>
                    <div className="small">{getFullDeliveryAddress() || 'Not set'}</div>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2">
                    <div className="mb-1"><strong>Scheduled Time:</strong></div>
                    <div>
                      {formData.scheduledDate && formData.scheduledTime
                        ? `${formData.scheduledDate} at ${formData.scheduledTime}`
                        : 'Not scheduled'}
                    </div>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2">
                    <div className="mb-1"><strong>Driver & Vehicle:</strong></div>
                    <div>{formData.driver.name || 'Not assigned'}</div>
                    {formData.vehicle && (
                      <div className="small text-muted mt-1">
                        Vehicle: {formData.vehicle}
                      </div>
                    )}
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2">
                    <div className="mb-1"><strong>Items:</strong></div>
                    <div className="small">
                      {formData.items.filter(item => item.description).map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.quantity}x {item.description}
                          {item.weight && ` (${item.weight})`}
                        </div>
                      ))}
                      {!formData.items.some(item => item.description) && 'No items added'}
                    </div>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                    <strong>Amount:</strong>
                    <span>${parseFloat(formData.amount || 0).toFixed(2)}</span>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                    <strong>Priority:</strong>
                    <span className="text-capitalize">{formData.priority}</span>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                    <strong>Status:</strong>
                    <span className="text-capitalize">{formData.status}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Help</h5>
              </Card.Header>
              <Card.Body>
                <p className="small mb-2">
                  <strong>Required fields</strong> are marked with <span className="text-danger">*</span>
                </p>
                <p className="small mb-2">
                  Use the tabs above to navigate through different sections of the delivery form.
                </p>
                <p className="small mb-0">
                  The summary card on the right shows a preview of the delivery details as you fill them in.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DeliveryForm;