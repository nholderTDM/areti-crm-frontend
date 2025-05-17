import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Table, Tabs, Tab, Form, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaMobileAlt, FaEdit, FaArrowLeft, FaPlus, FaStickyNote, 
  FaClock, FaHistory, FaTasks, FaFileAlt, FaMailBulk,
  FaCalendarAlt, FaTag, FaIdCard, FaPhoneVolume, FaMobile
} from 'react-icons/fa';
import PageTitle from '../common/PageTitle';
import { formatPhoneForDisplay, getCallRedirectUrl } from '../../utils/phoneUtils';
import PhoneContact from '../common/PhoneContact';


const ContactDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', completed: false });
  const [newInteraction, setNewInteraction] = useState({ type: 'note', content: '' });

  // Contact types
  const contactTypes = [
    { value: 'customer', label: 'Customer', color: 'success' },
    { value: 'vendor', label: 'Vendor', color: 'primary' },
    { value: 'partner', label: 'Partner', color: 'info' },
    { value: 'employee', label: 'Employee', color: 'secondary' },
    { value: 'prospect', label: 'Prospect', color: 'warning' },
    { value: 'other', label: 'Other', color: 'light' }
  ];

  // Interaction types
  const interactionTypes = [
    { value: 'note', label: 'Note', icon: FaStickyNote },
    { value: 'call', label: 'Call', icon: FaPhoneVolume },
    { value: 'email', label: 'Email', icon: FaEnvelope },
    { value: 'meeting', label: 'Meeting', icon: FaCalendarAlt }
  ];

  // Load contact data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock data for the contact
      const mockContact = {
        id: parseInt(id),
        firstName: 'John',
        lastName: 'Doe',
        company: 'ABC Logistics',
        email: 'john.doe@abclogistics.com',
        phone: '(555) 123-4567',
        mobile: '(555) 987-6543',
        type: 'customer',
        title: 'Operations Manager',
        address: '123 Main St',
        city: 'Atlanta',
        state: 'GA',
        zip: '30303',
        country: 'USA',
        tags: ['vip', 'key-decision-maker'],
        assignedTo: 'Admin User',
        createdAt: new Date('2025-01-15T14:30:00'),
        updatedAt: new Date('2025-04-20T09:15:00'),
        lastContact: new Date('2025-04-20T09:15:00'),
        notes: 'Key decision maker for delivery services.',
        interactions: [
          { id: 1, type: 'note', content: 'Initial contact made via website form', timestamp: new Date('2025-01-15T14:30:00'), user: 'Admin User' },
          { id: 2, type: 'call', content: 'Discussed their delivery needs. They currently have about 30 packages per day that need delivery.', timestamp: new Date('2025-02-10T11:15:00'), user: 'Admin User' },
          { id: 3, type: 'email', content: 'Sent information package and pricing details', timestamp: new Date('2025-02-12T14:45:00'), user: 'Admin User' },
          { id: 4, type: 'meeting', content: 'In-person meeting at their office. Toured their warehouse and discussed specific requirements.', timestamp: new Date('2025-03-05T10:00:00'), user: 'Admin User' },
          { id: 5, type: 'call', content: 'Follow-up call to address additional questions about our service area.', timestamp: new Date('2025-03-20T15:30:00'), user: 'Admin User' },
          { id: 6, type: 'email', content: 'Sent contract proposal for review', timestamp: new Date('2025-04-05T09:00:00'), user: 'Admin User' },
          { id: 7, type: 'call', content: 'Discussed contract terms and agreed on next steps', timestamp: new Date('2025-04-20T09:15:00'), user: 'Admin User' }
        ],
        tasks: [
          { id: 1, title: 'Follow up on contract proposal', dueDate: new Date('2025-05-01T12:00:00'), completed: true, completedAt: new Date('2025-04-20T09:15:00') },
          { id: 2, title: 'Schedule site visit to assess logistics', dueDate: new Date('2025-05-15T09:00:00'), completed: false },
          { id: 3, title: 'Prepare implementation timeline', dueDate: new Date('2025-05-20T17:00:00'), completed: false }
        ],
        documents: [
          { id: 1, name: 'Requirements Document.pdf', uploadedAt: new Date('2025-02-15T16:30:00'), size: '1.2 MB' },
          { id: 2, title: 'Service Proposal.pdf', uploadedAt: new Date('2025-04-05T09:00:00'), size: '2.5 MB' },
          { id: 3, title: 'Draft Contract.docx', uploadedAt: new Date('2025-04-10T14:15:00'), size: '780 KB' }
        ],
        relatedContacts: [
          { id: 101, name: 'Sarah Williams', title: 'Logistics Coordinator', company: 'ABC Logistics', email: 'sarah.williams@abclogistics.com', phone: '(555) 234-5678' },
          { id: 102, name: 'Michael Garcia', title: 'Warehouse Manager', company: 'ABC Logistics', email: 'michael.garcia@abclogistics.com', phone: '(555) 345-6789' }
        ]
      };
      
      setContact(mockContact);
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
    const type = contactTypes.find(t => t.value === typeValue);
    return type ? (
      <Badge bg={type.color} className="text-uppercase">
        {type.label}
      </Badge>
    ) : null;
  };

  // Add a new note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    // In a real app, this would be an API call
    const newNoteObj = {
      id: contact.interactions.length + 1,
      type: 'note',
      content: newNote,
      timestamp: new Date(),
      user: 'Admin User'
    };
    
    setContact({
      ...contact,
      interactions: [newNoteObj, ...contact.interactions],
      lastContact: new Date()
    });
    
    setNewNote('');
  };

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.dueDate) return;
    
    // In a real app, this would be an API call
    const newTaskObj = {
      id: contact.tasks.length + 1,
      title: newTask.title,
      dueDate: new Date(newTask.dueDate),
      completed: false
    };
    
    setContact({
      ...contact,
      tasks: [...contact.tasks, newTaskObj]
    });
    
    setNewTask({ title: '', dueDate: '', completed: false });
  };

  // Add a new interaction
  const handleAddInteraction = (e) => {
    e.preventDefault();
    if (!newInteraction.content.trim()) return;
    
    // In a real app, this would be an API call
    const newInteractionObj = {
      id: contact.interactions.length + 1,
      type: newInteraction.type,
      content: newInteraction.content,
      timestamp: new Date(),
      user: 'Admin User'
    };
    
    setContact({
      ...contact,
      interactions: [newInteractionObj, ...contact.interactions],
      lastContact: new Date()
    });
    
    setNewInteraction({ type: 'note', content: '' });
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    // In a real app, this would be an API call
    const updatedTasks = contact.tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : null
        };
      }
      return task;
    });
    
    setContact({
      ...contact,
      tasks: updatedTasks
    });
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading contact details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <PageTitle 
  title={`${contact.firstName} ${contact.lastName}`}
  backButton={true}
