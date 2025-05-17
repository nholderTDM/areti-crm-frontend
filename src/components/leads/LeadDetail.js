import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Table, Tabs, Tab, Form } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaCalendarAlt, FaEdit, FaArrowLeft, FaPlus, FaStickyNote, 
  FaClock, FaHistory, FaTasks, FaFileAlt, FaChartLine
} from 'react-icons/fa';
import BackButton from '../common/BackButton';
import PhoneContact from '../common/PhoneContact';
import { getLead, addLeadNote, addLeadTask, updateLeadTask } from '../../services/leadService';
import Spinner from '../common/Spinner';
import ErrorAlert from '../common/ErrorAlert';

const LeadDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', completed: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lead statuses and colors
  const leadStatuses = [
    { value: 'new', label: 'New', color: 'primary' },
    { value: 'contacted', label: 'Contacted', color: 'info' },
    { value: 'qualified', label: 'Qualified', color: 'warning' },
    { value: 'proposal', label: 'Proposal', color: 'secondary' },
    { value: 'negotiation', label: 'Negotiation', color: 'dark' },
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

  // Load lead data
  useEffect(() => {
    const fetchLead = async () => {
      setIsLoading(true);
      try {
        const response = await getLead(id);
        setLead(response.data);
      } catch (err) {
        setError('Failed to load lead: ' + (err.message || err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLead();
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

  // Get status badge
  const getStatusBadge = (statusValue) => {
    const status = leadStatuses.find(s => s.value === statusValue);
    return status ? (
      <Badge bg={status.color} className="text-uppercase">
        {status.label}
      </Badge>
    ) : null;
  };

  // Get source label
  const getSourceLabel = (sourceValue) => {
    const source = leadSources.find(s => s.value === sourceValue);
    return source ? source.label : sourceValue;
  };

  // Add a new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await addLeadNote(id, newNote);
      setLead(response.data);
      setNewNote('');
    } catch (err) {
      setError('Failed to add note: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.dueDate) return;
    
    setIsSubmitting(true);
    try {
      const response = await addLeadTask(id, newTask);
      setLead(response.data);
      setNewTask({ title: '', dueDate: '', completed: false });
    } catch (err) {
      setError('Failed to add task: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId) => {
    const task = lead.tasks.find(t => t._id === taskId);
    if (!task) return;
    
    setIsSubmitting(true);
    try {
      const response = await updateLeadTask(id, taskId, {
        completed: !task.completed
      });
      setLead(response.data);
    } catch (err) {
      setError('Failed to update task: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner message="Loading lead details..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!lead) {
    return <ErrorAlert message="Lead not found" />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button 
            variant="outline-secondary" 
            className="me-3"
            onClick={() => navigate('/leads')}
          >
            <FaArrowLeft /> <span className="d-none d-md-inline ms-1">Back to Leads</span>
          </Button>
          <h1 className="mb-0">
            {lead.firstName} {lead.lastName}
          </h1>
        </div>
        <div>
          <Button 
            variant="outline-primary" 
            className="me-2"
            as={Link}
            to={`/leads/${id}/edit`}
          >
            <FaEdit className="me-1" /> Edit Lead
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate(`/leads/script?lead=${id}`)}
          >
            📞 Start Call Script
          </Button>
        </div>
      </div>
      
      <Row>
        <Col lg={4}>
          {/* Lead Info Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Lead Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <FaUser className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">{lead.firstName} {lead.lastName}</h5>
                    <p className="text-muted mb-0">{lead.company}</p>
                  </div>
                </div>
                
                <div className="mb-1">
                  <strong>Status:</strong> {getStatusBadge(lead.status)}
                </div>
                <div className="mb-1">
                  <strong>Source:</strong> {getSourceLabel(lead.source)}
                </div>
                <div className="mb-1">
                  <strong>Value:</strong> ${lead.value ? lead.value.toLocaleString() : '0'}
                </div>
              </div>
              
              <hr />
              
              <h6 className="mb-3">Contact Information</h6>
              <div className="mb-2">
                <FaEnvelope className="me-2 text-muted" />
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </div>
              <div className="mb-2">
                <FaPhone className="me-2 text-muted" />
                <PhoneContact phoneNumber={lead.phone} buttonVariant="outline-secondary" />
              </div>
              <div className="mb-2">
                <FaBuilding className="me-2 text-muted" />
                {lead.company}
              </div>
              {lead.address && (
                <div className="mb-2">
                  <FaMapMarkerAlt className="me-2 text-muted" />
                  {lead.address}
                </div>
              )}
              
              <hr />
              
              <h6 className="mb-3">Dates</h6>
              <div className="mb-2">
                <strong>Created:</strong> {formatDateTime(lead.createdAt)}
              </div>
              <div className="mb-2">
                <strong>Last Updated:</strong> {formatDateTime(lead.updatedAt)}
              </div>
              <div className="mb-2">
                <strong>Last Contact:</strong> {formatDateTime(lead.lastContact)}
              </div>
              {lead.nextFollowUp && (
                <div className="mb-2">
                  <strong>Next Follow-up:</strong> {formatDateTime(lead.nextFollowUp)}
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
              {lead.documents && lead.documents.length > 0 ? (
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.documents.map(doc => (
                      <tr key={doc._id}>
                        <td>
                          <FaFileAlt className="me-2 text-muted" />
                          <a href={doc.fileURL} target="_blank" rel="noopener noreferrer">
                            {doc.name}
                          </a>
                        </td>
                        <td>{formatDate(doc.uploadedAt)}</td>
                        <td>{doc.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-0">No documents yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Tabs defaultActiveKey="activity" className="mb-4">
                <Tab eventKey="activity" title="Activity">
                  {/* Add Note Form */}
                  <Form onSubmit={handleAddNote} className="mb-4">
                    <Form.Group>
                      <Form.Label>Add a Note</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Add a note about this lead..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="me-2"
                          disabled={isSubmitting}
                        />
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={!newNote.trim() || isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <FaPlus className="me-1" />
                          )}
                          {' '}Add
                        </Button>
                      </div>
                    </Form.Group>
                  </Form>
                  
                  {/* Activity Timeline */}
                  <div className="timeline">
                    {lead.history && lead.history.length > 0 ? (
                      lead.history.map((item) => (
                        <div key={item._id} className="timeline-item mb-3">
                          <div className="d-flex">
                            <div className="timeline-icon me-3">
                              {item.type === 'note' && <FaStickyNote className="text-info" />}
                              {item.type === 'status_change' && <FaChartLine className="text-warning" />}
                              {item.type === 'call' && <FaPhone className="text-success" />}
                              {item.type === 'email' && <FaEnvelope className="text-primary" />}
                              {item.type === 'task' && <FaTasks className="text-secondary" />}
                            </div>
                            <div className="timeline-content flex-grow-1">
                              <div className="d-flex justify-content-between">
                                <strong>
                                  {item.type === 'note' && 'Note'}
                                  {item.type === 'status_change' && 'Status Change'}
                                  {item.type === 'call' && 'Call'}
                                  {item.type === 'email' && 'Email'}
                                  {item.type === 'task' && 'Task'}
                                </strong>
                                <small className="text-muted">{formatDateTime(item.timestamp)}</small>
                              </div>
                              <p className="mb-0">{item.content}</p>
                              <small className="text-muted">By {item.userName || (item.user && item.user.firstName + ' ' + item.user.lastName) || 'System'}</small>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No activity recorded yet.</p>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="tasks" title="Tasks">
                  {/* Add Task Form */}
                  <Form onSubmit={handleAddTask} className="mb-4">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label>Task Title</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter task title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="d-flex align-items-end">
                        <Button 
                          variant="primary" 
                          type="submit"
                          className="w-100 mb-2"
                          disabled={!newTask.title.trim() || !newTask.dueDate || isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <FaPlus className="me-1" />
                          )}
                          {' '}Add
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  
                  {/* Tasks List */}
                  <div className="task-list">
                    <h6 className="mb-3">Open Tasks</h6>
                    {lead.tasks && lead.tasks.filter(task => !task.completed).length > 0 ? (
                      <Table hover>
                        <thead>
                          <tr>
                            <th style={{ width: '5%' }}></th>
                            <th>Task</th>
                            <th style={{ width: '25%' }}>Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lead.tasks
                            .filter(task => !task.completed)
                            .map(task => (
                              <tr key={task._id}>
                                <td>
                                  <Form.Check
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task._id)}
                                    disabled={isSubmitting}
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
                    ) : (
                      <p className="text-muted">No open tasks.</p>
                    )}
                    
                    <h6 className="mb-3 mt-4">Completed Tasks</h6>
                    {lead.tasks && lead.tasks.filter(task => task.completed).length > 0 ? (
                      <Table hover>
                        <thead>
                          <tr>
                            <th style={{ width: '5%' }}></th>
                            <th>Task</th>
                            <th style={{ width: '25%' }}>Completed On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lead.tasks
                            .filter(task => task.completed)
                            .map(task => (
                              <tr key={task._id} className="text-muted">
                                <td>
                                  <Form.Check
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task._id)}
                                    disabled={isSubmitting}
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
                    ) : (
                      <p className="text-muted">No completed tasks.</p>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="notes" title="Notes">
                  {/* Add Note Form */}
                  <Form onSubmit={handleAddNote} className="mb-4">
                    <Form.Group>
                      <Form.Label>Add a Note</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Add a note about this lead..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="me-2"
                          disabled={isSubmitting}
                        />
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={!newNote.trim() || isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <FaPlus className="me-1" />
                          )}
                          {' '}Add
                        </Button>
                      </div>
                    </Form.Group>
                  </Form>
                  
                  {/* Notes List */}
                  <div className="notes-list">
                    {lead.history && lead.history
                      .filter(item => item.type === 'note')
                      .length > 0 ? (
                        lead.history
                          .filter(item => item.type === 'note')
                          .map(note => (
                            <Card key={note._id} className="mb-3">
                              <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                  <strong>{note.userName || (note.user && note.user.firstName + ' ' + note.user.lastName) || 'System'}</strong>
                                  <small className="text-muted">{formatDateTime(note.timestamp)}</small>
                                </div>
                                <p className="mb-0">{note.content}</p>
                              </Card.Body>
                            </Card>
                          ))
                      ) : (
                        <p className="text-muted">No notes yet.</p>
                      )}
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

export default LeadDetail;