// src/components/tasks/TaskForm.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
         FaUserAlt, FaBuilding, FaUser, FaBell, FaPaperclip, FaTasks, FaPlus } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'call',
    status: 'not_started',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    dueTime: '',
    company: '',
    contact: '',
    location: '',
    duration: '',
    notes: '',
    setReminder: false,
    reminderTime: '',
    customFields: []
  });
  
  // Options for dropdowns
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [availableCustomFields, setAvailableCustomFields] = useState([]);
  const [selectedCustomFields, setSelectedCustomFields] = useState([]);
  const [showAddCustomField, setShowAddCustomField] = useState(false);
  const [newCustomFieldName, setNewCustomFieldName] = useState('');
  const [newCustomFieldValue, setNewCustomFieldValue] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Task types
  const taskTypes = [
    { value: 'call', label: 'Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'payment', label: 'Payment' },
    { value: 'other', label: 'Other' }
  ];
  
  // Task statuses
  const taskStatuses = [
    { value: 'not_started', label: 'Not Started', color: 'secondary' },
    { value: 'in_progress', label: 'In Progress', color: 'primary' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' }
  ];
  
  // Task priorities
  const taskPriorities = [
    { value: 'low', label: 'Low', color: 'info' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'danger' },
    { value: 'urgent', label: 'Urgent', color: 'dark' }
  ];
  
  // Duration options
  const durationOptions = [
    { value: '15min', label: '15 minutes' },
    { value: '30min', label: '30 minutes' },
    { value: '1hour', label: '1 hour' },
    { value: '2hours', label: '2 hours' },
    { value: 'half_day', label: 'Half day' },
    { value: 'full_day', label: 'Full day' }
  ];
  
  // Custom fields
  const customFieldsList = [
    { id: 1, name: 'Department', options: ['Sales', 'Support', 'Operations', 'Finance', 'Marketing'] },
    { id: 2, name: 'Purpose', options: ['New Business', 'Retention', 'Upsell', 'Support', 'Information'] },
    { id: 3, name: 'Campaign', options: ['Spring Promotion', 'Summer Sale', 'New Product Launch', 'Customer Appreciation'] },
    { id: 4, name: 'Lead Source', options: ['Website', 'Referral', 'Cold Call', 'Trade Show', 'Partner'] }
  ];
  
  // Load data
  useEffect(() => {
    // Fetch dropdown options
    loadCompanies();
    loadContacts();
    loadAssignees();
    setAvailableCustomFields(customFieldsList);
    
    // If in edit mode, load task data
    if (isEditMode) {
      loadTaskData();
    } else {
      // Set default values for new task
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0);
      
      setFormData({
        ...formData,
        dueDate: tomorrow.toISOString().split('T')[0],
        dueTime: '12:00',
        assignee: '1' // Default to first user
      });
    }
  }, [id, isEditMode]);
  
  // Load companies
  const loadCompanies = () => {
    // Simulate API call
    setTimeout(() => {
      const mockCompanies = [
        { id: 1, name: 'ABC Logistics' },
        { id: 2, name: 'XYZ Retail' },
        { id: 3, name: 'Tech Solutions Inc.' },
        { id: 4, name: 'Global Shipping Co.' },
        { id: 5, name: 'Metro Electronics' }
      ];
      
      setCompanies(mockCompanies);
    }, 300);
  };
  
  // Load contacts
  const loadContacts = () => {
    // Simulate API call
    setTimeout(() => {
      const mockContacts = [
        { id: 1, name: 'John Doe', company: 1 },
        { id: 2, name: 'Jane Smith', company: 2 },
        { id: 3, name: 'Robert Johnson', company: 3 },
        { id: 4, name: 'Emma Williams', company: 4 },
        { id: 5, name: 'Michael Brown', company: 5 },
        { id: 6, name: 'Sarah Davis', company: 1 },
        { id: 7, name: 'David Wilson', company: 2 },
        { id: 8, name: 'Lisa Miller', company: 3 }
      ];
      
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
    }, 300);
  };
  
  // Load assignees
  const loadAssignees = () => {
    // Simulate API call
    setTimeout(() => {
      const mockAssignees = [
        { id: 1, name: 'John Smith', role: 'Sales Representative' },
        { id: 2, name: 'Sarah Johnson', role: 'Sales Manager' },
        { id: 3, name: 'Michael Brown', role: 'Account Executive' },
        { id: 4, name: 'Emily Davis', role: 'Customer Support' },
        { id: 5, name: 'David Wilson', role: 'Delivery Driver' }
      ];
      
      setAssignees(mockAssignees);
    }, 300);
  };
  
  // Load task data for editing
  const loadTaskData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock task data
      const taskTypes = ['call', 'email', 'meeting', 'follow_up', 'proposal', 'delivery', 'payment'];
      const taskType = taskTypes[id % taskTypes.length];
      const companyId = (id % 5) + 1;
      const contactId = ((id % 8) + 1).toString();
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      
      const customFields = [
        { name: 'Department', value: 'Sales' },
        { name: 'Purpose', value: 'Upsell' }
      ];
      
      const mockTask = {
        id: parseInt(id),
        title: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} with ${companies.find(c => c.id === companyId)?.name || 'Client'}`,
        description: `Scheduled ${taskType} to discuss our services and possible extensions.`,
        type: taskType,
        status: ['not_started', 'in_progress', 'pending', 'completed'][id % 4],
        priority: ['low', 'medium', 'high', 'urgent'][id % 4],
        assignee: ((id % 5) + 1).toString(),
        dueDate: dueDate.toISOString().split('T')[0],
        dueTime: '14:00',
        company: companyId.toString(),
        contact: contactId,
        location: taskType === 'meeting' ? 'Client Office - 123 Business Ave, Suite 400' : '',
        duration: taskType === 'call' || taskType === 'meeting' ? '1hour' : '',
        notes: 'Prepare discussion points about our new premium service tier.',
        setReminder: true,
        reminderTime: '1hour',
        customFields: customFields
      };
      
      setFormData(mockTask);
      
      // Set selected custom fields
      setSelectedCustomFields(customFields.map(field => field.name));
      
      // Filter contacts based on selected company
      filterContactsByCompany(companyId.toString());
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Filter contacts based on selected company
  const filterContactsByCompany = (companyId) => {
    if (!companyId) {
      setFilteredContacts(contacts);
      return;
    }
    
    const filtered = contacts.filter(contact => contact.company === parseInt(companyId));
    setFilteredContacts(filtered);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // If company changes, filter contacts
    if (name === 'company') {
      filterContactsByCompany(value);
      
      // Clear contact if switching company
      if (formData.contact) {
        const contactExists = contacts.find(c => 
          c.id === parseInt(formData.contact) && 
          c.company === parseInt(value)
        );
        
        if (!contactExists) {
          setFormData({
            ...formData,
            [name]: value,
            contact: ''
          });
          return;
        }
      }
    }
  };
  
  // Handle custom field changes
  const handleCustomFieldChange = (name, value) => {
    const updatedFields = formData.customFields.map(field => {
      if (field.name === name) {
        return { ...field, value };
      }
      return field;
    });
    
    setFormData({
      ...formData,
      customFields: updatedFields
    });
  };
  
  // Add a custom field
  const addCustomField = () => {
    if (!newCustomFieldName || !newCustomFieldValue) return;
    
    const newField = {
      name: newCustomFieldName,
      value: newCustomFieldValue
    };
    
    setFormData({
      ...formData,
      customFields: [...formData.customFields, newField]
    });
    
    setSelectedCustomFields([...selectedCustomFields, newCustomFieldName]);
    setNewCustomFieldName('');
    setNewCustomFieldValue('');
    setShowAddCustomField(false);
  };
  
  // Remove a custom field
  const removeCustomField = (name) => {
    const updatedFields = formData.customFields.filter(field => field.name !== name);
    setFormData({
      ...formData,
      customFields: updatedFields
    });
    
    setSelectedCustomFields(selectedCustomFields.filter(field => field !== name));
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Simulate file upload
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Add files to attachments
          const newAttachments = files.map((file, index) => ({
            id: attachments.length + index + 1,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type.split('/')[1],
            uploadDate: new Date()
          }));
          
          setAttachments([...attachments, ...newAttachments]);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    }
    
    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    
    if (!formData.assignee) {
      errors.assignee = 'Please select an assignee';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSaveError('');
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Save the task
        console.log('Saving task:', formData);
        console.log('Attachments:', attachments);
        
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/tasks');
        }, 1500);
      } catch (error) {
        setSaveError(error.message || 'An error occurred while saving the task');
        setIsLoading(false);
      }
    }, 1000);
  };
  
  // Handle deleting task
  const handleDeleteTask = () => {
    if (window.confirm(`Are you sure you want to delete this task?`)) {
      // In a real app, this would be an API call
      navigate('/tasks');
    }
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={isEditMode ? 'Edit Task' : 'Create New Task'}
        backButton={true}
      />
      
      <Form onSubmit={handleSubmit}>
        {saveSuccess && (
          <Alert variant="success" className="mb-4">
            Task {isEditMode ? 'updated' : 'created'} successfully!
          </Alert>
        )}
        
        {saveError && (
          <Alert variant="danger" className="mb-4">
            {saveError}
          </Alert>
        )}
        
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Task Information</h5>
              </Card.Header>
              <Card.Body>
                {isLoading && isEditMode ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading task data...</p>
                  </div>
                ) : (
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Task Title <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          isInvalid={!!formErrors.title}
                          placeholder="e.g., Call with ABC Logistics about contract renewal"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.title}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Task Type</Form.Label>
                        <Form.Select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          {taskTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
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
                          {taskStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                        >
                          {taskPriorities.map(priority => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaUserAlt className="me-1" />
                          Assignee <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="assignee"
                          value={formData.assignee}
                          onChange={handleInputChange}
                          isInvalid={!!formErrors.assignee}
                          required
                        >
                          <option value="">-- Select Assignee --</option>
                          {assignees.map(assignee => (
                            <option key={assignee.id} value={assignee.id}>
                              {assignee.name} ({assignee.role})
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.assignee}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaCalendarAlt className="me-1" />
                          Due Date <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          isInvalid={!!formErrors.dueDate}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.dueDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaClock className="me-1" />
                          Due Time
                        </Form.Label>
                        <Form.Control
                          type="time"
                          name="dueTime"
                          value={formData.dueTime}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaBuilding className="me-1" />
                          Company
                        </Form.Label>
                        <Form.Select
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                        >
                          <option value="">-- Select Company --</option>
                          {companies.map(company => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaUser className="me-1" />
                          Contact
                        </Form.Label>
                        <Form.Select
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          disabled={!formData.company}
                        >
                          <option value="">-- Select Contact --</option>
                          {filteredContacts.map(contact => (
                            <option key={contact.id} value={contact.id}>
                              {contact.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    {(formData.type === 'meeting' || formData.type === 'call') && (
                      <>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaMapMarkerAlt className="me-1" />
                              Location
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              placeholder={formData.type === 'meeting' ? "e.g., Client's office" : "e.g., Phone, Zoom, etc."}
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FaClock className="me-1" />
                              Duration
                            </Form.Label>
                            <Form.Select
                              name="duration"
                              value={formData.duration}
                              onChange={handleInputChange}
                            >
                              <option value="">-- Select Duration --</option>
                              {durationOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </>
                    )}
                    
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter detailed description about this task"
                        />
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
                          placeholder="Additional notes or instructions"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="reminder-toggle"
                        label="Set Reminder"
                        name="setReminder"
                        checked={formData.setReminder}
                        onChange={handleInputChange}
                      />
                      
                      {formData.setReminder && (
                        <Form.Group className="mt-2">
                          <Form.Label>
                            <FaBell className="me-1" />
                            Remind
                          </Form.Label>
                          <Form.Select
                            name="reminderTime"
                            value={formData.reminderTime}
                            onChange={handleInputChange}
                          >
                            <option value="5min">5 minutes before</option>
                            <option value="15min">15 minutes before</option>
                            <option value="30min">30 minutes before</option>
                            <option value="1hour">1 hour before</option>
                            <option value="2hours">2 hours before</option>
                            <option value="1day">1 day before</option>
                          </Form.Select>
                        </Form.Group>
                      )}
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Attachments</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      <FaPaperclip className="me-1" /> Upload Files
                    </Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <Form.Text className="text-muted">
                      Upload documents, images, or any other relevant files.
                    </Form.Text>
                  </Form.Group>
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-3">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                  </div>
                )}
                
                {attachments.length > 0 && (
                  <div className="attachments-list mt-3">
                    <h6 className="mb-3">Attached Files</h6>
                    <div className="list-group">
                      {attachments.map(attachment => (
                        <div 
                          key={attachment.id} 
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center">
                            <FaPaperclip className="me-2 text-primary" />
                            <div>
                              <div>{attachment.name}</div>
                              <div className="small text-muted">{attachment.size}</div>
                            </div>
                          </div>
                          <Button 
                            variant="link" 
                            className="text-danger" 
                            onClick={() => removeAttachment(attachment.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Custom Fields</h5>
              </Card.Header>
              <Card.Body>
                {formData.customFields.length > 0 && (
                  <div className="mb-3">
                    {formData.customFields.map((field, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <Form.Label>{field.name}</Form.Label>
                          <Button 
                            variant="link" 
                            className="p-0 text-danger" 
                            onClick={() => removeCustomField(field.name)}
                          >
                            <FaTimes size={14} />
                          </Button>
                        </div>
                        <Form.Control
                          type="text"
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {showAddCustomField ? (
                  <div className="mb-3">
                    <Form.Group className="mb-2">
                      <Form.Label>Field Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newCustomFieldName}
                        onChange={(e) => setNewCustomFieldName(e.target.value)}
                        placeholder="e.g., Department"
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Field Value</Form.Label>
                      <Form.Control
                        type="text"
                        value={newCustomFieldValue}
                        onChange={(e) => setNewCustomFieldValue(e.target.value)}
                        placeholder="e.g., Sales"
                      />
                    </Form.Group>
                    <div className="d-flex">
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={addCustomField}
                        disabled={!newCustomFieldName || !newCustomFieldValue}
                      >
                        Add Field
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          setShowAddCustomField(false);
                          setNewCustomFieldName('');
                          setNewCustomFieldValue('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => setShowAddCustomField(true)}
                  >
                    <FaPlus className="me-1" /> Add Custom Field
                  </Button>
                )}
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="task-summary">
                  <div className="mb-3">
                    <div className="text-muted">Task Type:</div>
                    <div className="fw-bold">
                      {taskTypes.find(t => t.value === formData.type)?.label || 'Not set'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-muted">Priority:</div>
                    <div className="fw-bold">
                      {taskPriorities.find(p => p.value === formData.priority)?.label || 'Not set'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-muted">Due Date:</div>
                    <div className="fw-bold">
                      {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}
                      {formData.dueTime ? ` at ${formData.dueTime}` : ''}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-muted">Assignee:</div>
                    <div className="fw-bold">
                      {assignees.find(a => a.id.toString() === formData.assignee)?.name || 'Not assigned'}
                    </div>
                  </div>
                  
                  {formData.company && (
                    <div className="mb-3">
                      <div className="text-muted">Company:</div>
                      <div className="fw-bold">
                        {companies.find(c => c.id.toString() === formData.company)?.name || 'Not set'}
                      </div>
                    </div>
                  )}
                  
                  {formData.contact && (
                    <div className="mb-3">
                      <div className="text-muted">Contact:</div>
                      <div className="fw-bold">
                        {contacts.find(c => c.id.toString() === formData.contact)?.name || 'Not set'}
                      </div>
                    </div>
                  )}
                  
                  {formData.setReminder && (
                    <div className="mb-3">
                      <div className="text-muted">Reminder:</div>
                      <div className="fw-bold">
                        {formData.reminderTime === '5min' && '5 minutes before'}
                        {formData.reminderTime === '15min' && '15 minutes before'}
                        {formData.reminderTime === '30min' && '30 minutes before'}
                        {formData.reminderTime === '1hour' && '1 hour before'}
                        {formData.reminderTime === '2hours' && '2 hours before'}
                        {formData.reminderTime === '1day' && '1 day before'}
                      </div>
                    </div>
                  )}
                  
                  {attachments.length > 0 && (
                    <div className="mb-3">
                      <div className="text-muted">Attachments:</div>
                      <div className="fw-bold">{attachments.length} files</div>
                    </div>
                  )}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="d-grid">
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
                        <FaSave className="me-1" /> {isEditMode ? 'Update Task' : 'Create Task'}
                      </>
                    )}
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-between mt-4">
          {isEditMode && (
            <Button 
              variant="outline-danger" 
              onClick={handleDeleteTask}
            >
              <FaTrash className="me-1" /> Delete Task
            </Button>
          )}
          
          <div className="ms-auto">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={() => navigate('/tasks')}
            >
              <FaTimes className="me-1" /> Cancel
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
                  <FaSave className="me-1" /> {isEditMode ? 'Update Task' : 'Create Task'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default TaskForm;