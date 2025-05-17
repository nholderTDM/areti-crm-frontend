import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaReceipt, FaCalendarAlt, FaBuilding, FaUser, FaTags } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    status: 'pending',
    paymentMethod: '',
    vendor: '',
    receipt: false,
    submittedBy: '',
    notes: ''
  });
  
  // Expense categories
  const expenseCategories = [
    { value: 'fuel', label: 'Fuel' },
    { value: 'maintenance', label: 'Vehicle Maintenance' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'rent', label: 'Rent' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'office', label: 'Office Expenses' },
    { value: 'other', label: 'Other' }
  ];
  
  // Expense statuses
  const expenseStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'paid', label: 'Paid' }
  ];
  
  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'creditCard', label: 'Company Card' },
    { value: 'bankTransfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'other', label: 'Other' }
  ];

  // Load expense data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockExpense = {
          id: parseInt(id),
          description: 'Fuel for delivery trucks',
          amount: 450.75,
          category: 'fuel',
          date: new Date().toISOString().split('T')[0],
          status: 'paid',
          paymentMethod: 'creditCard',
          vendor: 'Shell Gas Station',
          receipt: true,
          submittedBy: 'Michael Rodriguez',
          notes: 'Regular refueling for fleet vehicles'
        };
        
        setFormData(mockExpense);
        setIsLoading(false);
      }, 1000);
    } else {
      // Set default values for new expense
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: today,
        submittedBy: 'Current User', // In a real app, would be the logged-in user
      }));
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkbox fields, use the 'checked' property
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
  };

  // Handle receipt file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Update receipt field
      setFormData({
        ...formData,
        receipt: true
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError('');
    
    // Validate form
    if (!formData.description || !formData.amount || !formData.category || !formData.date || !formData.vendor) {
      setSaveError('Please fill out all required fields');
      setIsLoading(false);
      return;
    }
    
    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Save the expense data and file
        console.log('Saving expense:', formData);
        console.log('Receipt file:', receiptFile);
        
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/financial/expenses');
        }, 1500);
      } catch (error) {
        setSaveError(error.message || 'An error occurred while saving the expense');
        setIsLoading(false);
      }
    }, 1000);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return '';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={isEditMode ? 'Edit Expense' : 'Record New Expense'}
        subtitle={isEditMode ? formData.description : "Create a new expense record"}
        backButton={true}
      />
      
      <Form onSubmit={handleSubmit}>
                {saveSuccess && (
          <Alert variant="success" className="mb-4">
            Expense {isEditMode ? 'updated' : 'recorded'} successfully!
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
                <h5 className="mb-0">Expense Details</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter expense description"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
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
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaTags className="me-1" />
                        Category <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {expenseCategories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
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
                        required
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
                        {expenseStatuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaBuilding className="me-1" />
                        Vendor <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="vendor"
                        value={formData.vendor}
                        onChange={handleInputChange}
                        placeholder="Vendor name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Payment Method --</option>
                        {paymentMethods.map(method => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaUser className="me-1" />
                        Submitted By
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="submittedBy"
                        value={formData.submittedBy}
                        onChange={handleInputChange}
                        placeholder="Your name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Receipt Upload</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                      />
                      <Form.Text className="text-muted">
                        Upload a receipt or invoice (PDF, JPG, PNG)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                {previewURL && (
                  <div className="mb-3">
                    <div className="border rounded p-2">
                      <div className="text-center">
                        {previewURL.includes('data:image') ? (
                          <img 
                            src={previewURL} 
                            alt="Receipt preview" 
                            style={{ maxHeight: '200px', maxWidth: '100%' }} 
                            className="img-fluid" 
                          />
                        ) : (
                          <div className="p-4 text-center">
                            <FaReceipt size={48} className="text-danger mb-2" />
                            <div>PDF Receipt</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about this expense"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Expense Summary</h5>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="expense-summary">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Description:</span>
                    <span className="fw-bold text-truncate">{formData.description || 'Not set'}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Amount:</span>
                    <span className="fw-bold">
                      {formData.amount ? formatCurrency(formData.amount) : '$0.00'}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Category:</span>
                    <span>
                      {formData.category ? 
                        expenseCategories.find(c => c.value === formData.category)?.label || formData.category : 
                        'Not set'
                      }
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Date:</span>
                    <span>
                      {formData.date ? new Date(formData.date).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Vendor:</span>
                    <span>{formData.vendor || 'Not set'}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Status:</span>
                    <span>
                      {formData.status ? 
                        expenseStatuses.find(s => s.value === formData.status)?.label || formData.status : 
                        'Not set'
                      }
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Payment Method:</span>
                    <span>
                      {formData.paymentMethod ? 
                        paymentMethods.find(m => m.value === formData.paymentMethod)?.label || formData.paymentMethod : 
                        'Not set'
                      }
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Receipt:</span>
                    <span>
                      {formData.receipt ? 
                        <span className="text-success">Attached</span> : 
                        <span className="text-muted">Not attached</span>
                      }
                    </span>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="d-grid gap-2">
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
                        <FaSave className="me-1" /> {isEditMode ? 'Update Expense' : 'Record Expense'}
                      </>
                    )}
                  </Button>
                </div>
              </Card.Footer>
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
                  Attach receipts or invoices to ensure proper documentation of expenses.
                </p>
                <p className="small mb-0">
                  The expense summary on the right shows a preview of the expense details as you fill them in.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-between mt-4">
          {isEditMode && (
            <Button 
              variant="outline-danger" 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this expense?')) {
                  // In a real app, this would be an API call
                  navigate('/financial/expenses');
                }
              }}
            >
              <FaTrash className="me-1" /> Delete Expense
            </Button>
          )}
          
          <div className="ms-auto">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={() => navigate('/financial/expenses')}
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
                  <FaSave className="me-1" /> {isEditMode ? 'Update Expense' : 'Record Expense'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ExpenseForm;