/>

<div className="d-flex justify-content-end mb-4">
  <Button 
    variant="outline-primary" 
    className="me-2"
    as={Link}
    to={`/contacts/${id}/edit`}
  >
    <FaEdit className="me-1" /> Edit Contact
  </Button>
  <Button 
    variant="primary"
    onClick={() => {
      // This would typically open a modal or navigate to a form
      alert('This would record a new interaction with the contact.');
    }}
  >
    <FaPhoneVolume className="me-1" /> Log Interaction
  </Button>
</div>
      
      <Row>
        <Col lg={4}>
          {/* Contact Info Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Contact Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <FaUser className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">{contact.firstName} {contact.lastName}</h5>
                    <p className="text-muted mb-0">{contact.title}</p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <FaBuilding className="me-2 text-muted" />
                  <Link to={`/companies?name=${encodeURIComponent(contact.company)}`} className="text-decoration-none">
                    {contact.company}
                  </Link>
                </div>
                
                <div className="mb-1">
                  <strong>Type:</strong> {getTypeBadge(contact.type)}
                </div>
                
                <div className="mb-3 mt-3">
                  {contact.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      bg="light" 
                      text="dark" 
                      className="me-1 mb-1"
                    >
                      {tag.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <hr />
              
              <h6 className="mb-3">Contact Details</h6>
              <div className="mb-2">
                <FaEnvelope className="me-2 text-muted" />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
              <div className="mb-2">
  <FaPhone className="me-2 text-muted" />
  <PhoneContact phoneNumber={contact.phone} />
</div>
              {contact.mobile && (
                <div className="mb-2">
                <FaMobile className="me-2 text-muted" />
                <PhoneContact phoneNumber={contact.mobilePhone} />
              </div>
              )}
              
              <hr />
              
              <h6 className="mb-3">Address</h6>
              <address className="mb-0">
                <FaMapMarkerAlt className="me-2 text-muted" />
                {contact.address}<br />
                {contact.city}, {contact.state} {contact.zip}<br />
                {contact.country}
              </address>
              
              <hr />
              
              <h6 className="mb-3">Timeline</h6>
              <div className="mb-2">
                <strong>Added:</strong> {formatDateTime(contact.createdAt)}
              </div>
              <div className="mb-2">
                <strong>Last Updated:</strong> {formatDateTime(contact.updatedAt)}
              </div>
              <div className="mb-2">
                <strong>Last Contact:</strong> {formatDateTime(contact.lastContact)}
              </div>
            </Card.Body>
          </Card>
          
          {/* Related Contacts Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Related Contacts</h5>
              <Button variant="outline-primary" size="sm">
                <FaPlus className="me-1" /> Add
              </Button>
            </Card.Header>
            <Card.Body>
              {contact.relatedContacts.length === 0 ? (
                <p className="text-muted mb-0">No related contacts.</p>
              ) : (
                <div>
                  {contact.relatedContacts.map(relContact => (
                    <div key={relContact.id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <FaIdCard className="text-muted me-2" size={20} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0">
                            <Link to={`/contacts/${relContact.id}`} className="text-decoration-none">
                              {relContact.name}
                            </Link>
                          </h6>
                          <p className="text-muted mb-1">{relContact.title}</p>
                          <div className="small">
                            <div className="mb-1">
                              <FaEnvelope className="me-1 text-muted" />
                              <a href={`mailto:${relContact.email}`}>{relContact.email}</a>
                            </div>
                            <div>
                              <FaPhone className="me-1 text-muted" />
                              <a href={getCallRedirectUrl(contact.phone)}>
  {formatPhoneForDisplay(contact.phone)}
</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
              {contact.documents.length === 0 ? (
                <p className="text-muted mb-0">No documents yet.</p>
              ) : (
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contact.documents.map(doc => (
                      <tr key={doc.id}>
                        <td>
                          <FaFileAlt className="me-2 text-muted" />
                          <a href="#">{doc.name || doc.title}</a>
                        </td>
                        <td>{formatDate(doc.uploadedAt)}</td>
                        <td>{doc.size}</td>
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
              <Tabs defaultActiveKey="interactions" className="mb-4">
                <Tab eventKey="interactions" title="Interactions">
                  {/* Add Interaction Form */}
                  <Form onSubmit={handleAddInteraction} className="mb-4">
                    <h5 className="mb-3">Log an Interaction</h5>
                    <Row>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label>Type</Form.Label>
                          <Form.Select
                            value={newInteraction.type}
                            onChange={(e) => setNewInteraction({...newInteraction, type: e.target.value})}
                          >
                            {interactionTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={10}>
                        <Form.Group className="mb-3">
                          <Form.Label>Details</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Add details about this interaction..."
                            value={newInteraction.content}
                            onChange={(e) => setNewInteraction({...newInteraction, content: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={!newInteraction.content.trim()}
                      >
                        <FaPlus className="me-1" /> Log Interaction
                      </Button>
                    </div>
                  </Form>
                  
                  <hr />
                  
                  {/* Interactions Timeline */}
                  <h5 className="mb-3">Interaction History</h5>
                  <div className="timeline">
                    {contact.interactions.map((interaction, index) => {
                      const InteractionIcon = interactionTypes.find(type => type.value === interaction.type)?.icon || FaStickyNote;
                      
                      return (
                        <div key={interaction.id} className="timeline-item mb-4">
                          <div className="d-flex">
                            <div className="timeline-icon me-3">
                              <InteractionIcon className={
                                interaction.type === 'note' ? 'text-info' :
                                interaction.type === 'call' ? 'text-success' :
                                interaction.type === 'email' ? 'text-primary' : 
                                'text-warning'
                              } />
                            </div>
                            <div className="timeline-content flex-grow-1">
                            <div className="d-flex justify-content-between">
                                <strong>
                                  {interaction.type === 'note' && 'Note'}
                                  {interaction.type === 'call' && 'Phone Call'}
                                  {interaction.type === 'email' && 'Email'}
                                  {interaction.type === 'meeting' && 'Meeting'}
                                </strong>
                                <small className="text-muted">{formatDateTime(interaction.timestamp)}</small>
                              </div>
                              <p className="mb-0">{interaction.content}</p>
                              <small className="text-muted">By {interaction.user}</small>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Tab>
                
                <Tab eventKey="tasks" title="Tasks">
                  {/* Add Task Form */}
                  <Form onSubmit={handleAddTask} className="mb-4">
                    <h5 className="mb-3">Add a Task</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label>Task Title</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter task title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Due Date</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="d-flex align-items-end">
                        <Button 
                          variant="primary" 
                          type="submit"
                          className="w-100 mb-2"
                          disabled={!newTask.title.trim() || !newTask.dueDate}
                        >
                          <FaPlus className="me-1" /> Add
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  
                  <hr />
                  
                  {/* Tasks List */}
                  <h5 className="mb-3">Open Tasks</h5>
                  <div className="task-list">
                    {contact.tasks.filter(task => !task.completed).length === 0 ? (
                      <Alert variant="light">No open tasks.</Alert>
                    ) : (
                      <Table hover>
                        <thead>
                          <tr>
                            <th style={{ width: '5%' }}></th>
                            <th>Task</th>
                            <th style={{ width: '25%' }}>Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contact.tasks
                            .filter(task => !task.completed)
                            .map(task => (
                              <tr key={task.id}>
                                <td>
                                  <Form.Check
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                  />
                                </td>
                                <td>{task.title}</td>
                                <td>
                                  <div className={`d-flex align-items-center ${new Date(task.dueDate) < new Date() ? 'text-danger' : ''}`}>
                                    <FaCalendarAlt className="me-2" />
                                    {formatDateTime(task.dueDate)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    )}
                    
                    <h5 className="mb-3 mt-4">Completed Tasks</h5>
                    {contact.tasks.filter(task => task.completed).length === 0 ? (
                      <Alert variant="light">No completed tasks.</Alert>
                    ) : (
                      <Table hover>
                        <thead>
                          <tr>
                            <th style={{ width: '5%' }}></th>
                            <th>Task</th>
                            <th style={{ width: '25%' }}>Completed On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contact.tasks
                            .filter(task => task.completed)
                            .map(task => (
                              <tr key={task.id} className="text-muted">
                                <td>
                                  <Form.Check
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                  />
                                </td>
                                <td><s>{task.title}</s></td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <FaClock className="me-2" />
                                    {formatDateTime(task.completedAt)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="notes" title="Notes">
                  {/* Add Note Form */}
                  <Form onSubmit={handleAddNote} className="mb-4">
                    <h5 className="mb-3">Add a Note</h5>
                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Add a note about this contact..."
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
                  
                  {/* Notes List */}
                  <h5 className="mb-3">Notes History</h5>
                  <div className="notes-list">
                    {contact.interactions
                      .filter(item => item.type === 'note')
                      .length === 0 ? (
                        <Alert variant="light">No notes available.</Alert>
                      ) : (
                        contact.interactions
                          .filter(item => item.type === 'note')
                          .map(note => (
                            <Card key={note.id} className="mb-3">
                              <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                  <strong>{note.user}</strong>
                                  <small className="text-muted">{formatDateTime(note.timestamp)}</small>
                                </div>
                                <p className="mb-0">{note.content}</p>
                              </Card.Body>
                            </Card>
                          ))
                      )}
                  </div>
                </Tab>
                
                <Tab eventKey="emails" title="Emails">
                  <div className="text-center py-5">
                    <FaMailBulk size={48} className="text-muted mb-3" />
                    <h5>Email Integration</h5>
                    <p className="text-muted">
                      Connect your email account to track communication with this contact.
                    </p>
                    <Button variant="outline-primary">
                      Connect Email
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactDetail;