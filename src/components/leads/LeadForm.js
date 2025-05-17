import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import BackButton from '../common/BackButton';
import PhoneContact from '../common/PhoneContact';
import { getLead, createLead, updateLead, deleteLead } from '../../services/leadService';
import axios from 'axios';

const LeadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [dateError, setDateError] = useState('');
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    status: 'new',
    source: 'website',
    notes: '',
    value: '',
    address: '',
    nextFollowUp: ''
  });

  // Lead statuses and colors
  const leadStatuses = [
    { value: 'new', label: 'New', color: 'primary' },
    { value: 'contacted', label: 'Contacted', color: 'info' },
    { value: 'qualified', label: 'Qualified', color: 'warning' },
    { value: 'proposal', label: 'Proposal', color: 'secondary' },
    { value: 'negotiation', label: 'Negotiation', color: 'light' },
    { value: 'closed-won', label: 'Closed (Won)', color: 'success' },
    { value: 'closed-lost', label: 'Closed (Lost)', color: 'danger' }
  ];

  // Lead sources
  const leadSources = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email-campaign', label: 'Email Campaign' },
    { value: 'cold-call', label: 'Cold Call' },
    { value: 'lead-generator', label: 'Lead Generator' },
    { value: 'event', label: 'Event/Trade Show' },
    { value: 'other', label: 'Other' }
  ];

  // Load lead data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchLead = async () => {
        setIsLoading(true);
        try {
          // Try API first
          try {
            const response = await getLead(id);
            setFormData(response.data);
          } catch (apiError) {
            console.warn("API fetch failed, falling back to localStorage:", apiError);
            
            // If API fails, try localStorage
            const storedLeads = localStorage.getItem('crmLeads');
            if (storedLeads) {
              const leadsArray = JSON.parse(storedLeads);
              const foundLead = leadsArray.find(lead => lead.id === id);
              if (foundLead) {
                setFormData(foundLead);
                setUsingLocalStorage(true);
              } else {
                throw new Error('Lead not found in localStorage');
              }
            } else {
              throw new Error('No leads found in localStorage');
            }
          }
        } catch (error) {
          setSaveError('Failed to load lead data: ' + error.message);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchLead();
    }
  }, [id, isEditMode]);

  // Format date for datetime-local input
  const formatDatetimeLocal = (dateString) => {
    if (!dateString) return '';
    
    // Make sure we're working with a Date object
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) return '';
    
    // Format to YYYY-MM-DDThh:mm
    // padStart ensures that single digit numbers are padded with a leading zero
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear date error when the follow-up date field is modified
    if (name === 'nextFollowUp') {
      setDateError('');
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate follow-up date
  const validateFollowUpDate = () => {
    // If no follow-up date provided, it's valid (not required)
    if (!formData.nextFollowUp) return true;
    
    const followUpDate = new Date(formData.nextFollowUp);
    const now = new Date();
    
    // Check if the follow-up date is in the past
    if (followUpDate <= now) {
      setDateError('Next follow-up date must be in the future');
      return false;
    }
    
    return true;
  };

  // Save lead to localStorage
  const saveLeadToLocalStorage = async (leadData) => {
    try {
      // Get existing leads
      const existingLeads = localStorage.getItem('crmLeads');
      let leadsArray = existingLeads ? JSON.parse(existingLeads) : [];
      
      if (isEditMode) {
        // Update existing lead
        const index = leadsArray.findIndex(lead => lead.id === id);
        if (index !== -1) {
          leadsArray[index] = { ...leadData, id: id };
        } else {
          leadsArray.push({ ...leadData, id: id || Date.now().toString() });
        }
      } else {
        // Create new lead with generated ID
        leadsArray.push({ ...leadData, id: Date.now().toString() });
      }
      
      // Save back to localStorage
      localStorage.setItem('crmLeads', JSON.stringify(leadsArray));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save to localStorage: ' + error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // First validate the follow-up date
    if (!validateFollowUpDate()) {
      return;
    }
    
    setIsLoading(true);
    setSaveError('');
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.company) {
        throw new Error('Please fill in all required fields (First Name, Last Name, and Company)');
      }
      
      // Clone form data to send
      const dataToSend = { ...formData };
      
      // Convert value to number if it exists
      if (dataToSend.value) {
        dataToSend.value = Number(dataToSend.value);
      }
      
      let success = false;
      
      // Add timestamps
      dataToSend.updatedAt = new Date().toISOString();
      if (!isEditMode) {
        dataToSend.createdAt = new Date().toISOString();
      }
      
      try {
        // Try API first
        if (isEditMode) {
          await updateLead(id, dataToSend);
        } else {
          await createLead(dataToSend);
        }
        success = true;
      } catch (apiError) {
        console.warn('API save failed, falling back to localStorage:', apiError);
        
        // If API fails, use localStorage
        if (await saveLeadToLocalStorage(dataToSend)) {
          success = true;
          setUsingLocalStorage(true);
        } else {
          throw new Error('Failed to save to localStorage');
        }
      }
      
      if (success) {
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/leads');
        }, 1500);
      }
    } catch (error) {
      setSaveError(error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  // Handle lead deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setIsLoading(true);
      try {
        let success = false;
        
        try {
          // Try API first
          await deleteLead(id);
          success = true;
        } catch (apiError) {
          console.warn('API delete failed, falling back to localStorage:', apiError);
          
          // If API fails, use localStorage
          const existingLeads = localStorage.getItem('crmLeads');
          if (existingLeads) {
            const leadsArray = JSON.parse(existingLeads);
            const filteredLeads = leadsArray.filter(lead => lead.id !== id);
            localStorage.setItem('crmLeads', JSON.stringify(filteredLeads));
            success = true;
          }
        }
        
        if (success) {
          navigate('/leads');
        } else {
          throw new Error('Failed to delete lead');
        }
      } catch (error) {
        setSaveError('Failed to delete lead: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <BackButton />
          <h1 className="mb-0 ms-3">{isEditMode ? 'Edit Lead' : 'Add New Lead'}</h1>
        </div>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/leads')}
        >
          <FaTimes className="me-1" /> Cancel
        </Button>
      </div>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          {isLoading && !formData.id ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading lead data...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {saveSuccess && (
                <Alert variant="success" className="mb-4">
                  Lead {isEditMode ? 'updated' : 'created'} successfully!
                  {usingLocalStorage && (
                    <div className="mt-2 small">
                      <strong>Note:</strong> Data was saved to local storage because the API was not available.
                      Your changes will persist in this browser but won't sync with the server until the API is working.
                    </div>
                  )}
                </Alert>
              )}
              
              {saveError && (
                <Alert variant="danger" className="mb-4">
                  {saveError}
                </Alert>
              )}

              {usingLocalStorage && !saveSuccess && (
                <Alert variant="info" className="mb-4">
                  <strong>Note:</strong> You are currently working with locally stored data because the API is not available.
                  Changes will be saved to your browser's local storage.
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
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                      {isEditMode && formData.phone && (
                        <div className="ms-2">
                          <PhoneContact phoneNumber={formData.phone} buttonVariant="outline-secondary" />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <h5 className="mb-3">Lead Details</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      {leadStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Source</Form.Label>
                    <Form.Select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                    >
                      {leadSources.map(source => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Value ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="value"
                      value={formData.value || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Next Follow-up</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="nextFollowUp"
                      value={formatDatetimeLocal(formData.nextFollowUp)}
                      onChange={handleInputChange}
                      isInvalid={!!dateError}
                    />
                    {dateError && (
                      <Form.Control.Feedback type="invalid">
                        <FaExclamationTriangle className="me-1" />
                        {dateError}
                      </Form.Control.Feedback>
                    )}
                    <Form.Text className="text-muted">
                      The follow-up date and time must be in the future.
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between mt-4">
                {isEditMode && (
                  <Button 
                    variant="outline-danger" 
                    onClick={handleDelete}
                  >
                    <FaTrash className="me-1" /> Delete Lead
                  </Button>
                )}
                
                <div className="ms-auto">
                  <Button 
                    variant="outline-secondary" 
                    className="me-2"
                    onClick={() => navigate('/leads')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isLoading || !!dateError}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-1" /> {isEditMode ? 'Update Lead' : 'Create Lead'}
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

export default LeadForm;