import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Tab, Nav, Form, Button, Alert, 
  Table, Badge, Modal, InputGroup, FormControl, ListGroup, OverlayTrigger, Tooltip 
} from 'react-bootstrap';
import { 
  FaUser, FaBell, FaShieldAlt, FaBuilding, FaCreditCard, FaUsers, 
  FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaKey, FaSearch,
  FaEye, FaEyeSlash, FaUserLock, FaLock, FaEnvelope, FaPhone
} from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState(null);
  
  // User form state
  const [userForm, setUserForm] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    status: 'active',
    password: '',
    confirmPassword: ''
  });

  // Role form state
  const [roleForm, setRoleForm] = useState({
    id: null,
    name: '',
    description: '',
    permissions: {
      leads: {
        view: true,
        create: true,
        edit: true,
        delete: false
      },
      deliveries: {
        view: true,
        create: true,
        edit: true,
        delete: false
      },
      financial: {
        view: true,
        create: false,
        edit: false,
        delete: false
      },
      settings: {
        view: false,
        userManagement: false
      }
    }
  });
  
  // Mock user data
  const [userData, setUserData] = useState({
    firstName: 'Nate',
    lastName: 'Holder',
    email: 'admin@aretialliance.com',
    phone: '(678) 727-8485',
    role: 'Administrator',
    notificationPreferences: {
      emailAlerts: true,
      smsAlerts: false,
      newLeadNotification: true,
      deliveryUpdates: true,
      reportGeneration: true,
      systemAlerts: true
    },
    companySettings: {
      companyName: 'Areti Alliance',
      address: '1201 W. Peachtree St., NW, Ste. 2300',
      city: 'Atlanta',
      state: 'GA',
      zip: '30309',
      phone: '(855) 818-3278',
      website: 'www.aretialliance.com',
      EIN: '33-4493265'
    }
  });

  // Mock users for the users list
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: 'Nate',
      lastName: 'Holder',
      email: 'admin@aretialliance.com',
      phone: '(678) 727-8485',
      role: 'Administrator',
      status: 'active',
      lastLogin: '2025-05-06T09:30:00',
      created: '2024-08-15T14:23:00'
    },
    {
      id: 2,
      firstName: 'John',
      lastName: 'Smith',
      email: 'j.smith@aretialliance.com',
      phone: '(404) 555-1234',
      role: 'Manager',
      status: 'active',
      lastLogin: '2025-05-05T16:45:00',
      created: '2024-09-01T11:15:00'
    },
    {
      id: 3,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 's.johnson@aretialliance.com',
      phone: '(404) 555-5678',
      role: 'Sales Rep',
      status: 'active',
      lastLogin: '2025-05-06T08:20:00',
      created: '2024-11-15T09:30:00'
    },
    {
      id: 4,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'm.brown@aretialliance.com',
      phone: '(404) 555-9012',
      role: 'Dispatcher',
      status: 'active',
      lastLogin: '2025-05-05T12:10:00',
      created: '2025-01-10T13:45:00'
    },
    {
      id: 5,
      firstName: 'Jessica',
      lastName: 'Davis',
      email: 'j.davis@aretialliance.com',
      phone: '(404) 555-3456',
      role: 'Driver',
      status: 'inactive',
      lastLogin: '2025-03-12T10:30:00',
      created: '2025-02-05T15:20:00'
    }
  ]);

  // Mock roles
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Administrator',
      description: 'Full access to all system features',
      permissions: {
        leads: { view: true, create: true, edit: true, delete: true },
        deliveries: { view: true, create: true, edit: true, delete: true },
        financial: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, userManagement: true }
      }
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Access to most features with limited delete permissions',
      permissions: {
        leads: { view: true, create: true, edit: true, delete: false },
        deliveries: { view: true, create: true, edit: true, delete: false },
        financial: { view: true, create: true, edit: true, delete: false },
        settings: { view: true, userManagement: false }
      }
    },
    {
      id: 3,
      name: 'Sales Rep',
      description: 'Access to leads and basic delivery information',
      permissions: {
        leads: { view: true, create: true, edit: true, delete: false },
        deliveries: { view: true, create: true, edit: false, delete: false },
        financial: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, userManagement: false }
      }
    },
    {
      id: 4,
      name: 'Dispatcher',
      description: 'Access to delivery management',
      permissions: {
        leads: { view: true, create: false, edit: false, delete: false },
        deliveries: { view: true, create: true, edit: true, delete: false },
        financial: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, userManagement: false }
      }
    },
    {
      id: 5,
      name: 'Driver',
      description: 'Limited access to assigned deliveries',
      permissions: {
        leads: { view: false, create: false, edit: false, delete: false },
        deliveries: { view: true, create: false, edit: false, delete: false },
        financial: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, userManagement: false }
      }
    }
  ]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle form input changes for main user profile
  const handleInputChange = (section, field, value) => {
    if (section === 'root') {
      setUserData({
        ...userData,
        [field]: value
      });
    } else {
      setUserData({
        ...userData,
        [section]: {
          ...userData[section],
          [field]: value
        }
      });
    }
  };

  // Handle user form input changes
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };

  // Handle role form input changes
  const handleRoleFormChange = (e) => {
    const { name, value } = e.target;
    setRoleForm({
      ...roleForm,
      [name]: value
    });
  };

  // Handle permission toggle in role form
  const handlePermissionChange = (section, action) => {
    setRoleForm({
      ...roleForm,
      permissions: {
        ...roleForm.permissions,
        [section]: {
          ...roleForm.permissions[section],
          [action]: !roleForm.permissions[section][action]
        }
      }
    });
  };

  // Handle checkbox changes for notification preferences
  const handleCheckboxChange = (field) => {
    setUserData({
      ...userData,
      notificationPreferences: {
        ...userData.notificationPreferences,
        [field]: !userData.notificationPreferences[field]
      }
    });
  };

  // Handle form submission for profile settings
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to API
    console.log('Saving settings:', userData);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Open user modal for creating a new user
  const handleAddUser = () => {
    setUserForm({
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'User',
      status: 'active',
      password: '',
      confirmPassword: ''
    });
    setCurrentEditUser(null);
    setShowUserModal(true);
  };

  // Open user modal for editing an existing user
  const handleEditUser = (user) => {
    setUserForm({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      password: '',
      confirmPassword: ''
    });
    setCurrentEditUser(user);
    setShowUserModal(true);
  };

  // Confirm user deletion
  const handleConfirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Delete user
  const handleDeleteUser = () => {
    // In a real app, this would be an API call
    const updatedUsers = users.filter(user => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    setShowDeleteModal(false);
    setUserToDelete(null);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Save user (create or update)
  const handleSaveUser = (e) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!userForm.firstName || !userForm.lastName || !userForm.email) {
        throw new Error('Please fill in all required fields');
      }
      
      if (!userForm.id && (!userForm.password || userForm.password.length < 8)) {
        throw new Error('Password must be at least 8 characters');
      }
      
      if (!userForm.id && userForm.password !== userForm.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // In a real app, this would be an API call
      if (userForm.id) {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.id === userForm.id ? { ...user, ...userForm } : user
        );
        setUsers(updatedUsers);
      } else {
        // Create new user
        const newUser = {
          ...userForm,
          id: users.length + 1,
          created: new Date().toISOString(),
          lastLogin: null
        };
        setUsers([...users, newUser]);
      }
      
      setShowUserModal(false);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      setSaveError(error.message);
      setTimeout(() => {
        setSaveError('');
      }, 3000);
    }
  };

  // Open role modal for creating or editing a role
  const handleAddRole = () => {
    setRoleForm({
      id: null,
      name: '',
      description: '',
      permissions: {
        leads: { view: true, create: false, edit: false, delete: false },
        deliveries: { view: true, create: false, edit: false, delete: false },
        financial: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, userManagement: false }
      }
    });
    setShowRoleModal(true);
  };

  // Open role modal for editing an existing role
  const handleEditRole = (role) => {
    setRoleForm({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions }
    });
    setShowRoleModal(true);
  };

  // Save role (create or update)
  const handleSaveRole = (e) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!roleForm.name) {
        throw new Error('Role name is required');
      }
      
      // In a real app, this would be an API call
      if (roleForm.id) {
        // Update existing role
        const updatedRoles = roles.map(role => 
          role.id === roleForm.id ? { ...role, ...roleForm } : role
        );
        setRoles(updatedRoles);
      } else {
        // Create new role
        const newRole = {
          ...roleForm,
          id: roles.length + 1
        };
        setRoles([...roles, newRole]);
      }
      
      setShowRoleModal(false);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      setSaveError(error.message);
      setTimeout(() => {
        setSaveError('');
      }, 3000);
    }
  };

  // Handle role delete
  const handleDeleteRole = (roleId) => {
    // Check if role is assigned to any users
    const usersWithRole = users.filter(user => 
      user.role === roles.find(r => r.id === roleId)?.name
    );
    
    if (usersWithRole.length > 0) {
      setSaveError(`Cannot delete role that is assigned to ${usersWithRole.length} user(s)`);
      setTimeout(() => {
        setSaveError('');
      }, 3000);
      return;
    }
    
    // Delete role
    const updatedRoles = roles.filter(role => role.id !== roleId);
    setRoles(updatedRoles);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Toggle user status (active/inactive)
  const handleToggleStatus = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Handle password reset
  const handleResetPassword = (userId) => {
    // In a real app, this would generate a password reset link or temporary password
    alert(`Password reset link sent to user #${userId}`);
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Settings</h1>
      
      {saveSuccess && (
        <Alert variant="success" dismissible onClose={() => setSaveSuccess(false)}>
          Settings saved successfully!
        </Alert>
      )}
      
      {saveError && (
        <Alert variant="danger" dismissible onClose={() => setSaveError(false)}>
          {saveError}
        </Alert>
      )}
      
      <Row>
        <Col md={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-0">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link 
                    className="d-flex align-items-center rounded-0 border-bottom px-4 py-3"
                    active={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                  >
                    <FaUser className="me-2" /> Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className="d-flex align-items-center rounded-0 border-bottom px-4 py-3"
                    active={activeTab === 'notifications'}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <FaBell className="me-2" /> Notifications
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className="d-flex align-items-center rounded-0 border-bottom px-4 py-3"
                    active={activeTab === 'company'}
                    onClick={() => setActiveTab('company')}
                  >
                    <FaBuilding className="me-2" /> Company Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className="d-flex align-items-center rounded-0 border-bottom px-4 py-3"
                    active={activeTab === 'security'}
                    onClick={() => setActiveTab('security')}
                  >
                    <FaShieldAlt className="me-2" /> Security
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className="d-flex align-items-center rounded-0 border-bottom px-4 py-3"
                    active={activeTab === 'users'}
                    onClick={() => setActiveTab('users')}
                  >
                    <FaUsers className="me-2" /> User Management
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className="d-flex align-items-center rounded-0 border-bottom px-4 py-3"
                    active={activeTab === 'roles'}
                    onClick={() => setActiveTab('roles')}
                  >
                    <FaUserLock className="me-2" /> Roles & Permissions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className="d-flex align-items-center rounded-0 px-4 py-3"
                    active={activeTab === 'billing'}
                    onClick={() => setActiveTab('billing')}
                  >
                    <FaCreditCard className="me-2" /> Billing
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="settings-content">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div>
                    <h4 className="mb-4">Profile Settings</h4>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={userData.firstName}
                              onChange={(e) => handleInputChange('root', 'firstName', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={userData.lastName}
                              onChange={(e) => handleInputChange('root', 'lastName', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                              type="email" 
                              value={userData.email}
                              onChange={(e) => handleInputChange('root', 'email', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={userData.phone}
                              onChange={(e) => handleInputChange('root', 'phone', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={userData.role}
                          disabled
                        />
                        <Form.Text className="text-muted">
                          Role changes can only be made by a system administrator.
                        </Form.Text>
                      </Form.Group>
                      
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </Form>
                  </div>
                )}
                
                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div>
                    <h4 className="mb-4">Notification Preferences</h4>
                    <Form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <h5 className="mb-3">Delivery Methods</h5>
                        <Form.Check 
                          type="checkbox" 
                          id="emailAlerts" 
                          label="Email Notifications" 
                          className="mb-2"
                          checked={userData.notificationPreferences.emailAlerts}
                          onChange={() => handleCheckboxChange('emailAlerts')}
                        />
                        <Form.Check 
                          type="checkbox" 
                          id="smsAlerts" 
                          label="SMS Notifications" 
                          checked={userData.notificationPreferences.smsAlerts}
                          onChange={() => handleCheckboxChange('smsAlerts')}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="mb-3">Notification Types</h5>
                        <Form.Check 
                          type="checkbox" 
                          id="newLeadNotification" 
                          label="New Lead Notification" 
                          className="mb-2"
                          checked={userData.notificationPreferences.newLeadNotification}
                          onChange={() => handleCheckboxChange('newLeadNotification')}
                        />
                        <Form.Check 
                          type="checkbox" 
                          id="deliveryUpdates" 
                          label="Delivery Status Updates" 
                          className="mb-2"
                          checked={userData.notificationPreferences.deliveryUpdates}
                          onChange={() => handleCheckboxChange('deliveryUpdates')}
                        />
                        <Form.Check 
                          type="checkbox" 
                          id="reportGeneration" 
                          label="Report Generation" 
                          className="mb-2"
                          checked={userData.notificationPreferences.reportGeneration}
                          onChange={() => handleCheckboxChange('reportGeneration')}
                        />
                        <Form.Check 
                          type="checkbox" 
                          id="systemAlerts" 
                          label="System Alerts" 
                          checked={userData.notificationPreferences.systemAlerts}
                          onChange={() => handleCheckboxChange('systemAlerts')}
                        />
                      </div>
                      
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </Form>
                  </div>
                )}
                
                {/* Company Settings */}
                {activeTab === 'company' && (
                  <div>
                    <h4 className="mb-4">Company Profile</h4>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={userData.companySettings.companyName}
                          onChange={(e) => handleInputChange('companySettings', 'companyName', e.target.value)}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={userData.companySettings.address}
                          onChange={(e) => handleInputChange('companySettings', 'address', e.target.value)}
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={userData.companySettings.city}
                              onChange={(e) => handleInputChange('companySettings', 'city', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={userData.companySettings.state}
                              onChange={(e) => handleInputChange('companySettings', 'state', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>ZIP Code</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={userData.companySettings.zip}
                              onChange={(e) => handleInputChange('companySettings', 'zip', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={userData.companySettings.phone}
                              onChange={(e) => handleInputChange('companySettings', 'phone', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Website</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={userData.companySettings.website}
                              onChange={(e) => handleInputChange('companySettings', 'website', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Tax ID / EIN</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={userData.companySettings.EIN}
                          onChange={(e) => handleInputChange('companySettings', 'EIN', e.target.value)}
                        />
                      </Form.Group>
                      
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </Form>
                  </div>
                )}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div>
                    <h4 className="mb-4">Security Settings</h4>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" />
                      </Form.Group>
                      
                      <Form.Group className="mb-4">
                        <Form.Label>Two-Factor Authentication</Form.Label>
                        <div className="d-flex align-items-center mt-2">
                          <Form.Check 
                            type="switch"
                            id="two-factor-auth"
                            className="me-2"
                          />
                          <div>Enable two-factor authentication for additional security</div>
                        </div>
                      </Form.Group>

                      <Card className="mb-4 border">
                        <Card.Header className="bg-light">
                          <h5 className="mb-0">Login History</h5>
                        </Card.Header>
                        <Card.Body>
                          <Table hover responsive size="sm">
                            <thead>
                              <tr>
                                <th>Date & Time</th>
                                <th>IP Address</th>
                                <th>Location</th>
                                <th>Device</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>May 7, 2025, 09:30 AM</td>
                                <td>192.168.1.1</td>
                                <td>Atlanta, GA</td>
                                <td>Chrome on Windows</td>
                                <td><Badge bg="success">Successful</Badge></td>
                              </tr>
                              <tr>
                                <td>May 6, 2025, 02:15 PM</td>
                                <td>192.168.1.1</td>
                                <td>Atlanta, GA</td>
                                <td>Chrome on Windows</td>
                                <td><Badge bg="success">Successful</Badge></td>
                              </tr>
                              <tr>
                                <td>May 5, 2025, 10:45 AM</td>
                                <td>192.168.1.1</td>
                                <td>Atlanta, GA</td>
                                <td>Safari on MacOS</td>
                                <td><Badge bg="success">Successful</Badge></td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                      
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </Form>
                  </div>
                )}
                
                {/* User Management */}
                {activeTab === 'users' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">User Management</h4>
                      <Button variant="primary" onClick={handleAddUser}>
                        <FaPlus className="me-1" /> Add User
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <InputGroup>
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                        <FormControl
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </div>
                    
                    <Table hover responsive className="align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Last Login</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.map(user => (
                          <tr key={user.id}>
                            <td>
                              {user.firstName} {user.lastName}
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <Badge bg="secondary">{user.role}</Badge>
                            </td>
                            <td>
                              <Badge
                                bg={user.status === 'active' ? 'success' : 'danger'}
                                className="cursor-pointer"
                                onClick={() => handleToggleStatus(user.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                {user.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>{formatDate(user.lastLogin)}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Edit User</Tooltip>}
                                >
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <FaEdit />
                                  </Button>
                                </OverlayTrigger>
                                
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Reset Password</Tooltip>}
                                >
                                  <Button 
                                    size="sm" 
                                    variant="outline-warning"
                                    onClick={() => handleResetPassword(user.id)}
                                  >
                                    <FaKey />
                                  </Button>
                                </OverlayTrigger>
                                
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Delete User</Tooltip>}
                                >
                                  <Button 
                                    size="sm" 
                                    variant="outline-danger"
                                    onClick={() => handleConfirmDelete(user)}
                                    disabled={user.id === 1} // Prevent deleting the admin user
                                  >
                                    <FaTrash />
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted">No users found.</p>
                      </div>
                    )}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center mt-4">
                        <nav>
                          <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <Button 
                                className="page-link" 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                Previous
                              </Button>
                            </li>
                            
                            {[...Array(totalPages)].map((_, index) => (
                              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <Button 
                                  className="page-link" 
                                  onClick={() => handlePageChange(index + 1)}
                                >
                                  {index + 1}
                                </Button>
                              </li>
                            ))}
                            
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <Button 
                                className="page-link" 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                Next
                              </Button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Roles & Permissions */}
                {activeTab === 'roles' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">Roles & Permissions</h4>
                      <Button variant="primary" onClick={handleAddRole}>
                        <FaPlus className="me-1" /> Add Role
                      </Button>
                    </div>
                    
                    <Table hover responsive className="align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th>Role Name</th>
                          <th>Description</th>
                          <th>Users</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.map(role => (
                          <tr key={role.id}>
                            <td className="fw-bold">{role.name}</td>
                            <td>{role.description}</td>
                            <td>
                              {users.filter(user => user.role === role.name).length}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Edit Role</Tooltip>}
                                >
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary"
                                    onClick={() => handleEditRole(role)}
                                  >
                                    <FaEdit />
                                  </Button>
                                </OverlayTrigger>
                                
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Delete Role</Tooltip>}
                                >
                                  <Button 
                                    size="sm" 
                                    variant="outline-danger"
                                    onClick={() => handleDeleteRole(role.id)}
                                    disabled={role.id === 1 || users.filter(user => user.role === role.name).length > 0} // Prevent deleting the admin role or roles with assigned users
                                  >
                                    <FaTrash />
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="mt-4">
                      <h5 className="mb-3">Role Permissions</h5>
                      <p className="text-muted">
                        Select a role from the table above to view and edit its permissions.
                      </p>
                      
                      {/* This would show selected role permissions in a real implementation */}
                      <div className="border rounded p-3 bg-light">
                        <Row>
                          <Col md={3}>
                            <div className="fw-bold mb-2">Leads</div>
                            <div className="small mb-1">
                              <Badge bg="success" className="me-1">View</Badge>
                              <Badge bg="success" className="me-1">Create</Badge>
                              <Badge bg="success" className="me-1">Edit</Badge>
                              <Badge bg="danger">Delete</Badge>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="fw-bold mb-2">Deliveries</div>
                            <div className="small mb-1">
                              <Badge bg="success" className="me-1">View</Badge>
                              <Badge bg="success" className="me-1">Create</Badge>
                              <Badge bg="success" className="me-1">Edit</Badge>
                              <Badge bg="danger">Delete</Badge>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="fw-bold mb-2">Financial</div>
                            <div className="small mb-1">
                              <Badge bg="success" className="me-1">View</Badge>
                              <Badge bg="success" className="me-1">Create</Badge>
                              <Badge bg="success" className="me-1">Edit</Badge>
                              <Badge bg="danger">Delete</Badge>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="fw-bold mb-2">Settings</div>
                            <div className="small mb-1">
                              <Badge bg="success" className="me-1">View</Badge>
                              <Badge bg="danger">User Management</Badge>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Billing Settings */}
                {activeTab === 'billing' && (
                  <div>
                    <h4 className="mb-4">Billing Information</h4>
                    <Alert variant="info">
                      Your current plan: <strong>Enterprise</strong>
                    </Alert>
                    
                    <Card className="mb-4 border">
                      <Card.Body>
                        <h5 className="mb-3">Payment Method</h5>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="bg-light p-2 rounded">
                              <FaCreditCard size={24} />
                            </span>
                          </div>
                          <div>
                            <div className="fw-bold">Visa ending in 4321</div>
                            <div className="small text-muted">Expires 05/2026</div>
                          </div>
                          <Button variant="outline-secondary" size="sm" className="ms-auto">
                            Update
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                    
                    <Card className="mb-4 border">
                      <Card.Body>
                        <h5 className="mb-3">Billing Address</h5>
                        <address>
                          {userData.companySettings.companyName}<br />
                          {userData.companySettings.address}<br />
                          {userData.companySettings.city}, {userData.companySettings.state} {userData.companySettings.zip}<br />
                          United States
                        </address>
                        <Button variant="outline-secondary" size="sm">
                          Update
                        </Button>
                      </Card.Body>
                    </Card>
                    
                    <Card className="border">
                      <Card.Body>
                        <h5 className="mb-3">Billing History</h5>
                        <Table hover responsive>
                          <thead className="bg-light">
                            <tr>
                              <th>Date</th>
                              <th>Invoice #</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>May 01, 2025</td>
                              <td>INV-2025-0512</td>
                              <td>$499.00</td>
                              <td><Badge bg="success">Paid</Badge></td>
                              <td><Button variant="link" size="sm">View</Button></td>
                            </tr>
                            <tr>
                              <td>Apr 01, 2025</td>
                              <td>INV-2025-0412</td>
                              <td>$499.00</td>
                              <td><Badge bg="success">Paid</Badge></td>
                              <td><Button variant="link" size="sm">View</Button></td>
                            </tr>
                            <tr>
                              <td>Mar 01, 2025</td>
                              <td>INV-2025-0311</td>
                              <td>$499.00</td>
                              <td><Badge bg="success">Paid</Badge></td>
                              <td><Button variant="link" size="sm">View</Button></td>
                            </tr>
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* User Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentEditUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveUser}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleUserFormChange}
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
                    value={userForm.lastName}
                    onChange={handleUserFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleUserFormChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaPhone />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={userForm.phone}
                      onChange={handleUserFormChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="role"
                    value={userForm.role}
                    onChange={handleUserFormChange}
                    required
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>
                        {role.name}
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
                    value={userForm.status}
                    onChange={handleUserFormChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            {!currentEditUser && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={userForm.password}
                      onChange={handleUserFormChange}
                      required={!currentEditUser}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters long.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={userForm.confirmPassword}
                    onChange={handleUserFormChange}
                    required={!currentEditUser}
                  />
                </Form.Group>
              </>
            )}
            
            {currentEditUser && (
              <Alert variant="info">
                <FaLock className="me-2" />
                To change the user's password, use the "Reset Password" option from the user list.
              </Alert>
            )}
            
            <div className="text-end mt-4">
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => setShowUserModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentEditUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the user: <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong>?
          </p>
          <p className="text-danger">
            This action cannot be undone. All data associated with this user will be permanently removed.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Role Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {roleForm.id ? 'Edit Role' : 'Add New Role'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveRole}>
            <Form.Group className="mb-3">
              <Form.Label>Role Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={roleForm.name}
                onChange={handleRoleFormChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={roleForm.description}
                onChange={handleRoleFormChange}
              />
            </Form.Group>
            
            <h5 className="mb-3">Permissions</h5>
            
            <Card className="mb-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Leads</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="leads-view"
                      label="View"
                      checked={roleForm.permissions.leads.view}
                      onChange={() => handlePermissionChange('leads', 'view')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="leads-create"
                      label="Create"
                      checked={roleForm.permissions.leads.create}
                      onChange={() => handlePermissionChange('leads', 'create')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="leads-edit"
                      label="Edit"
                      checked={roleForm.permissions.leads.edit}
                      onChange={() => handlePermissionChange('leads', 'edit')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="leads-delete"
                      label="Delete"
                      checked={roleForm.permissions.leads.delete}
                      onChange={() => handlePermissionChange('leads', 'delete')}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <Card className="mb-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Deliveries</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="deliveries-view"
                      label="View"
                      checked={roleForm.permissions.deliveries.view}
                      onChange={() => handlePermissionChange('deliveries', 'view')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="deliveries-create"
                      label="Create"
                      checked={roleForm.permissions.deliveries.create}
                      onChange={() => handlePermissionChange('deliveries', 'create')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="deliveries-edit"
                      label="Edit"
                      checked={roleForm.permissions.deliveries.edit}
                      onChange={() => handlePermissionChange('deliveries', 'edit')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="deliveries-delete"
                      label="Delete"
                      checked={roleForm.permissions.deliveries.delete}
                      onChange={() => handlePermissionChange('deliveries', 'delete')}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <Card className="mb-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Financial</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="financial-view"
                      label="View"
                      checked={roleForm.permissions.financial.view}
                      onChange={() => handlePermissionChange('financial', 'view')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="financial-create"
                      label="Create"
                      checked={roleForm.permissions.financial.create}
                      onChange={() => handlePermissionChange('financial', 'create')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="financial-edit"
                      label="Edit"
                      checked={roleForm.permissions.financial.edit}
                      onChange={() => handlePermissionChange('financial', 'edit')}
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="checkbox"
                      id="financial-delete"
                      label="Delete"
                      checked={roleForm.permissions.financial.delete}
                      onChange={() => handlePermissionChange('financial', 'delete')}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <Card className="mb-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Settings</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={6}>
                    <Form.Check
                      type="checkbox"
                      id="settings-view"
                      label="View Settings"
                      checked={roleForm.permissions.settings.view}
                      onChange={() => handlePermissionChange('settings', 'view')}
                    />
                  </Col>
                  <Col xs={6}>
                    <Form.Check
                      type="checkbox"
                      id="settings-userManagement"
                      label="User Management"
                      checked={roleForm.permissions.settings.userManagement}
                      onChange={() => handlePermissionChange('settings', 'userManagement')}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <div className="text-end mt-4">
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => setShowRoleModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {roleForm.id ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Settings;