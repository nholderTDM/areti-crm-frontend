import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaMoneyBillAlt, FaBuilding, FaUser, FaCalendarAlt, FaTags, FaFilePdf } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

const TransactionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const [formErrors, setFormErrors] = useState({});
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    transactionId: '',
    type: 'revenue',
    amount: '',
    description: '',
    category: '',
    date: '',
    status: 'completed',
    account: '',
    fromAccount: '',
    toAccount: '',
    customer: {
      id: '',
      name: ''
    },
    vendor: '',
    paymentMethod: '',
    notes: '',
    relatedInvoice: ''
  });
  
  // Options for form dropdowns
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState({
    revenue: ['Delivery Fees', 'Setup Fees', 'Subscriptions', 'Other Income'],
    expense: ['Vehicle Maintenance', 'Fuel', 'Insurance', 'Rent', 'Payroll', 'Office Expenses', 'Other Expenses'],
    transfer: ['Internal Transfer']
  });
  const [paymentMethods, setPaymentMethods] = useState([
    'Cash', 'Credit Card', 'Bank Transfer', 'Check', 'Direct Deposit', 'PayPal'
  ]);
  
  // Transaction types
  const transactionTypes = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'expense', label: 'Expense' },
    { value: 'transfer', label: 'Transfer' }
  ];
  
  // Transaction statuses
  const transactionStatuses = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Load transaction data if in edit mode
  useEffect(() => {
    // Load customers and accounts
    setCustomers([
      { id: 1, name: 'ABC Logistics' },
      { id: 2, name: 'XYZ Retail' },
      { id: 3, name: 'Tech Solutions Inc.' },
      { id: 4, name: 'Global Shipping Co.' },
      { id: 5, name: 'Metro Electronics' }
    ]);
    
    setAccounts([
      'Business Checking',
      'Business Savings',
      'Business Credit Card',
      'Payroll Account',
      'Tax Reserve'
    ]);
    
    if (isEditMode) {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data for the transaction
        const mockTransaction = {
          id: parseInt(id),
          transactionId: `TRX-1000${id}`,
          type: 'revenue',
          amount: 2500.00,
          description: 'Monthly delivery service subscription',
          category: 'Subscriptions',
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
          account: 'Business Checking',
          customer: {
            id: 1,
            name: 'ABC Logistics'
          },
          vendor: '',
          paymentMethod: 'Bank Transfer',
          notes: 'Subscription renewal for standard delivery service package.',
          relatedInvoice: 'INV-2023-055'
        };
        
        setFormData(mockTransaction);
        setIsLoading(false);
      }, 1000);
    } else {
      // Set default values for new transaction
      const today = new Date();
      const newTransactionId = `TRX-${10000 + Math.floor(Math.random() * 90000)}`;
      
      setFormData(prev => ({
        ...prev,
        transactionId: newTransactionId,
        date: today.toISOString().split('T')[0]
      }));
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (customer)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else if (name === 'type') {
      // Reset category when type changes
      setFormData({
        ...formData,
        [name]: value,
        category: ''
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
          name: selectedCustomer.name
        }
      });
    } else {
      setFormData({
        ...formData,
        customer: {
          id: '',
          name: ''
        }
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
    }
  };

  // Enhanced validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    
    // Type-specific validation
    if (formData.type === 'revenue' && !formData.customer.id) {
      errors.customer = 'Please select a customer';
    }
    
    if (formData.type === 'expense' && !formData.vendor) {
      errors.vendor = 'Please enter a vendor name';
    }
    
    if (formData.type === 'transfer') {
      if (!formData.fromAccount) {
        errors.fromAccount = 'Please select a source account';
      }
      if (!formData.toAccount) {
        errors.toAccount = 'Please select a destination account';
      }
      if (formData.fromAccount === formData.toAccount) {
        errors.toAccount = 'Source and destination accounts must be different';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsLoading(true);
    setSaveError('');
    
    // For now, simulate API call
    setTimeout(() => {
      try {
        // Form is valid, proceed with saving
        console.log('Saving transaction:', formData);
        console.log('Receipt file:', receiptFile);
        
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/financial/transactions');
        }, 1500);
      } catch (error) {
        setSaveError(error.message || 'An error occurred while saving the transaction');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={isEditMode ? 'Edit Transaction' : 'Add New Transaction'}
        backButton={true}
      />
      
      <Form onSubmit={handleSubmit}>
        {saveSuccess && (
          <Alert variant="success" className="mb-4">
            Transaction {isEditMode ? 'updated' : 'created'} successfully!
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
                <h5 className="mb-0">Transaction Details</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Transaction ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Transaction Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        {transactionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaCalendarAlt className="me-1" />
                        Transaction Date <span className="text-danger">*</span>
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
                </Row>
                
                <Row className="mb-3">
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter transaction description"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
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
                </Row>
                
                <Row className="mb-3">
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
                        {categories[formData.type]?.map(category => (
                          <option key={category} value={category}>
                            {category}
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
                        {transactionStatuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                {formData.type === 'revenue' && (
                  <div className="revenue-fields">
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaBuilding className="me-1" />
                            Customer <span className="text-danger">*</span>
                          </Form.Label>
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
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Account <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="account"
                            value={formData.account}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">-- Select Account --</option>
                            {accounts.map((account, index) => (
                              <option key={index} value={account}>
                                {account}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Related Invoice</Form.Label>
                          <Form.Control
                            type="text"
                            name="relatedInvoice"
                            value={formData.relatedInvoice}
                            onChange={handleInputChange}
                            placeholder="Invoice number"
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
                            {paymentMethods.map((method, index) => (
                              <option key={index} value={method}>
                                {method}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
                
                {formData.type === 'expense' && (
                  <div className="expense-fields">
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
                                    <FaFilePdf size={48} className="text-danger mb-2" />
                                    <div>PDF Document</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Account <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="account"
                            value={formData.account}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">-- Select Account --</option>
                            {accounts.map((account, index) => (
                              <option key={index} value={account}>
                                {account}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Method</Form.Label>
                          <Form.Select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                          >
                            <option value="">-- Select Payment Method --</option>
                            {paymentMethods.map((method, index) => (
                              <option key={index} value={method}>
                                {method}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
                
                {formData.type === 'transfer' && (
                  <div className="transfer-fields">
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>From Account <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="fromAccount"
                            value={formData.fromAccount}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">-- Select Account --</option>
                            {accounts.map((account, index) => (
                              <option key={index} value={account}>
                                {account}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>To Account <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="toAccount"
                            value={formData.toAccount}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">-- Select Account --</option>
                            {accounts.map((account, index) => (
                              <option key={index} value={account}>
                                {account}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
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
                    placeholder="Additional notes about this transaction"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Transaction Summary</h5>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="transaction-summary">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Transaction Type:</span>
                    <span className="fw-bold">{formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Amount:</span>
                    <span className="fw-bold">
                      {formData.amount ? formatCurrency(formData.amount) : '$0.00'}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Date:</span>
                    <span>
                      {formData.date ? new Date(formData.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Not set'}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Category:</span>
                    <span>{formData.category || 'Not set'}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Status:</span>
                    <span>{formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}</span>
                  </div>
                  
                  {formData.type === 'revenue' && (
                    <>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Customer:</span>
                        <span>{formData.customer.name || 'Not selected'}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Account:</span>
                        <span>{formData.account || 'Not selected'}</span>
                      </div>
                      
                      {formData.relatedInvoice && (
                        <div className="d-flex justify-content-between mb-3">
                          <span className="text-muted">Invoice:</span>
                          <span>{formData.relatedInvoice}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {formData.type === 'expense' && (
                    <>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Vendor:</span>
                        <span>{formData.vendor || 'Not set'}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Account:</span>
                        <span>{formData.account || 'Not selected'}</span>
                      </div>
                    </>
                  )}
                  
                  {formData.type === 'transfer' && (
                    <>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">From Account:</span>
                        <span>{formData.fromAccount || 'Not selected'}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">To Account:</span>
                        <span>{formData.toAccount || 'Not selected'}</span>
                      </div>
                    </>
                  )}
                  
                  {formData.paymentMethod && (
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Payment Method:</span>
                      <span>{formData.paymentMethod}</span>
                    </div>
                  )}
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
                        <FaSave className="me-1" /> {isEditMode ? 'Update Transaction' : 'Save Transaction'}
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
                  Select the appropriate transaction type to see relevant fields.
                </p>
                <p className="small mb-0">
                  The summary card on the right shows a preview of the transaction details as you fill them in.
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
                if (window.confirm('Are you sure you want to delete this transaction?')) {
                  // In a real app, this would be an API call
                  navigate('/financial/transactions');
                }
              }}
            >
              <FaTrash className="me-1" /> Delete Transaction
            </Button>
          )}
          
          <div className="ms-auto">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={() => navigate('/financial/transactions')}
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
                  <FaSave className="me-1" /> {isEditMode ? 'Update Transaction' : 'Create Transaction'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default TransactionForm;