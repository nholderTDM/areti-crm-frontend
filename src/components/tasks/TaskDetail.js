import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Row, Col, Form, ListGroup, Dropdown, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaRegCircle, FaPencilAlt, FaTrash, FaCalendarAlt, 
         FaUserAlt, FaBuilding, FaExclamationTriangle, FaPlus, FaRedo,
         FaCommentAlt, FaCheckSquare, FaPaperclip, FaClock, FaTasks, FaSave } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const TaskDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [originalTask, setOriginalTask] = useState(null); // Store original task for comparison
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activities, setActivities] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [originalSubTasks, setOriginalSubTasks] = useState([]); // Store original subtasks for comparison
  const [newSubTask, setNewSubTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [hasChanges, setHasChanges] = useState(false); // Track whether there are unsaved changes
  const [isSaving, setIsSaving] = useState(false); // Track saving state
  const [saveSuccess, setSaveSuccess] = useState(false); // Track save success

  // Task statuses with their corresponding colors
  const taskStatuses = [
    { value: 'not_started', label: 'Not Started', color: 'secondary' },
    { value: 'in_progress', label: 'In Progress', color: 'primary' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' }
  ];

  // Task priorities with their corresponding colors
  const taskPriorities = [
    { value: 'low', label: 'Low', color: 'info' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'danger' },
    { value: 'urgent', label: 'Urgent', color: 'dark' }
  ];

  // Load task data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call to get task details
    setTimeout(() => {
      const mockTask = generateMockTask(parseInt(id));
      setTask(mockTask);
      setOriginalTask(JSON.parse(JSON.stringify(mockTask))); // Deep copy for comparison
      
      // Generate mock comments
      const mockComments = generateMockComments(parseInt(id));
      setComments(mockComments);
      
      // Generate mock activities
      const mockActivities = generateMockActivities(parseInt(id));
      setActivities(mockActivities);
      
      // Generate mock subtasks
      const mockSubTasks = generateMockSubTasks(parseInt(id));
      setSubTasks(mockSubTasks);
      setOriginalSubTasks(JSON.parse(JSON.stringify(mockSubTasks))); // Deep copy for comparison
      
      // Generate mock related tasks
      const mockRelatedTasks = generateMockRelatedTasks(parseInt(id));
      setRelatedTasks(mockRelatedTasks);
      
      setIsLoading(false);
      setHasChanges(false); // Initialize with no changes
    }, 1000);
  }, [id]);

  // Check for changes when task or subtasks are updated
  useEffect(() => {
    if (task && originalTask) {
      // Compare task and subtasks to detect changes
      const taskChanged = JSON.stringify(task) !== JSON.stringify(originalTask);
      const subTasksChanged = JSON.stringify(subTasks) !== JSON.stringify(originalSubTasks);
      
      setHasChanges(taskChanged || subTasksChanged);
    }
  }, [task, subTasks, originalTask, originalSubTasks]);

  // Generate mock task data
  const generateMockTask = (taskId) => {
    const taskType = ['Call', 'Email', 'Meeting', 'Follow-up', 'Proposal', 'Delivery', 'Payment'][taskId % 7];
    const company = {
      id: (taskId % 5) + 1,
      name: ['ABC Logistics', 'XYZ Retail', 'Tech Solutions Inc.', 'Global Shipping Co.', 'Metro Electronics'][taskId % 5]
    };
    
    const contact = {
      id: (taskId % 5) + 1,
      name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emma Williams', 'Michael Brown'][taskId % 5],
      company: company.name
    };
    
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + (taskId % 14) - 7); // Due date between -7 and +7 days from today
    
    const createdDate = new Date(dueDate);
    createdDate.setDate(createdDate.getDate() - 3); // Created 3 days before due date
    
    // Statuses are different based on due date
    let status;
    if (dueDate < today) {
      // Past due date
      status = taskId % 2 === 0 ? 'completed' : 'not_started';
    } else {
      // Future due date
      status = ['not_started', 'in_progress', 'pending', 'in_progress'][taskId % 4];
    }
    
    // Set completed date if status is completed
    const completedDate = status === 'completed' ? new Date(dueDate.getTime() - Math.random() * 86400000) : null;
    
    return {
      id: taskId,
      title: `${taskType} with ${company.name}`,
      description: `${taskType} regarding our services with ${company.name}. Discuss the current service plan and potential upgrades. ${contact ? `Primary contact is ${contact.name}.` : ''}`,
      type: taskType.toLowerCase(),
      status: status,
      priority: ['low', 'medium', 'high', 'urgent'][taskId % 4],
      assignee: (taskId % 5) + 1,
      assigneeName: ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson'][taskId % 5],
      dueDate: dueDate,
      createdDate: createdDate,
      completedDate: completedDate,
      company: company,
      contact: contact,
      notes: `This ${taskType.toLowerCase()} was scheduled to discuss their current service requirements and explore options for expanding our partnership. We should prepare a proposal for potential service upgrades.`,
      attachments: taskId % 3 === 0 ? [
        { id: 1, name: 'Meeting_Agenda.pdf', type: 'pdf', size: '245 KB', uploadDate: new Date(createdDate.getTime() + 3600000) },
        { id: 2, name: 'Service_Proposal.docx', type: 'docx', size: '156 KB', uploadDate: new Date(createdDate.getTime() + 7200000) }
      ] : [],
      location: taskType === 'Meeting' ? 'Client Office - 123 Business Ave, Suite 400' : null,
      duration: taskType === 'Call' || taskType === 'Meeting' ? '1 hour' : null,
      reminderSet: true,
      reminderTime: new Date(dueDate.getTime() - 3600000), // 1 hour before due date
      customFields: {
        'Department': ['Sales', 'Support', 'Operations', 'Finance', 'Marketing'][taskId % 5],
        'Purpose': ['New Business', 'Retention', 'Upsell', 'Support', 'Information'][taskId % 5]
      }
    };
  };

  // Generate mock comments (existing function)
  const generateMockComments = (taskId) => {
    const numComments = (taskId % 5) + 1;
    const today = new Date();
    const users = [
      { id: 1, name: 'John Smith', avatar: null },
      { id: 2, name: 'Sarah Johnson', avatar: null },
      { id: 3, name: 'Michael Brown', avatar: null },
      { id: 4, name: 'Emily Davis', avatar: null },
      { id: 5, name: 'David Wilson', avatar: null }
    ];
    
    const commentTexts = [
      "I've reviewed this and it looks good to move forward.",
      "Let's discuss this in our team meeting tomorrow.",
      "I need more information before proceeding. Can you provide details about their current service plan?",
      "I've contacted the client and they're available next week for a follow-up.",
      "The proposal has been sent to the client. Awaiting their response.",
      "Client has confirmed receipt of our documents.",
      "I've added some reference materials to the shared folder.",
      "Let's prioritize this for end of week completion."
    ];
    
    return Array.from({ length: numComments }, (_, index) => {
      const timestamp = new Date(today);
      timestamp.setDate(timestamp.getDate() - index);
      timestamp.setHours(9 + index, Math.floor(Math.random() * 60), 0, 0);
      
      const user = users[index % users.length];
      
      return {
        id: index + 1,
        text: commentTexts[index % commentTexts.length],
        user: user,
        timestamp: timestamp,
        attachments: []
      };
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort newest first
  };

  // Generate mock activities (existing function)
  const generateMockActivities = (taskId) => {
    // Existing implementation...
    const numActivities = (taskId % 8) + 3;
    const today = new Date();
    const users = [
      { id: 1, name: 'John Smith' },
      { id: 2, name: 'Sarah Johnson' },
      { id: 3, name: 'Michael Brown' },
      { id: 4, name: 'Emily Davis' },
      { id: 5, name: 'David Wilson' }
    ];
    
    const activityTypes = [
      { type: 'created', message: 'created this task' },
      { type: 'updated', message: 'updated the task details' },
      { type: 'status_change', message: 'changed the status to' },
      { type: 'assigned', message: 'assigned this task to' },
      { type: 'commented', message: 'commented on this task' },
      { type: 'attachment', message: 'added an attachment' },
      { type: 'subtask', message: 'added a subtask' },
      { type: 'completed', message: 'marked this task as completed' },
      { type: 'reopened', message: 'reopened this task' }
    ];
    
    const statusOptions = ['not_started', 'in_progress', 'pending', 'completed'];
    
    return Array.from({ length: numActivities }, (_, index) => {
      const timestamp = new Date(today);
      timestamp.setDate(timestamp.getDate() - (numActivities - index));
      timestamp.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
      
      const user = users[index % users.length];
      
      let activityType;
      let details = null;
      
      if (index === 0) {
        // First activity is always creation
        activityType = activityTypes[0];
      } else if (index === numActivities - 1 && taskId % 2 === 0) {
        // Sometimes the last activity is completion
        activityType = activityTypes[7];
      } else {
        // Other activities are random
        activityType = activityTypes[1 + (index % (activityTypes.length - 1))];
        
        if (activityType.type === 'status_change') {
          details = statusOptions[index % statusOptions.length];
        } else if (activityType.type === 'assigned') {
          details = users[(index + 1) % users.length].name;
        }
      }
      
      return {
        id: index + 1,
        type: activityType.type,
        message: activityType.message,
        details: details,
        user: user,
        timestamp: timestamp
      };
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort newest first
  };

  // Generate mock subtasks (existing function)
  const generateMockSubTasks = (taskId) => {
    const numSubTasks = (taskId % 4) + 1;
    
    const subTaskTitles = [
      'Research client history',
      'Prepare presentation materials',
      'Schedule follow-up meeting',
      'Update CRM with new contact information',
      'Review proposal with manager',
      'Get approvals from finance department',
      'Send confirmation email',
      'Prepare agenda for discussion'
    ];
    
    return Array.from({ length: numSubTasks }, (_, index) => {
      return {
        id: index + 1,
        title: subTaskTitles[(taskId + index) % subTaskTitles.length],
        completed: index < (numSubTasks / 2),
        createdAt: new Date(new Date().setDate(new Date().getDate() - (numSubTasks - index)))
      };
    });
  };

  // Generate mock related tasks (existing function)
  const generateMockRelatedTasks = (taskId) => {
    // Existing implementation...
    const numRelatedTasks = (taskId % 3) + 1;
    const today = new Date();
    
    return Array.from({ length: numRelatedTasks }, (_, index) => {
      const relatedId = (taskId + index + 10) % 30 + 1; // Some other task ID
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + (relatedId % 10) - 5); // -5 to +5 days from today
      
      return {
        id: relatedId,
        title: ['Follow-up Call', 'Send Proposal', 'Contract Review', 'Delivery Schedule', 'Payment Confirmation'][index % 5],
        status: ['not_started', 'in_progress', 'completed'][index % 3],
        dueDate: dueDate,
        assigneeName: ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis'][index % 4]
      };
    });
  };

  // Format date (existing function)
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date and time (existing function)
  const formatDateTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time only (existing function)
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge (existing function)
  const getStatusBadge = (status) => {
    const taskStatus = taskStatuses.find(s => s.value === status);
    return taskStatus ? (
      <Badge bg={taskStatus.color} className="text-uppercase">
        {taskStatus.label}
      </Badge>
    ) : null;
  };

  // Get priority badge (existing function)
  const getPriorityBadge = (priority) => {
    const taskPriority = taskPriorities.find(p => p.value === priority);
    return taskPriority ? (
      <Badge bg={taskPriority.color} className="text-uppercase">
        {taskPriority.label}
      </Badge>
    ) : null;
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setTask({
      ...task,
      status: newStatus,
      completedDate: newStatus === 'completed' ? new Date() : null
    });
    
    // Add an activity (will be saved when changes are saved)
    const newActivity = {
      id: activities.length + 1,
      type: 'status_change',
      message: 'changed the status to',
      details: newStatus,
      user: { id: 1, name: 'John Smith' }, // Current user
      timestamp: new Date()
    };
    
    setActivities([newActivity, ...activities]);
  };

  // Handle adding comment (This happens immediately, not part of "Save")
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: comments.length + 1,
      text: newComment,
      user: { id: 1, name: 'John Smith', avatar: null }, // Current user
      timestamp: new Date(),
      attachments: []
    };
    
    setComments([comment, ...comments]);
    
    // Add an activity
    const activity = {
      id: activities.length + 1,
      type: 'commented',
      message: 'commented on this task',
      user: { id: 1, name: 'John Smith' }, // Current user
      timestamp: new Date()
    };
    
    setActivities([activity, ...activities]);
    
    // Clear the comment input
    setNewComment('');
  };

  // Handle adding subtask (This happens immediately, not part of "Save")
  const handleAddSubTask = () => {
    if (!newSubTask.trim()) return;
    
    const subTask = {
      id: subTasks.length + 1,
      title: newSubTask,
      completed: false,
      createdAt: new Date()
    };
    
    const updatedSubTasks = [...subTasks, subTask];
    setSubTasks(updatedSubTasks);
    
    // Add an activity
    const activity = {
      id: activities.length + 1,
      type: 'subtask',
      message: 'added a subtask',
      user: { id: 1, name: 'John Smith' }, // Current user
      timestamp: new Date()
    };
    
    setActivities([activity, ...activities]);
    
    // Clear the subtask input
    setNewSubTask('');
  };

  // Handle toggling subtask completion
  const handleToggleSubTask = (subTaskId) => {
    const updatedSubTasks = subTasks.map(st => {
      if (st.id === subTaskId) {
        return { ...st, completed: !st.completed };
      }
      return st;
    });
    
    setSubTasks(updatedSubTasks);
    
    // Add an activity (will be saved when changes are saved)
    const subtask = subTasks.find(st => st.id === subTaskId);
    const action = !subtask.completed ? 'completed' : 'reopened';
    
    const activity = {
      id: activities.length + 1,
      type: 'subtask_update',
      message: `${action} a subtask`,
      user: { id: 1, name: 'John Smith' }, // Current user
      timestamp: new Date()
    };
    
    setActivities([activity, ...activities]);
  };

  // Save all changes
  const handleSaveChanges = () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    
    // Simulate API call to save changes
    setTimeout(() => {
      // In a real app, this would be an API call
      console.log('Saving task changes:', task);
      console.log('Saving subtask changes:', subTasks);
      
      // Add activity for saving changes
      const saveActivity = {
        id: activities.length + 1,
        type: 'updated',
        message: 'saved changes to this task',
        user: { id: 1, name: 'John Smith' }, // Current user
        timestamp: new Date()
      };
      
      setActivities([saveActivity, ...activities]);
      
      // Update original references to match current state
      setOriginalTask(JSON.parse(JSON.stringify(task)));
      setOriginalSubTasks(JSON.parse(JSON.stringify(subTasks)));
      
      // Show success message and reset state
      setSaveSuccess(true);
      setHasChanges(false);
      setIsSaving(false);
      
      // Hide success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Handle deleting task
  const handleDeleteTask = () => {
    if (window.confirm(`Are you sure you want to delete this task: ${task.title}?`)) {
      navigate('/tasks');
    }
  };

  // Check if the task is overdue
  const isOverdue = (task) => {
    if (!task) return false;
    return task.status !== 'completed' && task.dueDate < new Date();
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading task details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title="Task Details"
        backButton={true}
      />
      
      {saveSuccess && (
        <Alert variant="success" className="mb-4 d-flex align-items-center">
          <FaCheckCircle className="me-2" />
          <span>Task updated successfully!</span>
        </Alert>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button
            variant={task.status === 'completed' ? 'success' : 'outline-secondary'}
            className="rounded-circle p-2 me-3"
            onClick={() => handleStatusChange(task.status === 'completed' ? 'in_progress' : 'completed')}
          >
            {task.status === 'completed' ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
          </Button>
          <h2 className="mb-0">{task.title}</h2>
        </div>
        <div>
          {/* Save button that appears only when changes exist */}
          {hasChanges && (
            <Button 
              variant="success"
              className="me-2"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="me-1" /> Save Changes
                </>
              )}
            </Button>
          )}
          
          <Dropdown className="d-inline-block me-2">
            <Dropdown.Toggle variant="outline-primary">
              {getStatusBadge(task.status)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {taskStatuses.map(status => (
                <Dropdown.Item 
                  key={status.value} 
                  onClick={() => handleStatusChange(status.value)}
                  active={task.status === status.value}
                >
                  <Badge bg={status.color} className="text-uppercase me-2">
                    {status.label}
                  </Badge>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button 
            variant="outline-secondary"
            className="me-2"
            as={Link}
            to={`/tasks/${task.id}/edit`}
          >
            <FaPencilAlt className="me-1" /> Edit
          </Button>
          <Button 
            variant="outline-danger"
            onClick={handleDeleteTask}
          >
            <FaTrash className="me-1" /> Delete
          </Button>
        </div>
      </div>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="task-description mb-4">
                <h5 className="border-bottom pb-2">Description</h5>
                <p>{task.description}</p>
                {task.notes && (
                  <div className="bg-light p-3 rounded">
                    <h6>Notes</h6>
                    <p className="mb-0">{task.notes}</p>
                  </div>
                )}
              </div>
              
              {subTasks.length > 0 && (
                <div className="subtasks mb-4">
                  <h5 className="border-bottom pb-2">Subtasks</h5>
                  <ListGroup variant="flush">
                    {subTasks.map(subTask => (
                      <ListGroup.Item 
                        key={subTask.id}
                        className="ps-0 border-0 py-2"
                      >
                        <div className="d-flex align-items-start">
                          <Button
                            variant={subTask.completed ? 'success' : 'outline-secondary'}
                            size="sm"
                            className="rounded-circle p-1 me-2 mt-1"
                            onClick={() => handleToggleSubTask(subTask.id)}
                          >
                            {subTask.completed ? <FaCheckCircle size={14} /> : <FaRegCircle size={14} />}
                          </Button>
                          <div>
                            <div className={subTask.completed ? 'text-decoration-line-through text-muted' : ''}>
                              {subTask.title}
                            </div>
                            <div className="small text-muted">
                              Added {formatDate(subTask.createdAt)}
                            </div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
              
              <div className="add-subtask mb-4">
                <Form.Group>
                  <div className="d-flex">
                    <Form.Control
                      placeholder="Add a subtask..."
                      value={newSubTask}
                      onChange={(e) => setNewSubTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
                    />
                    <Button 
                      variant="outline-primary" 
                      className="ms-2"
                      onClick={handleAddSubTask}
                      disabled={!newSubTask.trim()}
                    >
                      <FaPlus /> Add
                    </Button>
                  </div>
                </Form.Group>
              </div>
              
              <div className="comments mb-4">
                <h5 className="border-bottom pb-2">Comments</h5>
                <div className="mb-3">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="d-flex justify-content-end mt-2">
                      <Button 
                        variant="primary" 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <FaCommentAlt className="me-1" /> Add Comment
                      </Button>
                    </div>
                  </Form.Group>
                </div>
                
                {comments.length > 0 ? (
                  <div className="comments-list">
                    {comments.map(comment => (
                      <div key={comment.id} className="comment mb-3 p-3 bg-light rounded">
                        <div className="d-flex justify-content-between mb-2">
                          <div className="fw-bold">{comment.user.name}</div>
                          <div className="text-muted small">{formatDateTime(comment.timestamp)}</div>
                        </div>
                        <div>{comment.text}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-3">
                    No comments yet
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
          
          {task.attachments && task.attachments.length > 0 && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Attachments</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {task.attachments.map(attachment => (
                    <ListGroup.Item 
                      key={attachment.id}
                      className="d-flex justify-content-between align-items-center py-3"
                    >
                      <div className="d-flex align-items-center">
                        <FaPaperclip className="me-2 text-primary" />
                        <div>
                          <div className="fw-bold">{attachment.name}</div>
                          <div className="small text-muted">
                            {attachment.size} • Uploaded {formatDate(attachment.uploadDate)}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline-primary" size="sm">Download</Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
          
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Activity</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {activities.map(activity => (
                  <ListGroup.Item key={activity.id} className="py-3">
                    <div className="d-flex">
                      <div className="me-3">
                        {activity.type === 'created' && <FaPlus className="text-success" />}
                        {activity.type === 'updated' && <FaPencilAlt className="text-primary" />}
                        {activity.type === 'status_change' && <FaRedo className="text-warning" />}
                        {activity.type === 'assigned' && <FaUserAlt className="text-info" />}
                        {activity.type === 'commented' && <FaCommentAlt className="text-secondary" />}
                        {activity.type === 'attachment' && <FaPaperclip className="text-primary" />}
                        {activity.type === 'subtask' && <FaCheckSquare className="text-success" />}
                        {activity.type === 'completed' && <FaCheckCircle className="text-success" />}
                        {activity.type === 'reopened' && <FaRedo className="text-warning" />}
                      </div>
                      <div>
                        <div>
                          <span className="fw-bold">{activity.user.name}</span>{' '}
                          <span>{activity.message}</span>{' '}
                          {activity.details && (
                            <span className="fw-bold">
                              {activity.type === 'status_change' ? (
                                getStatusBadge(activity.details)
                              ) : (
                                activity.details
                              )}
                            </span>
                          )}
                        </div>
                        <div className="text-muted small">
                          {formatDateTime(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Task Details</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between py-3">
                  <span className="text-muted">Status</span>
                  <span>{getStatusBadge(task.status)}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between py-3">
                  <span className="text-muted">Priority</span>
                  <span>{getPriorityBadge(task.priority)}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between py-3">
                  <span className="text-muted">Due Date</span>
                  <span className={isOverdue(task) ? 'text-danger fw-bold' : ''}>
                    {formatDate(task.dueDate)} {formatTime(task.dueDate)}
                    {isOverdue(task) && (
                      <span className="ms-2">
                        <FaExclamationTriangle className="text-danger" size={14} />
                      </span>
                    )}
                  </span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between py-3">
                  <span className="text-muted">Created</span>
                  <span>{formatDate(task.createdDate)}</span>
                </ListGroup.Item>
                
                {task.completedDate && (
                  <ListGroup.Item className="d-flex justify-content-between py-3">
                    <span className="text-muted">Completed</span>
                    <span>{formatDate(task.completedDate)}</span>
                  </ListGroup.Item>
                )}
                
                <ListGroup.Item className="d-flex justify-content-between py-3">
                  <span className="text-muted">Assigned To</span>
                  <span>{task.assigneeName}</span>
                </ListGroup.Item>
                
                {task.duration && (
                  <ListGroup.Item className="d-flex justify-content-between py-3">
                    <span className="text-muted">Duration</span>
                    <span>{task.duration}</span>
                  </ListGroup.Item>
                )}
                
                {task.location && (
                  <ListGroup.Item className="d-flex justify-content-between py-3">
                    <span className="text-muted">Location</span>
                    <span>{task.location}</span>
                  </ListGroup.Item>
                )}
                
                {task.reminderSet && (
                  <ListGroup.Item className="d-flex justify-content-between py-3">
                    <span className="text-muted">Reminder</span>
                    <span>{formatDateTime(task.reminderTime)}</span>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Related</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <FaBuilding className="text-primary me-2" />
                      <div>
                        <div className="fw-bold">Company</div>
                        <Link to={`/companies/${task.company.id}`} className="text-decoration-none">
                          {task.company.name}
                        </Link>
                      </div>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      as={Link}
                      to={`/companies/${task.company.id}`}
                    >
                      View
                    </Button>
                  </div>
                </ListGroup.Item>
                
                {task.contact && (
                  <ListGroup.Item className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaUserAlt className="text-primary me-2" />
                        <div>
                          <div className="fw-bold">Contact</div>
                          <Link to={`/contacts/${task.contact.id}`} className="text-decoration-none">
                            {task.contact.name}
                          </Link>
                        </div>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        as={Link}
                        to={`/contacts/${task.contact.id}`}
                      >
                        View
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                
                {Object.entries(task.customFields).map(([key, value]) => (
                  <ListGroup.Item key={key} className="py-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">{key}</span>
                      <span>{value}</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
          
          {relatedTasks.length > 0 && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Related Tasks</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {relatedTasks.map(relatedTask => (
                    <ListGroup.Item key={relatedTask.id} className="py-3">
                      <Link to={`/tasks/${relatedTask.id}`} className="text-decoration-none">
                        <div className="d-flex align-items-start">
                          <div className="me-2">
                            {relatedTask.status === 'completed' ? (
                              <FaCheckCircle className="text-success" />
                            ) : (
                              <FaRegCircle className="text-secondary" />
                            )}
                          </div>
                          <div>
                            <div className="fw-bold">{relatedTask.title}</div>
                            <div className="small text-muted">
                              Due: {formatDate(relatedTask.dueDate)} • Assigned to: {relatedTask.assigneeName}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TaskDetail;