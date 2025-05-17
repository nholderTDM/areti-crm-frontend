// src/components/tasks/TaskCalendar.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Table, Modal, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaEllipsisV, FaUserAlt, 
         FaCalendarAlt, FaListUl, FaTh, FaColumns, FaCalendarDay, 
         FaChevronLeft, FaChevronRight, FaCheckCircle, FaRegCircle, 
         FaSyncAlt, FaBuilding, FaClock } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const TaskCalendar = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', or 'day'
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
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
  
  // Generate mock task data for calendar
  const generateMockTasks = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
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
    
    // Create tasks across the current month
    return Array.from({ length: 40 }, (_, index) => {
      // Distribute tasks across the month
      const daysInMonth = endOfMonth.getDate();
      const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
      const taskDate = new Date(today.getFullYear(), today.getMonth(), randomDay);
      
      // Set random hour (business hours)
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
      
      const statusOptions = ['not_started', 'in_progress', 'pending', 'completed', 'cancelled'];
      const priorityOptions = ['low', 'medium', 'high', 'urgent'];
      
      // For tasks in the past, bias towards completed
      let status;
      if (taskDate < today) {
        status = Math.random() > 0.3 ? 'completed' : statusOptions[Math.floor(Math.random() * 3)];
      } else {
        status = statusOptions[Math.floor(Math.random() * 3)]; // Exclude completed and cancelled for future tasks
      }
      
      return {
        id: index + 1,
        title: `${taskType} with ${company.name}`,
        description: `${taskType} regarding our services with ${company.name}${contact ? ` (Contact: ${contact.name})` : ''}`,
        type: taskType.toLowerCase(),
        status: status,
        priority: priorityOptions[Math.floor(Math.random() * priorityOptions.length)],
        assignee: assigneeId,
        dueDate: taskDate,
        createdDate: new Date(taskDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 0-7 days before due date
        completedDate: status === 'completed' ? new Date(taskDate.getTime() + Math.random() * 24 * 60 * 60 * 1000) : null,
        company: company,
        contact: contact,
        notes: `Follow up on the previous conversation about our ${taskType === 'Delivery' ? 'delivery services' : 'services'}.`,
        // For calendar, add duration
        duration: taskType === 'Meeting' ? 60 : (taskType === 'Call' ? 30 : 15) // Duration in minutes
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
  
  // Get days in month for calendar
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Navigate to previous month/week/day
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Navigate to next month/week/day
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
  
  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    if (!date) return [];
    
    // Convert date to year-month-day string for comparison
    const dateString = date.toISOString().split('T')[0];
    
    return filteredTasks.filter(task => {
      const taskDateString = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDateString === dateString;
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
  
  // Get status badge
  const getStatusBadge = (status) => {
    const taskStatus = taskStatuses.find(s => s.value === status);
    return taskStatus ? (
      <Badge bg={taskStatus.color} className="text-uppercase">
        {taskStatus.label}
      </Badge>
    ) : null;
  };
  
  // Get assignee name by ID
  const getAssigneeName = (assigneeId) => {
    const assignee = assignees.find(a => a.id === assigneeId);
    return assignee ? assignee.name : 'Unassigned';
  };
  
  // Handle toggle complete
  const handleToggleComplete = (taskId, event) => {
    event.stopPropagation();
    
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
  
  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };
  
  // Check if the task is overdue
  const isOverdue = (task) => {
    if (!task) return false;
    return task.status !== 'completed' && task.dueDate < new Date();
  };
  
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // Get CSS class for calendar day
  const getDayClass = (date) => {
    let className = 'calendar-day position-relative';
    
    if (isToday(date)) {
      className += ' bg-light';
    }
    
    return className;
  };
  
  // Render month view
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Calculate calendar days including previous and next month days
    const calendarDays = [];
    
    // Previous month days
    const prevMonthDays = firstDayOfMonth;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    
    for (let i = 0; i < prevMonthDays; i++) {
      const day = daysInPrevMonth - prevMonthDays + i + 1;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      calendarDays.push({ date, currentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      calendarDays.push({ date, currentMonth: true });
    }
    
    // Next month days
    const totalDaysVisible = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
    const nextMonthDays = totalDaysVisible - (daysInMonth + firstDayOfMonth);
    
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      calendarDays.push({ date, currentMonth: false });
    }
    
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    
    return (
      <div className="calendar-month-view">
        <Table bordered className="mb-0 table-fixed">
          <thead>
            <tr>
              {weekdays.map(day => (
                <th key={day} className="text-center py-3">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex} style={{ height: '120px' }}>
                {week.map(({ date, currentMonth }) => {
                  const dayTasks = getTasksForDate(date);
                  
                  return (
                    <td 
                      key={date.toString()} 
                      className={getDayClass(date)}
                      style={{ 
                        opacity: currentMonth ? 1 : 0.4,
                        overflow: 'hidden',
                        padding: '0.25rem'
                      }}
                    >
                      <div className="d-flex justify-content-between mb-1">
                        <span className="day-number">{date.getDate()}</span>
                        {dayTasks.length > 0 && (
                          <Badge bg="primary" pill>
                            {dayTasks.length}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="day-tasks" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {dayTasks.slice(0, 3).map(task => (
                          <div 
                            key={task.id} 
                            className={`task-item mb-1 p-1 rounded bg-${taskStatuses.find(s => s.value === task.status)?.color || 'secondary'} bg-opacity-10`}
                            onClick={() => handleTaskClick(task)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex align-items-start">
                              <div 
                                className={`task-indicator rounded-circle me-1 bg-${taskStatuses.find(s => s.value === task.status)?.color || 'secondary'}`}
                                style={{ width: '8px', height: '8px', marginTop: '6px' }}
                              ></div>
                              <div className="small text-truncate">
                                {formatTime(task.dueDate)} {task.title}
                              </div>
                            </div>
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-primary small">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      weekDays.push(date);
    }
    
    return (
      <div className="calendar-week-view">
        <div className="d-flex">
          <div className="time-column" style={{ width: '80px' }}>
            <div className="time-header" style={{ height: '60px' }}></div>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="time-slot text-end pe-2" style={{ height: '60px' }}>
                {(i + 8) % 12 === 0 ? 12 : (i + 8) % 12}{(i + 8) < 12 ? 'am' : 'pm'}
              </div>
            ))}
          </div>
          
          <div className="day-columns flex-grow-1 d-flex">
            {weekDays.map(day => {
              const dayTasks = getTasksForDate(day);
              
              return (
                <div 
                  key={day.toString()} 
                  className="day-column flex-grow-1 position-relative" 
                  style={{ minWidth: '120px' }}
                >
                  <div 
                    className={`day-header text-center py-3 ${isToday(day) ? 'bg-light' : ''}`}
                    style={{ height: '60px' }}
                  >
                    <div>{weekdays[day.getDay()]}</div>
                    <div className="fw-bold">{day.getDate()}</div>
                  </div>
                  
                  <div className="time-slots position-relative" style={{ height: '720px' }}>
                    {/* Time slot grid */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="time-slot border-bottom" 
                        style={{ height: '60px' }}
                      ></div>
                    ))}
                    
                    {/* Tasks */}
                    {dayTasks.map(task => {
                      const taskHour = new Date(task.dueDate).getHours();
                      const taskMinute = new Date(task.dueDate).getMinutes();
                      
                      // Position task based on time
                      const taskTop = ((taskHour - 8) * 60) + taskMinute;
                      const taskHeight = task.duration || 30; // Default to 30 min
                      
                      return (
                        <div 
                          key={task.id}
                          className={`task-item position-absolute rounded p-1 bg-${taskStatuses.find(s => s.value === task.status)?.color || 'secondary'} bg-opacity-10 border border-${taskStatuses.find(s => s.value === task.status)?.color || 'secondary'}`}
                          style={{ 
                            top: `${taskTop}px`, 
                            height: `${taskHeight}px`,
                            left: '1px',
                            right: '1px',
                            overflow: 'hidden',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="small text-truncate fw-bold">
                            {formatTime(task.dueDate)}
                          </div>
                          <div className="small text-truncate">
                            {task.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Render day view
  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate);
    
    return (
      <div className="calendar-day-view">
        <div className="d-flex">
          <div className="time-column" style={{ width: '80px' }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="time-slot text-end pe-2" style={{ height: '60px' }}>
                {(i + 7) % 12 === 0 ? 12 : (i + 7) % 12}{(i + 7) < 12 ? 'am' : 'pm'}
              </div>
            ))}
          </div>
          
          <div className="day-content flex-grow-1 position-relative" style={{ minHeight: '840px' }}>
            {/* Time slot grid */}
            {Array.from({ length: 14 }).map((_, i) => (
              <div 
                key={i} 
                className="time-slot border-bottom" 
                style={{ height: '60px' }}
              ></div>
            ))}
            
            {/* Tasks */}
            {dayTasks.map(task => {
              const taskHour = new Date(task.dueDate).getHours();
              const taskMinute = new Date(task.dueDate).getMinutes();
              
              // Position task based on time
              const taskTop = ((taskHour - 7) * 60) + taskMinute;
              const taskHeight = task.duration || 30; // Default to 30 min
              
              return (
                <div 
                  key={task.id}
                  className={`task-item position-absolute rounded p-2 bg-${taskStatuses.find(s => s.value === task.status)?.color || 'secondary'} bg-opacity-10 border border-${taskStatuses.find(s => s.value === task.status)?.color || 'secondary'}`}
                  style={{ 
                    top: `${taskTop}px`, 
                    height: `${taskHeight}px`,
                    left: '1px',
                    right: '1px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">
                        {formatTime(task.dueDate)}
                      </div>
                      <div>{task.title}</div>
                    </div>
                    <div>
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                  <div className="small text-muted mt-1">
                    {task.company.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Render task details modal
  const renderTaskModal = () => {
    if (!selectedTask) return null;
    
    return (
      <Modal 
        show={showTaskModal} 
        onHide={() => setShowTaskModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-start">
              <Button
                variant={selectedTask.status === 'completed' ? 'success' : 'outline-secondary'}
                className="rounded-circle p-2 me-3"
                onClick={(e) => {
                  handleToggleComplete(selectedTask.id, e);
                  setSelectedTask({
                    ...selectedTask,
                    status: selectedTask.status === 'completed' ? 'in_progress' : 'completed',
                    completedDate: selectedTask.status === 'completed' ? null : new Date()
                  });
                }}
              >
                {selectedTask.status === 'completed' ? <FaCheckCircle /> : <FaRegCircle />}
              </Button>
              <div>
                <h4 className="mb-1">{selectedTask.title}</h4>
                <div>
                  {getStatusBadge(selectedTask.status)}{' '}
                  {getPriorityBadge(selectedTask.priority)}
                </div>
              </div>
            </div>
            <div className="text-end">
              <div className="d-flex align-items-center text-muted mb-1">
                <FaCalendarAlt className="me-1" /> 
                <span>{formatDate(selectedTask.dueDate)}</span>
              </div>
              <div className="d-flex align-items-center text-muted">
                <FaClock className="me-1" /> 
                <span>{formatTime(selectedTask.dueDate)}</span>
              </div>
            </div>
          </div>
          
          <Row className="mb-3">
            <Col md={6}>
              <div className="mb-3">
                <div className="text-muted small">Assigned To</div>
                <div className="d-flex align-items-center">
                  <FaUserAlt className="me-2 text-primary" />
                  <span>{getAssigneeName(selectedTask.assignee)}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-muted small">Company</div>
                <div className="d-flex align-items-center">
                  <FaBuilding className="me-2 text-primary" />
                  <span>{selectedTask.company.name}</span>
                </div>
              </div>
              
              {selectedTask.contact && (
                <div className="mb-3">
                  <div className="text-muted small">Contact</div>
                  <div>{selectedTask.contact.name}</div>
                </div>
              )}
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <div className="text-muted small">Type</div>
                <div>{selectedTask.type.charAt(0).toUpperCase() + selectedTask.type.slice(1)}</div>
              </div>
              
              <div className="mb-3">
                <div className="text-muted small">Created</div>
                <div>{formatDate(selectedTask.createdDate)}</div>
              </div>
              
              {selectedTask.completedDate && (
                <div className="mb-3">
                  <div className="text-muted small">Completed</div>
                  <div>{formatDate(selectedTask.completedDate)}</div>
                </div>
              )}
            </Col>
          </Row>
          
          <div className="mb-3">
            <div className="text-muted small">Description</div>
            <div>{selectedTask.description}</div>
          </div>
          
          <div className="mb-3">
            <div className="text-muted small">Notes</div>
            <div>{selectedTask.notes}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowTaskModal(false)}
          >
            Close
          </Button>
          <Button 
            variant="outline-primary"
            as={Link}
            to={`/tasks/${selectedTask.id}`}
            onClick={() => setShowTaskModal(false)}
          >
            View Full Details
          </Button>
          <Button 
            variant="primary"
            as={Link}
            to={`/tasks/${selectedTask.id}/edit`}
            onClick={() => setShowTaskModal(false)}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title="Task Calendar"
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
            variant="outline-primary" 
            className="me-2"
            onClick={() => navigate('/tasks/kanban')}
          >
            <FaColumns className="me-1" /> Kanban
          </Button>
          <Button 
            variant="primary" 
            className="me-2"
          >
            <FaCalendarDay className="me-1" /> Calendar
          </Button>
        </div>
        <div>
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
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button 
                variant="light" 
                className="me-2"
                onClick={navigatePrevious}
              >
                <FaChevronLeft />
              </Button>
              <h4 className="mb-0">
                {calendarView === 'month' ? (
                  `${getMonthName(currentDate)} ${currentDate.getFullYear()}`
                ) : calendarView === 'week' ? (
                  `Week of ${formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()))}`
                ) : (
                  formatDate(currentDate)
                )}
              </h4>
              <Button 
                variant="light" 
                className="ms-2"
                onClick={navigateNext}
              >
                <FaChevronRight />
              </Button>
              <Button 
                variant="outline-primary"
                size="sm"
                className="ms-3"
                onClick={goToToday}
              >
                Today
              </Button>
            </div>
            
            <div className="btn-group">
              <Button 
                variant={calendarView === 'month' ? 'primary' : 'outline-primary'} 
                onClick={() => setCalendarView('month')}
              >
                Month
              </Button>
              <Button 
                variant={calendarView === 'week' ? 'primary' : 'outline-primary'} 
                onClick={() => setCalendarView('week')}
              >
                Week
              </Button>
              <Button 
                variant={calendarView === 'day' ? 'primary' : 'outline-primary'} 
                onClick={() => setCalendarView('day')}
              >
                Day
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading calendar...</p>
            </div>
          ) : (
            <>
              {calendarView === 'month' && renderMonthView()}
              {calendarView === 'week' && renderWeekView()}
              {calendarView === 'day' && renderDayView()}
            </>
          )}
        </Card.Body>
      </Card>
      
      {renderTaskModal()}
    </div>
  );
};

export default TaskCalendar;