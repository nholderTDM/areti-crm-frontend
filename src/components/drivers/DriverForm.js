import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaIdCard, FaUser, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import BackButton from '../common/BackButton';

const DriverForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeKey, setActiveKey] = useState('personal');
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseState: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    status: 'active',
    joinDate: '',
    areasCovered: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    bankDetails: {
      accountName: '',
      accountNumber: '',
      routingNumber: '',
      bankName: ''
    },
    documents: []
  });
  
  // Lists for selects
  const [serviceAreas, setServiceAreas] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  // Load driver data if in edit mode
  useEffect(() => {
    // Load service areas and vehicle types
    setServiceAreas([
      'North Zone',
      'South Zone', 
      'East Zone',
      'West Zone',
      'Central Zone',
      'Metro Area'
    ]);
    
    setVehicleTypes([
      'Compact Car',
      'Sedan',
      'SUV',
      'Cargo Van',
      'Box Truck',
      'Refrigerated Van'
    ]);
    
    if (isEditMode) {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data for the driver
        const mockDriver = {
          id: parseInt(id),
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          address: '123 Main St',
          city: 'Atlanta',
          state: 'GA',
          zip: '30303',
          licenseNumber: 'DL-123456789',
          licenseExpiry: '2026-05-15',
          licenseState: 'GA',
          vehicleType: 'Delivery Van',
          vehicleModel: 'Ford Transit',
          vehicleYear: '2023',
          licensePlate: 'ABC-1234',
          status: 'active',
          joinDate: '2022-03-10',
          areasCovered: ['North Zone', 'Central Zone'],
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '(555) 987-6543'
          },
          bankDetails: {
            accountName: 'John Doe',
            accountNumber: '****1234',
            routingNumber: '****5678',
            bankName: 'Atlanta Credit Union'
          },
          documents: [
            { id: 1, name: 'Driver License.pdf', type: 'license', uploaded: '2023-06-15' },
            { id: 2, name: 'Vehicle Insurance.pdf', type: 'insurance', uploaded: '2023-06-15' },
            { id: 3, name: 'Training Certificate.pdf', type: 'certificate', uploaded: '2023-01-20' }
          ]
        };
        
        setFormData(mockDriver);
        setIsLoading(false);
      }, 1000);
    } else {
      // Set default values for new driver
      const today = new Date().toISOString().split('T')[0];
      setFormData(prevState => ({
        ...prevState,
        joinDate: today,
        status: 'active'
      }));
    }
  }, [id, isEditMode]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
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
  
  // Handle checkbox change for service areas
  const handleAreaChange = (area) => {
    const updatedAreas = [...formData.areasCovered];
    
    if (updatedAreas.includes(area)) {
      // Remove area if already selected
      const index = updatedAreas.indexOf(area);
      updatedAreas.splice(index, 1);
    } else {
      // Add area if not selected
      updatedAreas.push(area);
    }
    
    setFormData({
      ...formData,
      areasCovered: updatedAreas
    });
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // In a real app, these would be uploaded to a server
    const newDocuments = files.map((file, index) => ({
      id: formData.documents.length + index + 1,
      name: file.name,
      type: 'other',
      uploaded: new Date().toISOString().split('T')[0]
    }));
    
    setFormData({
      ...formData,
      documents: [...formData.documents, ...newDocuments]
    });
  };
  
  // Handle document removal
  const handleRemoveDocument = (docId) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter(doc => doc.id !== docId)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError('');
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      setSaveError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    
    // In a real app, this would be an API call
    setTimeout(() => {
      console.log('Saving driver:', formData);
      setSaveSuccess(true);
      setIsLoading(false);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/drivers');
      }, 1500);
    }, 1000);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEditMode ? 'Edit Driver' : 'Add New Driver'}</h1>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/drivers')}
        >
          <FaTimes className="me-1" /> Cancel
        </Button>
      </div>
      
      {saveSuccess && (
        <Alert variant="success" className="mb-4">
          Driver {isEditMode ? 'updated' : 'created'} successfully!
        </Alert>
      )}
      
      {saveError && (
        <Alert variant="danger" className="mb-4">
          {saveError}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={9}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <Tab.Container activeKey={activeKey} onSelect={k => setActiveKey(k)}>
                  <Row>
                    <Col md={3}>
                      <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                          <Nav.Link eventKey="personal" className="d-flex align-items-center">
                            <FaUser className="me-2" /> Personal Info
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="license" className="d-flex align-items-center">
                            <FaIdCard className="me-2" /> License & Vehicle
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="areas" className="d-flex align-items-center">
                            <FaMapMarkerAlt className="me-2" /> Service Areas
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="emergency" className="d-flex align-items-center">
                            <FaUser className="me-2" /> Emergency Contact
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="payment" className="d-flex align-items-center">
                            <FaUser className="me-2" /> Payment Info
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="documents" className="d-flex align-items-center">
                            <FaUser className="me-2" /> Documents
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>
                    <Col md={9}>
                      <Tab.Content>
                        <Tab.Pane eventKey="personal">
                          <h5 className="mb-3">Personal Information</h5>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Row>
                            <Col md={5}>
                              <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="state"
                                  value={formData.state}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>ZIP Code</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="zip"
                                  value={formData.zip}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Join Date</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="joinDate"
                                  value={formData.joinDate}
                                  onChange={handleInputChange}
                                />
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
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                  <option value="on-leave">On Leave</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <div className="d-flex justify-content-between">
                            <div></div>
                            <Button 
                              variant="primary" 
                              onClick={() => setActiveKey('license')}
                            >
                              Next: License & Vehicle
                            </Button>
                          </div>
                        </Tab.Pane>
                        
                        <Tab.Pane eventKey="license">
                          <h5 className="mb-3">License Information</h5>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>License Number <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="text"
                                  name="licenseNumber"
                                  value={formData.licenseNumber}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="licenseState"
                                  value={formData.licenseState}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label>Expiration Date</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="licenseExpiry"
                                  value={formData.licenseExpiry}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <h5 className="mb-3 mt-4">Vehicle Information</h5>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Vehicle Type</Form.Label>
                                <Form.Select
                                  name="vehicleType"
                                  value={formData.vehicleType}
                                  onChange={handleInputChange}
                                >
                                  <option value="">-- Select Vehicle Type --</option>
                                  {vehicleTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Vehicle Model</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="vehicleModel"
                                  value={formData.vehicleModel}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Vehicle Year</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="vehicleYear"
                                  value={formData.vehicleYear}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>License Plate</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="licensePlate"
                                  value={formData.licensePlate}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <div className="d-flex justify-content-between">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setActiveKey('personal')}
                            >
                              Previous: Personal Info
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={() => setActiveKey('areas')}
                            >
                              Next: Service Areas
                            </Button>
                          </div>
                        </Tab.Pane>
                        
                        <Tab.Pane eventKey="areas">
                          <h5 className="mb-3">Service Areas</h5>
                          <p className="text-muted mb-4">Select the areas that this driver can service for deliveries.</p>
                          
                          <Row>
                            {serviceAreas.map((area, index) => (
                              <Col md={6} key={index}>
                                <Form.Check 
                                  type="checkbox"
                                  id={`area-${index}`}
                                  label={area}
                                  checked={formData.areasCovered.includes(area)}
                                  onChange={() => handleAreaChange(area)}
                                  className="mb-3"
                                />
                              </Col>
                            ))}
                          </Row>
                          
                          <div className="d-flex justify-content-between mt-3">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setActiveKey('license')}
                            >
                              Previous: License & Vehicle
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={() => setActiveKey('emergency')}
                            >
                              Next: Emergency Contact
                            </Button>
                          </div>
                        </Tab.Pane>
                        
                        <Tab.Pane eventKey="emergency">
                          <h5 className="mb-3">Emergency Contact</h5>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Contact Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="emergencyContact.name"
                              value={formData.emergencyContact.name}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Relationship</Form.Label>
                            <Form.Control
                              type="text"
                              name="emergencyContact.relationship"
                              value={formData.emergencyContact.relationship}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              name="emergencyContact.phone"
                              value={formData.emergencyContact.phone}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <div className="d-flex justify-content-between">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setActiveKey('areas')}
                            >
                              Previous: Service Areas
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={() => setActiveKey('payment')}
                            >
                              Next: Payment Info
                            </Button>
                          </div>
                        </Tab.Pane>
                        
                        <Tab.Pane eventKey="payment">
                          <h5 className="mb-3">Payment Information</h5>
                          <p className="text-muted mb-4">This information is used for processing payments to the driver.</p>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Account Holder Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="bankDetails.accountName"
                              value={formData.bankDetails.accountName}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Bank Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="bankDetails.bankName"
                              value={formData.bankDetails.bankName}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Account Number</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="bankDetails.accountNumber"
                                  value={formData.bankDetails.accountNumber}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Routing Number</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="bankDetails.routingNumber"
                                  value={formData.bankDetails.routingNumber}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Alert variant="info">
                            <small>
                              Payment information is encrypted and stored securely in compliance with financial regulations.
                            </small>
                          </Alert>
                          
                          <div className="d-flex justify-content-between">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setActiveKey('emergency')}
                            >
                              Previous: Emergency Contact
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={() => setActiveKey('documents')}
                            >
                              Next: Documents
                            </Button>
                          </div>
                        </Tab.Pane>
                        
                        <Tab.Pane eventKey="documents">
                          <h5 className="mb-3">Driver Documents</h5>
                          <p className="text-muted mb-4">Upload relevant documents like license, insurance, and certifications.</p>
                          
                          <Form.Group className="mb-4">
                            <Form.Label>Upload Documents</Form.Label>
                            <Form.Control
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                            />
                            <Form.Text className="text-muted">
                              You can upload multiple files at once. Accepted formats: PDF, JPG, PNG
                            </Form.Text>
                          </Form.Group>
                          
                          {formData.documents.length > 0 ? (
                            <div className="mb-4">
                              <h6>Uploaded Documents</h6>
                              <ul className="list-group">
                                {formData.documents.map(doc => (
                                  <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                      <span className="fw-bold">{doc.name}</span>
                                      <br />
                                      <small className="text-muted">Uploaded: {doc.uploaded}</small>
                                    </div>
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => handleRemoveDocument(doc.id)}
                                    >
                                      Remove
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <Alert variant="warning">
                              No documents uploaded yet.
                            </Alert>
                          )}
                          
                          <div className="d-flex justify-content-between">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setActiveKey('payment')}
                            >
                              Previous: Payment Info
                            </Button>
                            <div></div>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="d-flex justify-content-between">
                  {isEditMode && (
                    <Button 
                      variant="outline-danger" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this driver?')) {
                          // In a real app, this would be an API call
                          navigate('/drivers');
                        }
                      }}
                    >
                      <FaTrash className="me-1" /> Delete Driver
                    </Button>
                  )}
                  
                  <div className="ms-auto">
                    <Button 
                      variant="outline-secondary" 
                      className="me-2"
                      onClick={() => navigate('/drivers')}
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
                          <FaSave className="me-1" /> {isEditMode ? 'Update Driver' : 'Create Driver'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
          
          <Col lg={3}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Driver Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Name:</strong> {formData.name || 'Not set'}
                </div>
                
                <div className="mb-3">
                  <strong>Contact:</strong>
                  <div className="small text-muted">
                    {formData.email || 'No email'} | {formData.phone || 'No phone'}
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Status:</strong> {formData.status === 'active' ? 'Active' : formData.status === 'inactive' ? 'Inactive' : 'On Leave'}
                </div>
                
                <div className="mb-3">
                  <strong>Vehicle:</strong>
                  <div className="small text-muted">
                    {formData.vehicleType ? `${formData.vehicleType} (${formData.vehicleModel})` : 'Not assigned'}
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Areas:</strong>
                  <div>
                    {formData.areasCovered.length > 0 ? (
                      <div className="mt-1">
                        {formData.areasCovered.join(', ')}
                      </div>
                    ) : (
                      <div className="small text-muted">No areas selected</div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Documents:</strong>
                  <div className="small text-muted">
                    {formData.documents.length} documents uploaded
                  </div>
                </div>
                
                <hr />
                
                <div className="small text-muted">
                  <strong>Required fields</strong> are marked with <span className="text-danger">*</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default DriverForm;