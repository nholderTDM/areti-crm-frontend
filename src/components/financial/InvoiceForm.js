import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, Alert, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaPlus, FaMinus, FaFileInvoice, FaCalendarAlt, FaBuilding, FaPrint, FaEnvelope } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerId: '',
    issueDate: '',
    dueDate: '',
    status: 'draft',
    items: [
      { id: 1, description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ],
    notes: '',
    terms: 'Payment is due within 30 days of issue.',
  });
  
  const [customers, setCustomers] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'viewed', label: 'Viewed' },
    { value: 'paid', label: 'Paid' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Load customers and invoice data if in edit mode
  useEffect(() => {
    // Load customers
    const mockCustomers = [
      { id: 1, name: 'ABC Logistics', email: 'accounts@abclogistics.com' },
      { id: 2, name: 'XYZ Retail', email: 'billing@xyzretail.com' },
      { id: 3, name: 'Tech Solutions Inc.', email: 'ap@techsolutions.com' },
      { id: 4, name: 'Global Shipping Co.', email: 'billing@globalshipping.com' },
      { id: 5, name: 'Metro Electronics', email: 'finance@metroelectronics.com' }
    ];
    setCustomers(mockCustomers);
    
    if (isEditMode) {
      setIsLoading(true);
      
      // Mock API call to get invoice data
      setTimeout(() => {
        const mockInvoice = {
          id: parseInt(id),
          invoiceNumber: `INV-2025-00${id}`,
          customerId: id % 5 + 1,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
          status: ['draft', 'sent', 'viewed', 'paid'][id % 4],
          items: [
            { id: 1, description: 'Regular Delivery Service', quantity: 15, unitPrice: 150, amount: 2250 },
            { id: 2, description: 'Additional Mileage Fees', quantity: 50, unitPrice: 11, amount: 550 }
          ],
          notes: 'Thank you for your business!',
          terms: 'Payment is due within 30 days of issue.'
        };
        
        setFormData(mockInvoice);
        setIsLoading(false);
      }, 1000);
    } else {
      // Generate a new invoice number
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const nextNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      // Set default values for new invoice
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-${year}${month}-${nextNumber}`,
        issueDate: today.toISOString().split('T')[0],
        dueDate: new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0]
      }));
    }
  }, [id, isEditMode]);

  // Calculate totals when items change
  useEffect(() => {
    const newSubtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setSubtotal(newSubtotal);
    
    const newTaxAmount = newSubtotal * (taxRate / 100);
    setTaxAmount(newTaxAmount);
    
    setTotal(newSubtotal + newTaxAmount);
  }, [formData.items, taxRate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
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
      unitPrice: 0,
      amount: 0
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

  // Handle tax rate change
  const handleTaxRateChange = (e) => {
    setTaxRate(parseFloat(e.target.value) || 0);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError('');
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Validate required fields
        if (!formData.customerId || !formData.issueDate || !formData.dueDate) {
          throw new Error('Please fill in all required fields');
        }
        
        // Validate items
        if (formData.items.some(item => !item.description || item.quantity <= 0)) {
          throw new Error('Please fill in all item details correctly');
        }
        
        // Save the invoice
        console.log('Saving invoice:', formData);
        setSaveSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/financial/invoices');
        }, 1500);
      } catch (error) {
        setSaveError(error.message);
        setIsLoading(false);
      }
    }, 1000);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title={isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
        subtitle={isEditMode ? formData.invoiceNumber : "Create a new invoice"}
        backButton={true}
      />
      
      <div className="d-flex justify-content-end mb-4">
        {isEditMode && (
          <>
            <Button 
              variant="outline-primary" 
              className="me-2"
              onClick={() => window.open(`/financial/invoices/${id}/print`, '_blank')}
            >
              <FaPrint className="me-1" /> Print
            </Button>
            <Button 
              variant="outline-success" 
              className="me-2"
            >
              <FaEnvelope className="me-1" /> Send Email
            </Button>
          </>
        )}
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/financial/invoices')}
        >
          <FaTimes className="me-1" /> Cancel
        </Button>
      </div>
      
      <Form onSubmit={handleSubmit}>
        {saveSuccess && (
          <Alert variant="success" className="mb-4">
            Invoice {isEditMode ? 'updated' : 'created'} successfully!
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
                <h5 className="mb-0">Invoice Details</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaFileInvoice className="me-1" />
                        Invoice Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handleInputChange}
                        readOnly
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
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
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
                        Customer <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleInputChange}
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
                      <Form.Label>
                        <FaCalendarAlt className="me-1" />
                        Issue Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleInputChange}
                        required
                      />
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
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <hr />
                
                <h5 className="mb-3">Invoice Items</h5>
                
                <Table responsive>
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Description</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Unit Price</th>
                      <th className="text-center">Amount</th>
                      <th style={{ width: '60px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Control
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Item description"
                            required
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            min="1"
                            className="text-center"
                            required
                          />
                        </td>
                        <td>
                          <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              className="text-end"
                              required
                            />
                          </InputGroup>
                        </td>
                        <td className="text-end">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            disabled={formData.items.length <= 1}
                          >
                            <FaMinus />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={handleAddItem}
                        >
                          <FaPlus className="me-1" /> Add Item
                        </Button>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
                
                <Row className="justify-content-end">
                  <Col md={6}>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Tax Rate:</span>
                      <div style={{ width: '100px' }}>
                        <InputGroup size="sm">
                          <Form.Control
                            type="number"
                            value={taxRate}
                            onChange={handleTaxRateChange}
                            min="0"
                            max="100"
                            step="0.1"
                            className="text-end"
                          />
                          <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax Amount:</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between mb-2 fw-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Additional Information</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add notes to the customer (will appear on invoice)"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Terms and Conditions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="terms"
                    value={formData.terms}
                    onChange={handleInputChange}
                    placeholder="Payment terms and conditions"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Preview</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="invoice-preview p-3">
                  <div className="text-center mb-4">
                    <h4>INVOICE</h4>
                    <div className="text-muted">{formData.invoiceNumber}</div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-6">
                      <div className="fw-bold mb-2">From:</div>
                      <div>Areti Alliance</div>
                      <div>1201 West Peachtree St. NW</div>
                      <div>Ste. 2300</div>
                      <div>Atlanta, GA 30309</div>
                      <div>info@aretialliance.com</div>
                    </div>
                    <div className="col-6 text-end">
                      <div className="fw-bold mb-2">To:</div>
                      <div>
                        {customers.find(c => c.id === parseInt(formData.customerId))?.name || 'Customer Name'}
                      </div>
                      <div>
                        {customers.find(c => c.id === parseInt(formData.customerId))?.email || 'customer@email.com'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-6">
                      <div className="fw-bold mb-2">Invoice Date:</div>
                      <div>{formData.issueDate ? new Date(formData.issueDate).toLocaleDateString() : 'Issue Date'}</div>
                    </div>
                    <div className="col-6 text-end">
                      <div className="fw-bold mb-2">Due Date:</div>
                      <div>{formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Due Date'}</div>
                    </div>
                  </div>
                  
                  <hr />
                  
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Description</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.description || 'Item description'}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                          <td className="text-end">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end">Subtotal:</td>
                        <td className="text-end">{formatCurrency(subtotal)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-end">Tax ({taxRate}%):</td>
                        <td className="text-end">{formatCurrency(taxAmount)}</td>
                      </tr>
                      <tr className="fw-bold">
                        <td colSpan="3" className="text-end">Total:</td>
                        <td className="text-end">{formatCurrency(total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <hr />
                  
                  <div className="mb-3">
                    <div className="fw-bold mb-2">Notes:</div>
                    <div className="small">{formData.notes || 'No notes'}</div>
                  </div>
                  
                  <div>
                    <div className="fw-bold mb-2">Terms and Conditions:</div>
                    <div className="small">{formData.terms || 'No terms'}</div>
                  </div>
                </div>
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
                  The invoice preview shows how your invoice will look when sent or printed.
                </p>
                <p className="small mb-0">
                  You can add as many items as needed and customize the tax rate.
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
                if (window.confirm('Are you sure you want to delete this invoice?')) {
                  // In a real app, this would be an API call
                  navigate('/financial/invoices');
                }
              }}
            >
              <FaTrash className="me-1" /> Delete Invoice
            </Button>
          )}
          
          <div className="ms-auto">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={() => navigate('/financial/invoices')}
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
                  <FaSave className="me-1" /> {isEditMode ? 'Update Invoice' : 'Create Invoice'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default InvoiceForm;