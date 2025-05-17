// src/components/financial/AddBudgetModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import BackButton from '../common/BackButton';

const AddBudgetModal = ({ show, handleClose, handleSave, budgetCategories }) => {
  const [formData, setFormData] = useState({
    category: '',
    type: 'expense',
    budgetAmount: '',
    actualAmount: '',
    notes: ''
  });
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Reset form when modal is opened or closed
  useEffect(() => {
    if (show) {
      setFormData({
        category: '',
        type: 'expense',
        budgetAmount: '',
        actualAmount: '',
        notes: ''
      });
      setValidated(false);
      setFormSubmitted(false);
    }
  }, [show]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // If form was already submitted once, validate on change
    if (formSubmitted) {
      validateForm();
    }
  };
  
  // Validate the form
  const validateForm = () => {
    // Check if required fields are filled
    const isValid = 
      formData.category !== '' && 
      formData.type !== '' && 
      formData.budgetAmount !== '' && 
      parseFloat(formData.budgetAmount) > 0;
      
    setValidated(!isValid);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    const newBudgetAmount = parseFloat(formData.budgetAmount);
    const newActualAmount = formData.actualAmount ? parseFloat(formData.actualAmount) : 0;
    
    const historicalData = Array(6).fill(0).map(() => 
      Math.round(newBudgetAmount * (0.95 + (Math.random() * 0.1)))
    );
    
    const newItem = {
      category: formData.category,
      type: formData.type,
      budgetAmount: newBudgetAmount,
      actualAmount: newActualAmount,
      notes: formData.notes || '',
      historicalData: historicalData
    };
    
    // Call parent's save handler
    handleSave(newItem);
    
    // Close modal
    handleClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      aria-labelledby="add-budget-modal-title"
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="add-budget-modal-title">Add New Budget Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="new-budget-type">Type</Form.Label>
                <Form.Select
                  id="new-budget-type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  isInvalid={validated && !formData.type}
                >
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a type.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="new-budget-category">Category</Form.Label>
                <Form.Select
                  id="new-budget-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  isInvalid={validated && !formData.category}
                >
                  <option value="">-- Select Category --</option>
                  {budgetCategories[formData.type]?.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a category.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="new-budget-amount">Budget Amount</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    id="new-budget-amount"
                    type="number"
                    name="budgetAmount"
                    value={formData.budgetAmount}
                    onChange={handleInputChange}
                    min="0.01"
                    step="100"
                    isInvalid={validated && (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a budget amount greater than zero.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="new-actual-amount">Actual Amount</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    id="new-actual-amount"
                    type="number"
                    name="actualAmount"
                    value={formData.actualAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    placeholder="0"
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  Leave blank for zero (0)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="new-budget-notes">Notes</Form.Label>
                <Form.Control
                  id="new-budget-notes"
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Optional notes"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            <FaTimes className="me-1" /> Cancel
          </Button>
          <Button variant="primary" type="submit">
            <FaSave className="me-1" /> Add Budget Item
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddBudgetModal;