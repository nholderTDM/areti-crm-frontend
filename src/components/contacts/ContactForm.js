import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';
import PhoneContact from '../common/PhoneContact';

const ContactForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    mobile: '',
    type: 'customer',
    title: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    tags: [],
    notes: ''
  });
  
  const [companies, setCompanies] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Contact types
  const contactTypes = [
    { value: 'customer', label: 'Customer' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'partner', label: 'Partner' },
    { value: 'employee', label: 'Employee' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'other', label: 'Other' }
  ];

  // Predefined tags
  const predefinedTags = [
    'vip',
    'key-decision-maker',
    'frequent-contact',
    'partner',
    'vendor',
    'referral-source',
    'high-value',
    'management',
    'technical',
    'executive'
  ];

  // Load mock companies
  useEffect(() => {
    setCompanies([
      'ABC Logistics',
      'XYZ Retail',
      'Johnson Freight Services',
      'City Express Delivery',
      'Tech Solutions Inc.',
      'Davis Consulting',
      'Areti Alliance',
      'Global Shipping Co.'
    ]);
  }, []);

  // Load contact data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data for the contact
        const mockContact = {
          id: parseInt(id),
          firstName: 'John',
          lastName: 'Doe',
          company: 'ABC Logistics',
          email: 'john.doe@abclogistics.com',
          phone: '(555) 123-4567',
          mobile: '(555) 987-6543',
          type: 'customer',
          title: 'Operations Manager',
          address: '123 Main St',
          city: 'Atlanta',
          state: 'GA',
          zip: '30303',
          country: 'USA',
          tags: ['vip', 'key-decision-maker'],
          notes: 'Key decision maker for delivery services.'
        };
        
        setFormData(mockContact);
        setIsLoading(false);
      }, 1000);
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

  // Handle tag changes
  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSelectTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
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
        if (!formData.firstName || !formData.lastName || !formData.company || !formData.email) {
          throw new Error('Please fill in all required fields');
        }
        
        // Save the contact
        console.log('Saving contact:', formData);
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/contacts');
        }, 1500);
      } catch (error) {
        setSaveError(error.message);
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
  title={isEditMode ? 'Edit Contact' : 'Add New Contact'}
  subtitle={isEditMode ? `${formData.firstName} ${formData.lastName}` : "Create a new contact"}
  backButton={true}
/>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          {isLoading && !formData.id ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading contact data...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {saveSuccess && (
                <Alert variant="success" className="mb-4">
                  Contact {isEditMode ? 'updated' : 'created'} successfully!
                </Alert>
              )}
              
              {saveError && (
                <Alert variant="danger" className="mb-4">
                  {saveError}
                </Alert>
              )}
              
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Contact Information</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Company <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      list="companies"
                      required
                    />
                    <datalist id="companies">
                      {companies.map((company, index) => (
                        <option key={index} value={company} />
                      ))}
                    </datalist>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
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
                  
                  <Row>
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
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                          type="text"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      {contactTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <h5 className="mb-3">Address</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
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
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>State/Province</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <h5 className="mb-3 mt-4">Tags</h5>
                  
                  <div className="mb-3">
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        list="tagSuggestions"
                        className="me-2"
                      />
                      <Button 
                        variant="outline-primary"
                        onClick={handleAddTag}
                        disabled={!newTag}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                    <datalist id="tagSuggestions">
                      {predefinedTags.map((tag, index) => (
                        <option key={index} value={tag} />
                      ))}
                    </datalist>
                    
                    <div className="mt-2">
                      {predefinedTags.map(tag => (
                        <Button
                          key={tag}
                          variant={formData.tags.includes(tag) ? "primary" : "outline-secondary"}
                          size="sm"
                          className="me-2 mb-2"
                          onClick={() => handleSelectTag(tag)}
                        >
                          {tag.replace(/-/g, ' ')}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      {formData.tags.length > 0 && (
                        <div className="mb-2">Selected tags:</div>
                      )}
                      {formData.tags.map(tag => (
                        <div 
                          key={tag} 
                          className="badge bg-primary me-2 mb-2 p-2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag.replace(/-/g, ' ')} <FaTimes />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <h5 className="mb-3 mt-4">Notes</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Add notes about this contact..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between mt-4">
                {isEditMode && (
                  <Button 
                    variant="outline-danger" 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this contact?')) {
                        // In a real app, this would be an API call
                        navigate('/contacts');
                      }
                    }}
                  >
                    <FaTrash className="me-1" /> Delete Contact
                  </Button>
                )}
                
                <div className="ms-auto">
                  <Button 
                    variant="outline-secondary" 
                    className="me-2"
                    onClick={() => navigate('/contacts')}
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
                        <FaSave className="me-1" /> {isEditMode ? 'Update Contact' : 'Create Contact'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ContactForm;