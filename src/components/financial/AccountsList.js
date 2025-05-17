// src/components/financial/AccountsList.js
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Row, Col, Badge, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaTrash, FaPencilAlt, FaExchangeAlt, FaMoneyBillAlt, FaHistory, FaEye, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../common/PageTitle';

const AccountsList = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [accountForm, setAccountForm] = useState({
    name: '',
    type: 'checking',
    balance: '',
    institution: '',
    accountNumber: '',
    description: ''
  });

  // Account types
  const accountTypes = [
    { value: 'checking', label: 'Checking', color: 'primary' },
    { value: 'savings', label: 'Savings', color: 'success' },
    { value: 'credit', label: 'Credit Card', color: 'danger' },
    { value: 'loan', label: 'Loan', color: 'warning' },
    { value: 'investment', label: 'Investment', color: 'info' },
    { value: 'other', label: 'Other', color: 'secondary' }
  ];

  // Load accounts data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAccounts = [
        {
          id: 1,
          name: 'Business Checking',
          type: 'checking',
          balance: 125000.75,
          institution: 'Bank of America',
          accountNumber: '******1234',
          description: 'Main operational account',
          lastTransaction: new Date(new Date().setDate(new Date().getDate() - 1)),
          isReconciled: true
        },
        {
          id: 2,
          name: 'Business Savings',
          type: 'savings',
          balance: 75000.00,
          institution: 'Bank of America',
          accountNumber: '******5678',
          description: 'Emergency fund and reserves',
          lastTransaction: new Date(new Date().setDate(new Date().getDate() - 5)),
          isReconciled: true
        },
        {
          id: 3,
          name: 'Company Credit Card',
          type: 'credit',
          balance: -4250.85,
          institution: 'American Express',
          accountNumber: '******9012',
          description: 'Primary business expenses',
          lastTransaction: new Date(new Date().setDate(new Date().getDate() - 2)),
          isReconciled: false
        },
        {
          id: 4,
          name: 'Vehicle Loan',
          type: 'loan',
          balance: -85000.00,
          institution: 'Motor Finance Co.',
          accountNumber: '******3456',
          description: 'Fleet vehicle loans',
          lastTransaction: new Date(new Date().setDate(new Date().getDate() - 15)),
          isReconciled: true
        },
        {
          id: 5,
          name: 'Tax Reserve',
          type: 'savings',
          balance: 35000.00,
          institution: 'Bank of America',
          accountNumber: '******7890',
          description: 'Reserved for quarterly tax payments',
          lastTransaction: new Date(new Date().setDate(new Date().getDate() - 20)),
          isReconciled: true
        },
        {
          id: 6,
          name: 'Payroll Account',
          type: 'checking',
          balance: 42500.00,
          institution: 'Wells Fargo',
          accountNumber: '******2468',
          description: 'Dedicated for payroll transactions',
          lastTransaction: new Date(new Date().setDate(new Date().getDate() - 7)),
          isReconciled: true
        }
      ];
      
      setAccounts(mockAccounts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    const isNegative = amount < 0;
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      signDisplay: isNegative ? 'never' : 'auto'
    }).format(Math.abs(amount));
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get account type badge
  const getAccountTypeBadge = (type) => {
    const accountType = accountTypes.find(t => t.value === type);
    return accountType ? (
      <Badge bg={accountType.color} className="text-uppercase">
        {accountType.label}
      </Badge>
    ) : null;
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalAssets = accounts
      .filter(account => account.balance > 0)
      .reduce((sum, account) => sum + account.balance, 0);
    
    const totalLiabilities = accounts
      .filter(account => account.balance < 0)
      .reduce((sum, account) => sum + Math.abs(account.balance), 0);
    
    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities
    };
  };

  // Handle transfer form changes
  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferData({
      ...transferData,
      [name]: value
    });
  };

  // Handle account form changes
  const handleAccountFormChange = (e) => {
    const { name, value } = e.target;
    setAccountForm({
      ...accountForm,
      [name]: value
    });
  };

  // Handle transfer submit
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    
    // Validate transfer data
    if (!transferData.fromAccount || !transferData.toAccount || !transferData.amount) {
      return;
    }
    
    // In a real app, this would be an API call
    const updatedAccounts = [...accounts];
    const fromAccount = updatedAccounts.find(acc => acc.id === parseInt(transferData.fromAccount));
    const toAccount = updatedAccounts.find(acc => acc.id === parseInt(transferData.toAccount));
    
    if (fromAccount && toAccount) {
      const amount = parseFloat(transferData.amount);
      fromAccount.balance -= amount;
      toAccount.balance += amount;
      
      // Update last transaction date
      const now = new Date();
      fromAccount.lastTransaction = now;
      toAccount.lastTransaction = now;
      
      // Update state
      setAccounts(updatedAccounts);
      
      // Reset form and close modal
      setTransferData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
      });
      setShowTransferModal(false);
    }
  };

  // Handle edit account
  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setAccountForm({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      institution: account.institution,
      accountNumber: account.accountNumber,
      description: account.description
    });
    setShowEditModal(true);
  };

  // Handle edit account submit
  const handleEditAccountSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!accountForm.name || !accountForm.balance) {
      return;
    }
    
    // In a real app, this would be an API call
    const updatedAccounts = accounts.map(account => 
      account.id === selectedAccount.id ? 
        {
          ...account,
          name: accountForm.name,
          type: accountForm.type,
          balance: parseFloat(accountForm.balance),
          institution: accountForm.institution,
          accountNumber: accountForm.accountNumber,
          description: accountForm.description
        } : 
        account
    );
    
    // Update state
    setAccounts(updatedAccounts);
    
    // Reset form and close modal
    setAccountForm({
      name: '',
      type: 'checking',
      balance: '',
      institution: '',
      accountNumber: '',
      description: ''
    });
    setSelectedAccount(null);
    setShowEditModal(false);
  };

  // Handle add account
  const handleAddAccount = () => {
    setAccountForm({
      name: '',
      type: 'checking',
      balance: '',
      institution: '',
      accountNumber: '',
      description: ''
    });
    setShowAddModal(true);
  };

  // Handle add account submit
  const handleAddAccountSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!accountForm.name || !accountForm.balance) {
      return;
    }
    
    // In a real app, this would be an API call
    const newAccount = {
      id: Math.max(...accounts.map(acc => acc.id), 0) + 1,
      name: accountForm.name,
      type: accountForm.type,
      balance: parseFloat(accountForm.balance),
      institution: accountForm.institution,
      accountNumber: accountForm.accountNumber,
      description: accountForm.description,
      lastTransaction: new Date(),
      isReconciled: true
    };
    
    // Update state
    setAccounts([...accounts, newAccount]);
    
    // Reset form and close modal
    setAccountForm({
      name: '',
      type: 'checking',
      balance: '',
      institution: '',
      accountNumber: '',
      description: ''
    });
    setShowAddModal(false);
  };

  // Handle delete account
  const handleDeleteAccount = (id) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      // In a real app, this would be an API call
      setAccounts(accounts.filter(account => account.id !== id));
    }
  };

  // Handle view transactions
  const handleViewTransactions = (accountId) => {
    navigate(`/financial/accounts/${accountId}/transactions`);
  };

  // Calculate account totals
  const totals = calculateTotals();

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title="Accounts"
        backButton={false}
      />
      
      <div className="d-flex justify-content-end mb-4">
        <Button 
          variant="outline-primary"
          className="me-2"
          onClick={() => setShowTransferModal(true)}
        >
          <FaExchangeAlt className="me-1" /> Transfer Funds
        </Button>
        <Button 
          variant="primary"
          onClick={handleAddAccount}
        >
          <FaPlus className="me-1" /> Add Account
        </Button>
      </div>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-success bg-opacity-10 rounded p-3 me-3">
                <FaMoneyBillAlt className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Assets</h6>
                <h3 className="mb-0 text-success">{formatCurrency(totals.totalAssets)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-danger bg-opacity-10 rounded p-3 me-3">
                <FaMoneyBillAlt className="text-danger" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Liabilities</h6>
                <h3 className="mb-0 text-danger">{formatCurrency(totals.totalLiabilities)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-primary bg-opacity-10 rounded p-3 me-3">
                <FaMoneyBillAlt className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Net Worth</h6>
                <h3 className={`mb-0 ${totals.netWorth >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(totals.netWorth)}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading accounts...</p>
            </div>
          ) : (
            <>
              {accounts.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No accounts found.</p>
                  <Button 
                    variant="primary"
                    onClick={handleAddAccount}
                  >
                    <FaPlus className="me-1" /> Add Account
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Account Name</th>
                        <th>Type</th>
                        <th>Institution</th>
                        <th>Balance</th>
                        <th>Last Transaction</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map(account => (
                        <tr key={account.id}>
                          <td>
                            <div className="fw-bold">{account.name}</div>
                            <div className="text-muted small">{account.description}</div>
                          </td>
                          <td>{getAccountTypeBadge(account.type)}</td>
                          <td>
                            <div>{account.institution}</div>
                            <div className="text-muted small">{account.accountNumber}</div>
                          </td>
                          <td className={`fw-bold ${account.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                            {account.balance >= 0 ? '' : '-'}
                            {formatCurrency(Math.abs(account.balance))}
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(account.lastTransaction)}
                          </td>
                          <td>
                            {account.isReconciled ? 
                              <Badge bg="success">Reconciled</Badge> : 
                              <Badge bg="warning">Pending</Badge>
                            }
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-1"
                              onClick={() => handleViewTransactions(account.id)}
                            >
                              <FaHistory />
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="me-1"
                              onClick={() => handleEditAccount(account)}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteAccount(account.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Transfer Funds Modal */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)}>
        <Form onSubmit={handleTransferSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Transfer Funds</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>From Account</Form.Label>
              <Form.Select 
                name="fromAccount"
                value={transferData.fromAccount}
                onChange={handleTransferChange}
                required
              >
                <option value="">-- Select Account --</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({formatCurrency(account.balance)})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>To Account</Form.Label>
              <Form.Select 
                name="toAccount"
                value={transferData.toAccount}
                onChange={handleTransferChange}
                required
              >
                <option value="">-- Select Account --</option>
                {accounts.map(account => (
                  <option 
                    key={account.id} 
                    value={account.id}
                    disabled={account.id === parseInt(transferData.fromAccount)}
                  >
                    {account.name} ({formatCurrency(account.balance)})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="amount"
                  value={transferData.amount}
                  onChange={handleTransferChange}
                  required
                />
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={transferData.description}
                onChange={handleTransferChange}
                placeholder="Transfer description (optional)"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransferModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Transfer Funds
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Edit Account Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form onSubmit={handleEditAccountSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={accountForm.name}
                onChange={handleAccountFormChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Account Type</Form.Label>
              <Form.Select 
                name="type"
                value={accountForm.type}
                onChange={handleAccountFormChange}
                required
              >
                {accountTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Institution</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                value={accountForm.institution}
                onChange={handleAccountFormChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                name="accountNumber"
                value={accountForm.accountNumber}
                onChange={handleAccountFormChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Current Balance</Form.Label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="balance"
                  value={accountForm.balance}
                  onChange={handleAccountFormChange}
                  required
                />
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={accountForm.description}
                onChange={handleAccountFormChange}
                placeholder="Account description (optional)"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Add Account Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Form onSubmit={handleAddAccountSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={accountForm.name}
                onChange={handleAccountFormChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Account Type</Form.Label>
              <Form.Select 
                name="type"
                value={accountForm.type}
                onChange={handleAccountFormChange}
                required
              >
                {accountTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Institution</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                value={accountForm.institution}
                onChange={handleAccountFormChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                name="accountNumber"
                value={accountForm.accountNumber}
                onChange={handleAccountFormChange}
                placeholder="Last 4 digits will be displayed"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Initial Balance</Form.Label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="balance"
                  value={accountForm.balance}
                  onChange={handleAccountFormChange}
                  required
                />
              </div>
              <Form.Text className="text-muted">
                Use negative values for credit cards and loans.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={accountForm.description}
                onChange={handleAccountFormChange}
                placeholder="Account description (optional)"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Account
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountsList;