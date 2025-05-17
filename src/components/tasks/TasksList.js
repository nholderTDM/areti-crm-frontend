import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Row, Col, Badge, Modal, Pagination, Dropdown, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, 
         FaTasks, FaCheck, FaCalendarAlt, FaUser, FaBuilding, 
         FaFileExport, FaListUl, FaTh, FaColumns, FaCalendarDay, FaDownload } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const TasksList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);

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
      
      const statusOptions = taskStatuses.map(s => s.value);
      const priorityOptions = taskPriorities.map(p => p.value);
      
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

  // Apply filters and sort
  useEffect(() => {
    let result = [...tasks];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }
    
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
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle nested fields
      if (sortField === 'company.name') {
        fieldA = a.company.name;
        fieldB = b.company.name;
      } else if (sortField === 'contact.name') {
        fieldA = a.contact ? a.contact.name : '';
        fieldB = b.contact ? b.contact.name : '';
      } else if (sortField === 'assignee') {
        const assigneeA = assignees.find(a => a.id === fieldA)?.name || '';
        const assigneeB = assignees.find(a => a.id === fieldB)?.name || '';
        fieldA = assigneeA;
        fieldB = assigneeB;
      }
      
      // Handle dates
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      // Handle strings
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      // Handle numbers
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, statusFilter, priorityFilter, assigneeFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Handle pagination click
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const taskStatus = taskStatuses.find(s => s.value === status);
    return taskStatus ? (
      <Badge bg={taskStatus.color} className="text-uppercase">
        {taskStatus.label}
      </Badge>
    ) : null;
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

  // Handle delete confirmation
  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (taskToDelete) {
      // In a real app, this would be an API call
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
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

  // Handle select all tasks
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTasks(currentTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  // Handle select task
  const handleSelectTask = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedTasks.length === 0) return;
    
    const updatedTasks = tasks.map(task => {
      if (selectedTasks.includes(task.id)) {
        switch (bulkAction) {
          case 'complete':
            return {
              ...task,
              status: 'completed',
              completedDate: new Date()
            };
          case 'in_progress':
            return {
              ...task,
              status: 'in_progress',
              completedDate: null
            };
          case 'delete':
            return null; // Will be filtered out later
          default:
            return task;
        }
      }
      return task;
    }).filter(task => task !== null);
    
    setTasks(updatedTasks);
    setSelectedTasks([]);
    setShowBulkActionModal(false);
  };

  // Calculate task summary stats
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const notStarted = tasks.filter(task => task.status === 'not_started').length;
    const overdue = tasks.filter(task => {
      return task.status !== 'completed' && task.dueDate < new Date();
    }).length;
    
    return {
      total,
      completed,
      inProgress,
      notStarted,
      overdue
    };
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center">
        <Pagination.Prev 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  // Render summary cards
  const renderSummary = () => {
    const stats = getTaskStats();
    
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-primary bg-opacity-10 rounded p-3 me-3">
                <FaTasks className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Tasks</h6>
                <h3 className="mb-0">{stats.total}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-success bg-opacity-10 rounded p-3 me-3">
                <FaCheck className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Completed</h6>
                <h3 className="mb-0">{stats.completed}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-warning bg-opacity-10 rounded p-3 me-3">
                <FaTasks className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">In Progress</h6>
                <h3 className="mb-0">{stats.inProgress}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-danger bg-opacity-10 rounded p-3 me-3">
                <FaCalendarAlt className="text-danger" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Overdue</h6>
                <h3 className="mb-0">{stats.overdue}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Get assignee name by ID
  const getAssigneeName = (assigneeId) => {
    const assignee = assignees.find(a => a.id === assigneeId);
    return assignee ? assignee.name : 'Unassigned';
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title="Tasks"
        backButton={true}
      />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex">
          <Button 
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => setViewMode('list')}
          >
            <FaListUl className="me-1" /> List
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => setViewMode('grid')}
          >
            <FaTh className="me-1" /> Grid
          </Button>
          <Button 
            variant={viewMode === 'kanban' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => navigate('/tasks/kanban')}
          >
            <FaColumns className="me-1" /> Kanban
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'primary' : 'outline-primary'} 
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
            onClick={() => setShowBulkActionModal(true)}
            disabled={selectedTasks.length === 0}
          >
            Bulk Actions ({selectedTasks.length})
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate('/tasks/new')}
          >
            <FaPlus className="me-1" /> New Task
          </Button>
        </div>
      </div>
      
      {renderSummary()}
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={3}>
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
            <Col md={2}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {taskStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
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
                  <FaUser />
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
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setAssigneeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
          
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading tasks...</p>
            </div>
          ) : (
            <>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No tasks found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/tasks/new')}
                  >
                    <FaPlus className="me-1" /> Create New Task
                  </Button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th width="40">
                          <Form.Check
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              currentTasks.length > 0 && 
                              currentTasks.every(task => selectedTasks.includes(task.id))
                            }
                          />
                        </th>
                        <th width="40"></th>
                        <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                          Task {sortField === 'title' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('company.name')} style={{ cursor: 'pointer' }}>
                          Company {sortField === 'company.name' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>
                          Due Date {sortField === 'dueDate' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
                          Priority {sortField === 'priority' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('assignee')} style={{ cursor: 'pointer' }}>
                          Assignee {sortField === 'assignee' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                          Status {sortField === 'status' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTasks.map(task => (
                        <tr key={task.id}>
                          <td>
                            <Form.Check
                              type="checkbox"
                              checked={selectedTasks.includes(task.id)}
                              onChange={() => handleSelectTask(task.id)}
                            />
                          </td>
                          <td>
                            <Button
                              variant={task.status === 'completed' ? 'success' : 'outline-secondary'}
                              size="sm"
                              className="rounded-circle p-1"
                              onClick={() => handleToggleComplete(task.id)}
                            >
                              {task.status === 'completed' ? <FaCheck size={12} /> : null}
                            </Button>
                          </td>
                          <td>
                            <Link to={`/tasks/${task.id}`} className="text-decoration-none">
                              <div className="fw-bold">{task.title}</div>
                              <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                                {task.description}
                              </div>
                            </Link>
                          </td>
                          <td>
                            <Link to={`/companies/${task.company.id}`} className="text-decoration-none">
                              {task.company.name}
                            </Link>
                            {task.contact && (
                              <div className="small text-muted">
                                <Link to={`/contacts/${task.contact.id}`} className="text-decoration-none">
                                  {task.contact.name}
                                </Link>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className={`${new Date() > task.dueDate && task.status !== 'completed' ? 'text-danger fw-bold' : ''}`}>
                              {formatDate(task.dueDate)}
                              <div className="small text-muted">{formatTime(task.dueDate)}</div>
                            </div>
                          </td>
                          <td>{getPriorityBadge(task.priority)}</td>
                          <td>{getAssigneeName(task.assignee)}</td>
                          <td>{getStatusBadge(task.status)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${task.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/tasks/${task.id}`}>
                                  <FaTasks className="me-2" /> View Task
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/tasks/${task.id}/edit`}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleToggleComplete(task.id)}>
                                  <FaCheck className="me-2" /> {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => confirmDelete(task)}
                                >
                                  <FaTrash className="me-2" /> Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Row>
                  {currentTasks.map(task => (
                    <Col md={4} key={task.id} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <div>
                            {getPriorityBadge(task.priority)}
                            {getStatusBadge(task.status)}
                          </div>
                          <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${task.id}`}>
                              <FaEllipsisV />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item as={Link} to={`/tasks/${task.id}`}>
                                <FaTasks className="me-2" /> View Task
                              </Dropdown.Item>
                              <Dropdown.Item as={Link} to={`/tasks/${task.id}/edit`}>
                                <FaPencilAlt className="me-2" /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleToggleComplete(task.id)}>
                                <FaCheck className="me-2" /> {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger"
                                onClick={() => confirmDelete(task)}
                              >
                                <FaTrash className="me-2" /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex mb-3">
                            <Button
                              variant={task.status === 'completed' ? 'success' : 'outline-secondary'}
                              size="sm"
                              className="rounded-circle p-1 me-2"
                              onClick={() => handleToggleComplete(task.id)}
                            >
                              {task.status === 'completed' ? <FaCheck size={12} /> : null}
                            </Button>
                            <Link to={`/tasks/${task.id}`} className="text-decoration-none">
                              <h5 className="mb-0">{task.title}</h5>
                            </Link>
                          </div>
                          
                          <p className="text-muted small">{task.description}</p>
                          
                          <div className="mb-3">
                            <div className="text-muted small">Due Date</div>
                            <div className={`${new Date() > task.dueDate && task.status !== 'completed' ? 'text-danger fw-bold' : ''}`}>
                              {formatDate(task.dueDate)} - {formatTime(task.dueDate)}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-muted small">Company</div>
                            <div>
                              <Link to={`/companies/${task.company.id}`} className="text-decoration-none">
                                {task.company.name}
                              </Link>
                            </div>
                            {task.contact && (
                              <div className="small">
                                Contact: <Link to={`/contacts/${task.contact.id}`} className="text-decoration-none">
                                  {task.contact.name}
                                </Link>
                              </div>
                            )}
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">
                              Assigned to: {getAssigneeName(task.assignee)}
                            </div>
                            <div>
                              <Button
                                as={Link}
                                to={`/tasks/${task.id}`}
                                variant="outline-primary"
                                size="sm"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
              
              {renderPagination()}
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete task <strong>{taskToDelete?.title}</strong>?
          
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Task
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Bulk Action Modal */}
      <Modal show={showBulkActionModal} onHide={() => setShowBulkActionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Bulk Actions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apply action to {selectedTasks.length} selected tasks:</p>
          
          <Form.Group className="mb-3">
            <Form.Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="">-- Select Action --</option>
              <option value="complete">Mark as Completed</option>
              <option value="in_progress">Mark as In Progress</option>
              <option value="delete">Delete Tasks</option>
            </Form.Select>
          </Form.Group>
          
          {bulkAction === 'delete' && (
            <Alert variant="danger">
              <strong>Warning:</strong> This will permanently delete the selected tasks and cannot be undone.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkActionModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={bulkAction === 'delete' ? 'danger' : 'primary'} 
            onClick={handleBulkAction}
            disabled={!bulkAction}
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TasksList;