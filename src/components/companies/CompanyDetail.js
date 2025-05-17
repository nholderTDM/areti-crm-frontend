import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Table, Tabs, Tab, Form, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaEdit, FaArrowLeft, FaPlus, FaStickyNote, 
  FaGlobe, FaUsers, FaUserFriends, FaFileAlt, 
  FaChartLine, FaIndustry, FaMoneyBillWave, FaLinkedin,
  FaTwitter, FaFacebook, FaTasks, FaExchangeAlt
} from 'react-icons/fa';
import PageTitle from '../common/PageTitle';
import { formatPhoneForDisplay, getCallRedirectUrl } from '../../utils/phoneUtils';
import PhoneContact from '../common/PhoneContact';

const CompanyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [activities, setActivities] = useState([]);

  // Company types
  const companyTypes = [
    { value: 'customer', label: 'Customer', color: 'success' },
    { value: 'prospect', label: 'Prospect', color: 'warning' },
    { value: 'vendor', label: 'Vendor', color: 'primary' },
    { value: 'partner', label: 'Partner', color: 'info' },
    { value: 'competitor', label: 'Competitor', color: 'danger' },
    { value: 'other', label: 'Other', color: 'secondary' }
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

  // Load company data
  useEffect(() => {
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
        facebookUrl: 'facebook.com/abclogistics',
        yearFounded: 2010,
        assignedTo: 'Admin User',
        createdAt: new Date('2023-05-15'),
        updatedAt: new Date('2025-03-20'),
        status: 'active',
        contacts: [
          { id: 1, name: 'John Doe', title: 'Operations Manager', email: 'john.doe@abclogistics.com', phone: '(555) 123-4567', primary: true },
          { id: 2, name: 'Jane Smith', title: 'Logistics Coordinator', email: 'jane.smith@abclogistics.com', phone: '(555) 234-5678', primary: false },
          { id: 3, name: 'Michael Johnson', title: 'CEO', email: 'michael.johnson@abclogistics.com', phone: '(555) 345-6789', primary: false }
        ],
        deals: [
          { id: 1, name: 'Annual Contract Renewal', stage: 'Closed Won', amount: 120000, closeDate: new Date('2025-01-15') },
          { id: 2, name: 'Same-Day Delivery Expansion', stage: 'Proposal', amount: 75000, closeDate: new Date('2025-06-30') }
        ],
        documents: [
          { id: 1, name: 'Service Agreement.pdf', uploadedAt: new Date('2025-01-15'), size: '2.4 MB', type: 'Contract' },
          { id: 2, name: 'Meeting Notes - Q1 Review.docx', uploadedAt: new Date('2025-03-20'), size: '550 KB', type: 'Notes' },
          { id: 3, name: 'ABC Logistics - Requirements.xlsx', uploadedAt: new Date('2024-11-12'), size: '1.2 MB', type: 'Specifications' }
        ],
        tasks: [
          { id: 1, title: 'Schedule quarterly business review', dueDate: new Date('2025-05-15'), completed: false, assignedTo: 'Admin User' },
          { id: 2, title: 'Send same-day delivery proposal', dueDate: new Date('2025-05-05'), completed: true, completedAt: new Date('2025-04-28'), assignedTo: 'Admin User' }
        ]
      };
      
      setCompany(mockCompany);
      
      // Mock activity feed
      const mockActivities = [
        { id: 1, type: 'note', content: 'Added company to CRM', timestamp: new Date('2023-05-15T10:30:00'), user: 'Admin User' },
        { id: 2, type: 'contact_added', content: 'Added John Doe as a contact', timestamp: new Date('2023-05-15T10:45:00'), user: 'Admin User' },
        { id: 3, type: 'deal_created', content: 'Created deal "Annual Contract Renewal"', timestamp: new Date('2023-06-10T14:15:00'), user: 'Admin User' },
        { id: 4, type: 'meeting', content: 'On-site meeting to discuss delivery needs', timestamp: new Date('2023-07-22T11:00:00'), user: 'Admin User' },
        { id: 5, type: 'deal_updated', content: 'Deal "Annual Contract Renewal" moved to Closed Won', timestamp: new Date('2025-01-15T16:30:00'), user: 'Admin User' },
        { id: 6, type: 'document_added', content: 'Uploaded document "Service Agreement.pdf"', timestamp: new Date('2025-01-15T16:45:00'), user: 'Admin User' },
        { id: 7, type: 'note', content: 'Quarterly business review scheduled for next month', timestamp: new Date('2025-03-20T09:15:00'), user: 'Admin User' },
        { id: 8, type: 'deal_created', content: 'Created deal "Same-Day Delivery Expansion"', timestamp: new Date('2025-04-05T13:45:00'), user: 'Admin User' },
        { id: 9, type: 'task_completed', content: 'Completed task "Send same-day delivery proposal"', timestamp: new Date('2025-04-28T15:20:00'), user: 'Admin User' }
      ];
      
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format datetime
  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get type badge
  const getTypeBadge = (typeValue) => {
    const type = companyTypes.find(t => t.value === typeValue);
    return type ? (
      <Badge bg={type.color} className="text-uppercase">
        {type.label}
      </Badge>
    ) : null;
  };
  
  // Get size label
  const getSizeLabel = (sizeValue) => {
    const size = companySizes.find(s => s.value === sizeValue);
    return size ? size.label : sizeValue;
  };
  
  // Get deal stage badge
  const getDealStageBadge = (stage) => {
    switch (stage) {
      case 'Closed Won':
        return <Badge bg="success">Closed Won</Badge>;
      case 'Closed Lost':
        return <Badge bg="danger">Closed Lost</Badge>;
      case 'Proposal':
        return <Badge bg="warning">Proposal</Badge>;
      case 'Negotiation':
        return <Badge bg="info">Negotiation</Badge>;
      case 'Qualified':
        return <Badge bg="primary">Qualified</Badge>;
      default:
        return <Badge bg="secondary">{stage}</Badge>;
    }
  };

  // Add a new note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    // In a real app, this would be an API call
    const newActivity = {
      id: activities.length + 1,
      type: 'note',
      content: newNote,
      timestamp: new Date(),
      user: 'Admin User'
    };
    
    setActivities([newActivity, ...activities]);
    setNewNote('');
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading company details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <PageTitle 
  title={company.name}
  subtitle={`${company.industry} - ${getSizeLabel(company.size)}`}
  backButton={true}
/>

<div className="d-flex justify-content-end mb-4">
  <Button 
    variant="outline-primary" 
    className="me-2"
    as={Link}
    to={`/companies/${id}/edit`}
  >
    <FaEdit className="me-1" /> Edit Company
  </Button>
  <Button 
    variant="primary"
    as={Link}
    to={`/contacts/new?company=${encodeURIComponent(company.name)}`}
  >
    <FaPlus className="me-1" /> Add Contact
  </Button>
</div>
      
      <Row>
        <Col lg={4}>
          {/* Company Info Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Company Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <FaBuilding className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">{company.name}</h5>
                    <div className="text-muted">{company.industry}</div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <strong>Type:</strong> {getTypeBadge(company.type)}
                </div>
                <div className="mb-2">
                  <strong>Size:</strong> {getSizeLabel(company.size)}
                </div>
                <div className="mb-2">
                  <strong>Employees:</strong> {company.employees?.toLocaleString() || 'N/A'}
                </div>
                <div className="mb-2">
                  <strong>Year Founded:</strong> {company.yearFounded || 'N/A'}
                </div>
                <div className="mb-2">
                  <strong>Annual Revenue:</strong> {company.revenue || 'N/A'}
                </div>
              </div>
              
              <hr />
              
              <h6 className="mb-3">Contact Information</h6>
              {company.website && (
                <div className="mb-2">
                  <FaGlobe className="me-2 text-muted" />
                  <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                    {company.website}
                  </a>
                </div>
              )}
              {company.email && (
                <div className="mb-2">
                  <FaEnvelope className="me-2 text-muted" />
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </div>
              )}
              {company.phone && (
                // Find where the phone number is displayed and replace with:
<div className="mb-2">
  <FaPhone className="me-2 text-muted" />
  <PhoneContact phoneNumber={company.phone} />
</div>
              )}
              
              <hr />
              
              <h6 className="mb-3">Address</h6>
              <address className="mb-0">
                <FaMapMarkerAlt className="me-2 text-muted" />
                {company.address}<br />
                {company.city}, {company.state} {company.zip}<br />
                {company.country}
              </address>
              
              {(company.linkedinUrl || company.twitterUrl || company.facebookUrl) && (
                <>
                  <hr />
                  <h6 className="mb-3">Social Media</h6>
                  {company.linkedinUrl && (
                    <div className="mb-2">
                      <FaLinkedin className="me-2 text-muted" />
                      <a href={`https://${company.linkedinUrl}`} target="_blank" rel="noopener noreferrer">
                        {company.linkedinUrl}
                      </a>
                    </div>
                  )}
                  {company.twitterUrl && (
                    <div className="mb-2">
                      <FaTwitter className="me-2 text-muted" />
                      <a href={`https://${company.twitterUrl}`} target="_blank" rel="noopener noreferrer">
                        {company.twitterUrl}
                      </a>
                    </div>
                  )}
                  {company.facebookUrl && (
                    <div className="mb-2">
                      <FaFacebook className="me-2 text-muted" />
                      <a href={`https://${company.facebookUrl}`} target="_blank" rel="noopener noreferrer">
                        {company.facebookUrl}
                      </a>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
          
          {/* Key Details Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Key Details</h5>
            </Card.Header>
            <Card.Body>
              {company.description && (
                <>
                 <strong> Description:</strong>
                  <p>{company.description}</p>
                </>
              )}
              
              {company.notes && (
                <>
                  <strong>Internal Notes:</strong>
                  <p>{company.notes}</p>
                </>
              )}
              
              <div className="mt-3">
                <div className="mb-2">
                  <strong>Created:</strong> {formatDate(company.createdAt)}
                </div>
                <div className="mb-2">
                  <strong>Last Updated:</strong> {formatDate(company.updatedAt)}
                </div>
                {company.assignedTo && (
                  <div className="mb-2">
                    <strong>Account Owner:</strong> {company.assignedTo}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
          
          {/* Open Tasks Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Open Tasks</h5>
              <Button variant="outline-primary" size="sm" as={Link} to={`/tasks?company=${encodeURIComponent(company.name)}`}>
                <FaPlus className="me-1" /> Add Task
              </Button>
            </Card.Header>
            <Card.Body>
              {company.tasks.filter(task => !task.completed).length === 0 ? (
                <p className="text-muted mb-0">No open tasks.</p>
              ) : (
                <ListGroup variant="flush">
                  {company.tasks
                    .filter(task => !task.completed)
                    .map(task => (
                      <ListGroup.Item key={task.id} className="px-0 py-2 border-bottom">
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="mb-1">{task.title}</div>
                            <small className={`text-muted ${new Date(task.dueDate) < new Date() ? 'text-danger' : ''}`}>
                              Due: {formatDate(task.dueDate)}
                            </small>
                          </div>
                          <div>
                            <Form.Check
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => {
                                // In a real app, this would be an API call
                                const updatedTasks = company.tasks.map(t => 
                                  t.id === task.id ? {...t, completed: !t.completed, completedAt: new Date()} : t
                                );
                                setCompany({...company, tasks: updatedTasks});
                                
                                // Add to activity feed
                                const newActivity = {
                                  id: activities.length + 1,
                                  type: 'task_completed',
                                  content: `Completed task "${task.title}"`,
                                  timestamp: new Date(),
                                  user: 'Admin User'
                                };
                                setActivities([newActivity, ...activities]);
                              }}
                            />
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              )}
              
              {company.tasks.filter(task => task.completed).length > 0 && (
                <>
                  <div className="mt-4 mb-2">
                    <h6>Completed Tasks</h6>
                  </div>
                  <ListGroup variant="flush">
                    {company.tasks
                      .filter(task => task.completed)
                      .map(task => (
                        <ListGroup.Item key={task.id} className="px-0 py-2 border-bottom text-muted">
                          <div className="d-flex justify-content-between">
                            <div>
                              <div className="mb-1"><s>{task.title}</s></div>
                              <small>
                                Completed: {formatDate(task.completedAt)}
                              </small>
                            </div>
                            <div>
                              <Form.Check
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => {
                                  // In a real app, this would be an API call
                                  const updatedTasks = company.tasks.map(t => 
                                    t.id === task.id ? {...t, completed: !t.completed, completedAt: null} : t
                                  );
                                  setCompany({...company, tasks: updatedTasks});
                                }}
                              />
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </>
              )}
              
              {company.tasks.length > 0 && (
                <div className="mt-3 text-end">
                  <Button 
                    as={Link}
                    to={`/tasks?company=${encodeURIComponent(company.name)}`}
                    variant="link"
                    size="sm"
                    className="p-0"
                  >
                    View All Tasks
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {/* Documents Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Documents</h5>
              <Button variant="outline-primary" size="sm">
                <FaPlus className="me-1" /> Upload
              </Button>
            </Card.Header>
            <Card.Body>
              {company.documents.length === 0 ? (
                <p className="text-muted mb-0">No documents yet.</p>
              ) : (
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.documents.map(doc => (
                      <tr key={doc.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaFileAlt className="me-2 text-muted" />
                            <a href="#">{doc.name}</a>
                          </div>
                        </td>
                        <td>{formatDate(doc.uploadedAt)}</td>
                        <td>{doc.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Tabs defaultActiveKey="overview" className="mb-4">
                <Tab eventKey="overview" title="Overview">
                  {/* Contacts Section */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Contacts</h5>
                      <Button 
                        variant="outline-primary"
                        size="sm"
                        as={Link}
                        to={`/contacts/new?company=${encodeURIComponent(company.name)}`}
                      >
                        <FaPlus className="me-1" /> Add Contact
                      </Button>
                    </div>
                    
                    {company.contacts.length === 0 ? (
                      <Alert variant="light">No contacts added yet.</Alert>
                    ) : (
                      <Table hover responsive>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Title</th>
                            <th>Contact Info</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {company.contacts.map(contact => (
                            <tr key={contact.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <Link to={`/contacts/${contact.id}`} className="fw-bold text-decoration-none">
                                      {contact.name}
                                    </Link>
                                    {contact.primary && (
                                      <Badge bg="info" className="ms-2">Primary</Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>{contact.title}</td>
                              <td>
                                <div className="d-flex flex-column">
                                  <div className="mb-1">
                                    <FaEnvelope className="me-1 text-muted" />
                                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                  </div>
                                  <div>
                                    <FaPhone className="me-1 text-muted" />
                                    <a href={getCallRedirectUrl(contact.phone)}>
  {formatPhoneForDisplay(contact.phone)}
</a>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <Button as={Link} to={`/contacts/${contact.id}`} variant="outline-primary" size="sm">
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                    
                    {company.contacts.length > 0 && (
                      <div className="text-end">
                        <Button
                          as={Link}
                          to={`/contacts?company=${encodeURIComponent(company.name)}`}
                          variant="link"
                          size="sm"
                          className="p-0"
                        >
                          View All Contacts
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Deals Section */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Deals</h5>
                      <Button 
                        variant="outline-primary"
                        size="sm"
                      >
                        <FaPlus className="me-1" /> Add Deal
                      </Button>
                    </div>
                    
                    {company.deals.length === 0 ? (
                      <Alert variant="light">No deals added yet.</Alert>
                    ) : (
                      <Table hover responsive>
                        <thead>
                          <tr>
                            <th>Deal Name</th>
                            <th>Stage</th>
                            <th>Amount</th>
                            <th>Close Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {company.deals.map(deal => (
                            <tr key={deal.id}>
                              <td>
                                <Link to={`/deals/${deal.id}`} className="text-decoration-none">
                                  {deal.name}
                                </Link>
                              </td>
                              <td>{getDealStageBadge(deal.stage)}</td>
                              <td>${deal.amount?.toLocaleString()}</td>
                              <td>{formatDate(deal.closeDate)}</td>
                              <td>
                                <Button variant="outline-primary" size="sm">
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                  
                  {/* Recent Activity Section */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Recent Activity</h5>
                    </div>
                    
                    <div className="timeline">
                      {activities.slice(0, 5).map((activity, index) => (
                        <div key={activity.id} className="timeline-item mb-3">
                          <div className="d-flex">
                            <div className="timeline-icon me-3">
                              {activity.type === 'note' && <FaStickyNote className="text-info" />}
                              {activity.type === 'contact_added' && <FaUserFriends className="text-success" />}
                              {activity.type === 'deal_created' && <FaMoneyBillWave className="text-warning" />}
                              {activity.type === 'deal_updated' && <FaExchangeAlt className="text-primary" />}
                              {activity.type === 'meeting' && <FaUsers className="text-secondary" />}
                              {activity.type === 'document_added' && <FaFileAlt className="text-danger" />}
                              {activity.type === 'task_completed' && <FaTasks className="text-success" />}
                            </div>
                            <div className="timeline-content flex-grow-1">
                              <div className="d-flex justify-content-between">
                                <strong>{activity.content}</strong>
                                <small className="text-muted">{formatDateTime(activity.timestamp)}</small>
                              </div>
                              <small className="text-muted">By {activity.user}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {activities.length > 5 && (
                      <div className="text-end mt-3">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0"
                          onClick={() => {
                            document.querySelector('button[data-bs-target="#activity"]').click();
                          }}
                        >
                          View All Activity
                        </Button>
                      </div>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="contacts" title="Contacts">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Company Contacts</h5>
                    <Button 
                      variant="outline-primary"
                      size="sm"
                      as={Link}
                      to={`/contacts/new?company=${encodeURIComponent(company.name)}`}
                    >
                      <FaPlus className="me-1" /> Add Contact
                    </Button>
                  </div>
                  
                  {company.contacts.length === 0 ? (
                    <Alert variant="light">
                      No contacts added yet. Add contacts to keep track of your relationships at this company.
                    </Alert>
                  ) : (
                    <Row>
                      {company.contacts.map(contact => (
                        <Col key={contact.id} lg={6} className="mb-3">
                          <Card>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h5 className="mb-1">
                                    <Link to={`/contacts/${contact.id}`} className="text-decoration-none">
                                      {contact.name}
                                    </Link>
                                  </h5>
                                  <div className="text-muted">{contact.title}</div>
                                </div>
                                {contact.primary && (
                                  <Badge bg="info">Primary Contact</Badge>
                                )}
                              </div>
                              
                              <div className="mb-2">
                                <FaEnvelope className="me-2 text-muted" />
                                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                              </div>
                              <div className="mb-3">
                                <FaPhone className="me-2 text-muted" />
                                <a href={getCallRedirectUrl(contact.phone)}>
  {formatPhoneForDisplay(contact.phone)}
</a>
                              </div>
                              
                              <div className="d-flex justify-content-end">
                                <Button as={Link} to={`/contacts/${contact.id}`} variant="outline-primary" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Tab>
                
                <Tab eventKey="activity" title="Activity">
                  <Form onSubmit={handleAddNote} className="mb-4">
                    <Form.Group>
                      <Form.Label>Add a Note</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Add a note about this company..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mb-2"
                      />
                      <div className="text-end">
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={!newNote.trim()}
                        >
                          <FaPlus className="me-1" /> Add Note
                        </Button>
                      </div>
                    </Form.Group>
                  </Form>
                  
                  <hr />
                  
                  <h5 className="mb-3">Activity History</h5>
                  <div className="timeline">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="timeline-item mb-4">
                        <div className="d-flex">
                          <div className="timeline-icon me-3">
                            {activity.type === 'note' && <FaStickyNote className="text-info" />}
                            {activity.type === 'contact_added' && <FaUserFriends className="text-success" />}
                            {activity.type === 'deal_created' && <FaMoneyBillWave className="text-warning" />}
                            {activity.type === 'deal_updated' && <FaExchangeAlt className="text-primary" />}
                            {activity.type === 'meeting' && <FaUsers className="text-secondary" />}
                            {activity.type === 'document_added' && <FaFileAlt className="text-danger" />}
                            {activity.type === 'task_completed' && <FaTasks className="text-success" />}
                          </div>
                          <div className="timeline-content flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <strong>{activity.content}</strong>
                              <small className="text-muted">{formatDateTime(activity.timestamp)}</small>
                            </div>
                            <small className="text-muted">By {activity.user}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab>
                
                <Tab eventKey="deals" title="Deals">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Deals</h5>
                    <Button 
                      variant="outline-primary"
                      size="sm"
                    >
                      <FaPlus className="me-1" /> Add Deal
                    </Button>
                  </div>
                  
                  {company.deals.length === 0 ? (
                    <Alert variant="light">
                      No deals added yet. Add deals to track sales opportunities with this company.
                    </Alert>
                  ) : (
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Deal Name</th>
                          <th>Stage</th>
                          <th>Amount</th>
                          <th>Close Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.deals.map(deal => (
                          <tr key={deal.id}>
                            <td>
                              <Link to={`/deals/${deal.id}`} className="text-decoration-none">
                                {deal.name}
                              </Link>
                            </td>
                            <td>{getDealStageBadge(deal.stage)}</td>
                            <td>${deal.amount?.toLocaleString()}</td>
                            <td>{formatDate(deal.closeDate)}</td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                  
                  <div className="mt-4">
                    <h5 className="mb-3">Deal Summary</h5>
                    
                    <Row>
                      <Col md={4}>
                        <Card className="border bg-light h-100">
                          <Card.Body className="p-3">
                            <div className="text-muted mb-1">Total Deal Value</div>
                            <h3 className="mb-0">
                              ${company.deals.reduce((total, deal) => total + (deal.amount || 0), 0).toLocaleString()}
                            </h3>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="border bg-light h-100">
                          <Card.Body className="p-3">
                            <div className="text-muted mb-1">Open Deals</div>
                            <h3 className="mb-0">
                              {company.deals.filter(deal => deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost').length}
                            </h3>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="border bg-light h-100">
                          <Card.Body className="p-3">
                            <div className="text-muted mb-1">Win Rate</div>
                            <h3 className="mb-0">
                              {company.deals.length === 0 ? '0%' : 
                                ((company.deals.filter(deal => deal.stage === 'Closed Won').length / 
                                  company.deals.filter(deal => deal.stage === 'Closed Won' || deal.stage === 'Closed Lost').length) * 100).toFixed(0) + '%'}
                            </h3>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="documents" title="Documents">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Documents</h5>
                    <Button variant="outline-primary" size="sm">
                      <FaPlus className="me-1" /> Upload Document
                    </Button>
                  </div>
                  
                  {company.documents.length === 0 ? (
                    <Alert variant="light">
                      No documents uploaded yet. Upload documents to keep track of contracts, proposals, and other files.
                    </Alert>
                  ) : (
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Size</th>
                          <th>Uploaded</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.documents.map(doc => (
                          <tr key={doc.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaFileAlt className="me-2 text-muted" />
                                <a href="#">{doc.name}</a>
                              </div>
                            </td>
                            <td>{doc.type}</td>
                            <td>{doc.size}</td>
                            <td>{formatDate(doc.uploadedAt)}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1">
                                View
                              </Button>
                              <Button variant="outline-secondary" size="sm">
                                Download
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyDetail;