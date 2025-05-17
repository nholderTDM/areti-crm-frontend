import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';
import BackButton from '../common/BackButton';
import PhoneContact from '../common/PhoneContact';

const CompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;    // Check if we are in edit mode; Will be true if id exists (editing) or false if it doesn't (creating new)
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    type: 'customer',
    size: 'small',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    revenue: '',
    employees: '',
    description: '',
    notes: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: ''
  });
  
  const [industries, setIndustries] = useState([
    'Transportation',
    'Retail',
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Financial Services',
    'Education',
    'Construction',
    'Agriculture',
    'Food & Beverage',
    'Hospitality',
    'Real Estate',
    'Energy',
    'Entertainment',
    'Other'
  ]);

  // Company types
  const companyTypes = [
    { value: 'customer', label: 'Customer' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'partner', label: 'Partner' },
    { value: 'competitor', label: 'Competitor' },
    { value: 'other', label: 'Other' }
  ];
  
  // Company sizes
  const companySizes = [
    { value: 'solo', label: 'Solo (1)' },
    { value: 'micro', label: 'Micro (2-10)' },
    { value: 'small', label: 'Small (11-50)' },
    { value: 'medium', label: 'Medium (51-200)' },
    { value: 'large', label: 'Large (201-1000)' },
    { value: 'enterprise', label: 'Enterprise (1000+)' }
  ];
  
  // Revenue ranges
  const revenueRanges = [
    { value: 'unknown', label: 'Unknown' },
    { value: '<$500K', label: 'Less than $500K' },
    { value: '$500K-1M', label: '$500K - $1M' },
    { value: '$1-5M', label: '$1M - $5M' },
    { value: '$5-10M', label: '$5M - $10M' },
    { value: '$10-50M', label: '$10M - $50M' },
    { value: '$50-100M', label: '$50M - $100M' },
    { value: '$100-500M', label: '$100M - $500M' },
    { value: '$500M+', label: '$500M+' }
  ];

  // Load company data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data for the company
        const mockCompany = {
          id: parseInt(id),
          name: 'ABC Logistics',
          industry: 'Transportation',
          type: 'customer',
          size: 'medium',
          website: 'www.abclogistics.com',
          email: 'info@abclogistics.com',
          phone: '(555) 123-4567',
          address: '123 Commerce St',
          city: 'Atlanta',
          state: 'GA',
          zip: '30303',
          country: 'USA',
          revenue: '$5-10M',
          employees: 150,
          description: 'Leading logistics provider in the southeast region, specializing in last-mile delivery.',
          notes: 'Key customer for our overnight delivery services. Looking to expand our partnership into same-day delivery.',
          linkedinUrl: 'linkedin.com/company/abclogistics',
          twitterUrl: 'twitter.com/abclogistics',
          facebookUrl: 'facebook.com/abclogistics'
        };
        
        setFormData(mockCompany);
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError('');
    
    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Validate required fields
        if (!formData.name || !formData.industry) {
          throw new Error('Please fill in all required fields');
        }
        
        // Save the company
        console.log('Saving company:', formData);
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/companies');
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
  title={isEditMode ? 'Edit Company' : 'Add New Company'}
  subtitle={isEditMode ? formData.name : "Create a new company"}
  backButton={true}
/>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          {isLoading && !formData.id ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading company data...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {saveSuccess && (
                <Alert variant="success" className="mb-4">
                  Company {isEditMode ? 'updated' : 'created'} successfully!
                </Alert>
              )}
              
              {saveError && (
                <Alert variant="danger" className="mb-4">
                  {saveError}
                </Alert>
              )}
              
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Company Information</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label>Industry <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">-- Select Industry --</option>
                          {industries.map((industry, index) => (
                            <option key={index} value={industry}>{industry}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Company Type</Form.Label>
                        <Form.Select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          {companyTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Company Size</Form.Label>
                        <Form.Select
                          name="size"
                          value={formData.size}
                          onChange={handleInputChange}
                        >
                          {companySizes.map(size => (
                            <option key={size.value} value={size.value}>{size.label}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Number of Employees</Form.Label>
                        <Form.Control
                          type="number"
                          name="employees"
                          value={formData.employees}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Annual Revenue</Form.Label>
                    <Form.Select
                      name="revenue"
                      value={formData.revenue}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Select Revenue Range --</option>
                      {revenueRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of the company..."
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Internal notes about this company..."
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <h5 className="mb-3">Contact Information</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="www.example.com"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="info@example.com"
                    />
                  </Form.Group>
                  
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
                  
                  <h5 className="mb-3 mt-4">Address</h5>
                  
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
                  
                  <h5 className="mb-3 mt-4">Social Media</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="linkedin.com/company/example"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Twitter URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleInputChange}
                      placeholder="twitter.com/example"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Facebook URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="facebookUrl"
                      value={formData.facebookUrl}
                      onChange={handleInputChange}
                      placeholder="facebook.com/example"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between mt-4">
                {isEditMode && (
                  <Button 
                    variant="outline-danger" 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this company?')) {
                        // In a real app, this would be an API call
                        navigate('/companies');
                      }
                    }}
                  >
                    <FaTrash className="me-1" /> Delete Company
                  </Button>
                )}
                
                <div className="ms-auto">
                  <Button 
                    variant="outline-secondary" 
                    className="me-2"
                    onClick={() => navigate('/companies')}
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
                        <FaSave className="me-1" /> {isEditMode ? 'Update Company' : 'Create Company'}
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

export default CompanyForm;