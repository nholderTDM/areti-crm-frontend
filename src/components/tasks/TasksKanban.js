// src/components/tasks/TasksKanban.js
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Row, Col, Badge, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter, FaUserAlt, FaEllipsisV, FaCalendarAlt, 
         FaBuilding, FaChevronLeft, FaChevronRight, FaListUl, FaTh, 
         FaColumns, FaCalendarDay, FaCheckCircle, FaRegCircle, FaSyncAlt } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const TasksKanban = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const boardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
  
  // Task statuses with their corresponding colors
  const taskStatuses = [
    { value: 'not_started', label: 'Not Started', color: 'secondary' },
    { value: 'in_progress', label: 'In Progress', color: 'primary' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'success' }
  ];
  
  // Filtering out 'cancelled' for Kanban view
  
  // Task priorities with their corresponding colors
  const taskPriorities = [
    { value: 'low', label: 'Low', color: 'info' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'danger' },
    { value: 'urgent', label: 'Urgent', color: 'dark' }
  ];
  
  // List of users who can be assignees
  const assignees = [
    { id: 1, name: 'John Smith', role: 'Sales Representative' },
    { id: 2, name: 'Sarah Johnson', role: 'Sales Manager' },
    { id: 3, name: 'Michael Brown', role: 'Account Executive' },
    { id: 4, name: 'Emily Davis', role: 'Customer Support' },
    { id: 5, name: 'David Wilson', role: 'Delivery Driver' }
  ];

  // Load tasks data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockTasks = generateMockTasks();
      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Generate mock task data
  const generateMockTasks = () => {
    const today = new Date();
    const taskTypes = ['Call', 'Email', 'Meeting', 'Follow-up', 'Proposal', 'Delivery', 'Payment'];
    const companies = [
      { id: 1, name: 'ABC Logistics' },
      { id: 2, name: 'XYZ Retail' },
      { id: 3, name: 'Tech Solutions Inc.' },
      { id: 4, name: 'Global Shipping Co.' },
      { id: 5, name: 'Metro Electronics' }
    ];
    
    const contacts = [
      { id: 1, name: 'John Doe', company: 'ABC Logistics' },
      { id: 2, name: 'Jane Smith', company: 'XYZ Retail' },
      { id: 3, name: 'Robert Johnson', company: 'Tech Solutions Inc.' },
      { id: 4, name: 'Emma Williams', company: 'Global Shipping Co.' },
      { id: 5, name: 'Michael Brown', company: 'Metro Electronics' }
    ];

    return Array.from({ length: 25 }, (_, index) => {
      const taskDate = new Date(today);
      // Randomly distribute tasks between past, present and future
      taskDate.setDate(taskDate.getDate() + Math.floor(Math.random() * 30) - 10);
      
      const dueHour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
      taskDate.setHours(dueHour, 0, 0, 0);
      
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const assigneeId = Math.floor(Math.random() * 5) + 1;
      const companyIndex = Math.floor(Math.random() * companies.length);
      const company = companies[companyIndex];
      
      // Create a contact related to the company
      const relatedContacts = contacts.filter(c => c.company === company.name);
      const contact = relatedContacts.length > 0 ? 
        relatedContacts[Math.floor(Math.random() * relatedContacts.length)] : 
        null;
      
      // For Kanban, we don't want to include 'cancelled' status
      const statusOptions = ['not_started', 'in_progress', 'pending', 'completed'];
      const priorityOptions = ['low', 'medium', 'high', 'urgent'];
      
      return {
        id: index + 1,
        title: `${taskType} with ${company.name}`,
        description: `${taskType} regarding our services with ${company.name}${contact ? ` (Contact: ${contact.name})` : ''}`,
        type: taskType.toLowerCase(),
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        priority: priorityOptions[Math.floor(Math.random() * priorityOptions.length)],
        assignee: assigneeId,
        dueDate: taskDate,
        createdDate: new Date(taskDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 0-7 days before due date
        completedDate: null,
        company: company,
        contact: contact,
        notes: `Follow up on the previous conversation about our ${taskType === 'Delivery' ? 'delivery services' : 'services'}.`
      };
    });
  };
  
  // Filter tasks
  useEffect(() => {
    let result = [...tasks];
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    // Apply assignee filter
    if (assigneeFilter !== 'all') {
      result = result.filter(task => task.assignee === parseInt(assigneeFilter));
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.company.name.toLowerCase().includes(search) ||
        (task.contact && task.contact.name.toLowerCase().includes(search))
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, priorityFilter, assigneeFilter]);
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get priority badge
  const getPriorityBadge = (priority) => {
    const taskPriority = taskPriorities.find(p => p.value === priority);
    return taskPriority ? (
      <Badge bg={taskPriority.color} className="text-uppercase">
        {taskPriority.label}
      </Badge>
    ) : null;
  };
  
  // Get assignee name by ID
  const getAssigneeName = (assigneeId) => {
    const assignee = assignees.find(a => a.id === assigneeId);
    return assignee ? assignee.name : 'Unassigned';
  };
  
  // Handle drag start
  const handleDragStart = (e, task) => {
    setIsDragging(true);
    setDraggedTask(task);
    
    // Add some opacity to the original element
    e.currentTarget.style.opacity = '0.6';
    
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };
  
  // Handle drag end
  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDraggedTask(null);
    
    // Reset opacity
    e.currentTarget.style.opacity = '1';
  };
  
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handle drop
  const handleDrop = (e, status) => {
    e.preventDefault();
    
    if (!draggedTask) return;
    
    // Update task status
    const updatedTasks = tasks.map(task => {
      if (task.id === draggedTask.id) {
        return {
          ...task,
          status,
          completedDate: status === 'completed' ? new Date() : null
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };
  
  // Handle column scroll
  const handleColumnScroll = (direction, columnId) => {
    const column = document.getElementById(columnId);
    if (column) {
      const scrollAmount = 200;
      if (direction === 'left') {
        column.scrollLeft -= scrollAmount;
      } else {
        column.scrollLeft += scrollAmount;
      }
    }
  };
  
  // Handle toggle complete
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'in_progress' : 'completed';
        return {
          ...task,
          status: newStatus,
          completedDate: newStatus === 'completed' ? new Date() : null
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };
  
  // Check if the task is overdue
  const isOverdue = (task) => {
    if (!task) return false;
    return task.status !== 'completed' && task.dueDate < new Date();
  };
  
  // Render Kanban columns
  const renderKanbanColumns = () => {
    return (
      <div className="kanban-board d-flex h-100 pb-3">
        {taskStatuses.map(status => {
          const columnTasks = filteredTasks.filter(task => task.status === status.value);
          
          return (
            <div 
              key={status.value} 
              className="kanban-column mx-2 flex-shrink-0"
              style={{ width: '300px' }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status.value)}
            >
              <Card className="shadow-sm h-100">
                <Card.Header className={`bg-${status.color} bg-opacity-10 d-flex justify-content-between align-items-center`}>
                  <h5 className="mb-0 d-flex align-items-center">
                    <span>{status.label}</span>
                    <Badge bg={status.color} className="ms-2">{columnTasks.length}</Badge>
                  </h5>
                  {status.value !== 'completed' && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate('/tasks/new')}
                    >
                      <FaPlus />
                    </Button>
                  )}
                </Card.Header>
                <div 
                  id={`column-${status.value}`}
                  className="kanban-tasks-container"
                  style={{ 
                    overflowY: 'auto', 
                    height: 'calc(100vh - 300px)',
                    paddingBottom: '80px' // Extra padding at bottom for better UX
                  }}
                >
                  {columnTasks.length === 0 ? (
                    <div className="text-center text-muted p-4">
                      No tasks in this column
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <Card 
                        key={task.id}
                        className="task-card m-2 shadow-sm"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                      >
                        <Card.Body className={isCompact ? 'p-2' : 'p-3'}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-start">
                              <Button
                                variant={task.status === 'completed' ? 'success' : 'outline-secondary'}
                                size="sm"
                                className="rounded-circle p-1 me-2 mt-1"
                                onClick={() => handleToggleComplete(task.id)}
                              >
                                {task.status === 'completed' ? <FaCheckCircle size={12} /> : <FaRegCircle size={12} />}
                              </Button>
                              <div>
                                <div className="fw-bold">{task.title}</div>
                                {!isCompact && (
                                  <div className="small text-muted text-truncate" style={{ maxWidth: '180px' }}>
                                    {task.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${task.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/tasks/${task.id}`}>
                                  View Details
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/tasks/${task.id}/edit`}>
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleToggleComplete(task.id)}>
                                  {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                          
                          {!isCompact && (
                            <div className="mb-2">
                              <Link to={`/companies/${task.company.id}`} className="text-decoration-none d-flex align-items-center small">
                                <FaBuilding className="me-1 text-muted" size={12} />
                                <span>{task.company.name}</span>
                              </Link>
                            </div>
                          )}
                          
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <div className={`${isOverdue(task) ? 'text-danger' : 'text-muted'} small d-flex align-items-center`}>
                              <FaCalendarAlt className="me-1" size={12} />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>
                            
                            <div className="d-flex align-items-center">
                              {getPriorityBadge(task.priority)}
                              
                              {!isCompact && (
                                <div className="ms-2 text-muted small d-flex align-items-center">
                                  <FaUserAlt className="me-1" size={12} />
                                  <span>{getAssigneeName(task.assignee).split(' ')[0]}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </div>
                
                <div className="horizontal-scroll-controls d-flex justify-content-between position-absolute bottom-0 w-100 p-2 bg-white border-top">
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={() => handleColumnScroll('left', `column-${status.value}`)}
                  >
                    <FaChevronLeft />
                  </Button>
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={() => handleColumnScroll('right', `column-${status.value}`)}
                  >
                    <FaChevronRight />
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title="Task Board"
        backButton={true}
      />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex">
          <Button 
            variant="outline-primary" 
            className="me-2"
            onClick={() => navigate('/tasks')}
          >
            <FaListUl className="me-1" /> List
          </Button>
          <Button 
            variant="outline-primary" 
            className="me-2"
            onClick={() => navigate('/tasks?view=grid')}
          >
            <FaTh className="me-1" /> Grid
          </Button>
          <Button 
            variant="primary" 
            className="me-2"
          >
            <FaColumns className="me-1" /> Kanban
          </Button>
          <Button 
            variant="outline-primary" 
            className="me-2"
            onClick={() => navigate('/tasks/calendar')}
          >
            <FaCalendarDay className="me-1" /> Calendar
          </Button>
        </div>
        <div>
          <Button 
            variant="outline-secondary"
            className="me-2"
            onClick={() => setIsCompact(!isCompact)}
          >
            {isCompact ? 'Detailed View' : 'Compact View'}
          </Button>
          <Button 
            variant="outline-secondary"
            className="me-2"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                const refreshedTasks = generateMockTasks();
                setTasks(refreshedTasks);
                setFilteredTasks(refreshedTasks);
                setIsLoading(false);
              }, 800);
            }}
          >
            <FaSyncAlt className="me-1" /> Refresh
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate('/tasks/new')}
          >
            <FaPlus className="me-1" /> New Task
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Row>
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FaFilter />
              </InputGroup.Text>
              <Form.Select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                {taskPriorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FaUserAlt />
              </InputGroup.Text>
              <Form.Select 
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <option value="all">All Assignees</option>
                {assignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
          <Col md={2}>
            <Button 
              variant="outline-secondary" 
              className="w-100"
              onClick={() => {
                setSearchTerm('');
                setPriorityFilter('all');
                setAssigneeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </div>
      
      <div 
        className="kanban-board-container"
        ref={boardRef}
        style={{ 
          overflowX: 'auto', 
          minHeight: 'calc(100vh - 250px)'
        }}
      >
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading tasks...</p>
          </div>
        ) : (
          renderKanbanColumns()
        )}
      </div>
      
      <div className="text-center text-muted small mt-3">
        Drag and drop tasks between columns to update their status
      </div>
    </div>
  );
};

export default TasksKanban;