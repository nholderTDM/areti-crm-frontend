import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Table, Modal } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaPlus, FaClock, FaTruck, FaMapMarkerAlt, 
         FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import BackButton from '../common/BackButton';

const DriverSchedule = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'delivery',
    start: '',
    end: '',
    description: '',
    location: ''
  });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load driver data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock data for the driver
      const mockDriver = {
        id: parseInt(id),
        name: 'John Doe',
        phone: '(555) 123-4567',
        email: 'john.doe@example.com',
        status: 'active'
      };
      
      // Mock event data
      const mockEvents = [
        {
          id: 1,
          title: 'Delivery to ABC Corp',
          type: 'delivery',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 9, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 11, 0),
          description: 'Deliver 3 packages of office supplies',
          location: '123 Business St, Atlanta, GA',
          deliveryId: 'DEL-10032'
        },
        {
          id: 2,
          title: 'Delivery to XYZ Inc',
          type: 'delivery',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 14, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 16, 0),
          description: 'Deliver 2 large equipment packages',
          location: '456 Corporate Ave, Atlanta, GA',
          deliveryId: 'DEL-10035'
        },
        {
          id: 3,
          title: 'Safety Training',
          type: 'training',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 9, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 12, 0),
          description: 'Annual safety refresher course',
          location: 'Main Office - Training Room B'
        },
        {
          id: 4,
          title: 'Time Off',
          type: 'time-off',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 0, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17, 23, 59),
          description: 'Personal time off',
          location: 'N/A'
        },
        {
          id: 5,
          title: 'Vehicle Maintenance',
          type: 'maintenance',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 13, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 15, 0),
          description: 'Scheduled maintenance for delivery van',
          location: 'Fleet Service Center'
        }
      ];
      
      setDriver(mockDriver);
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, [id, currentDate]);

  // Handle form input changes for new events
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigate to previous month/week
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next month/week
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
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

  // Open modal to add new event
  const openAddEventModal = () => {
    setNewEvent({
      title: '',
      type: 'delivery',
      start: new Date().toISOString().slice(0, 16),
      end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
      description: '',
      location: ''
    });
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  // Open modal to edit event
  const openEditEventModal = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      type: event.type,
      start: event.start.toISOString().slice(0, 16),
      end: event.end.toISOString().slice(0, 16),
      description: event.description,
      location: event.location,
      deliveryId: event.deliveryId || ''
    });
    setShowEventModal(true);
  };

  // Save event (create or update)
  const saveEvent = () => {
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(event => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            title: newEvent.title,
            type: newEvent.type,
            start: new Date(newEvent.start),
            end: new Date(newEvent.end),
            description: newEvent.description,
            location: newEvent.location,
            deliveryId: newEvent.deliveryId
          };
        }
        return event;
      });
      setEvents(updatedEvents);
    } else {
      // Create new event
      const newId = Math.max(...events.map(e => e.id), 0) + 1;
      const createdEvent = {
        id: newId,
        title: newEvent.title,
        type: newEvent.type,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
        description: newEvent.description,
        location: newEvent.location,
        deliveryId: newEvent.deliveryId
      };
      setEvents([...events, createdEvent]);
    }
    
    setShowEventModal(false);
  };

  // Open delete confirmation modal
  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  // Delete event
  const deleteEvent = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
      setEvents(updatedEvents);
      setShowDeleteModal(false);
    }
  };

  // Get event badge color based on type
  const getEventBadgeColor = (type) => {
    switch (type) {
      case 'delivery':
        return 'primary';
      case 'training':
        return 'info';
      case 'maintenance':
        return 'warning';
      case 'time-off':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Generate month view
  const renderMonthView = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Get total days in month
    const daysInMonth = lastDay.getDate();
    
    // Create array for calendar days
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Group days into weeks
    const weeks = [];
    let week = [];
    
    days.forEach((day, index) => {
      week.push(day);
      
      if (index % 7 === 6 || index === days.length - 1) {
        // Fill remaining days in last week
        while (week.length < 7) {
          week.push(null);
        }
        
        weeks.push(week);
        week = [];
      }
    });
    
    // Get events for each day
    const getEventsForDay = (day) => {
      if (!day) return [];
      
      const dayDate = new Date(year, month, day);
      return events.filter(event => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year
        );
      });
    };
    
    return (
      <div className="calendar-month-view">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sunday</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex} style={{ height: '120px' }}>
                {week.map((day, dayIndex) => (
                  <td key={dayIndex} className={`${day ? '' : 'bg-light'}`}>
                    {day && (
                      <>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className={`calendar-day-number ${day === new Date().getDate() && 
                                                                month === new Date().getMonth() && 
                                                                year === new Date().getFullYear() ? 
                                                                'bg-primary text-white rounded-circle p-1' : ''}`}
                          >
                            {day}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline-secondary" 
                            className="btn-sm py-0 px-1"
                            onClick={openAddEventModal}
                          >
                            <FaPlus size={10} />
                          </Button>
                        </div>
                        <div className="calendar-day-events">
                          {getEventsForDay(day).map(event => (
                            <div 
                              key={event.id} 
                              className={`calendar-event bg-${getEventBadgeColor(event.type)} bg-opacity-10 text-${getEventBadgeColor(event.type)} mb-1 p-1 rounded small`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => openEditEventModal(event)}
                            >
                              {formatTime(event.start)} - {event.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Generate week view
  const renderWeekView = () => {
    // Get start of week (Sunday)
    const startDate = new Date(currentDate);
    const day = startDate.getDay();
    startDate.setDate(startDate.getDate() - day);
    
    // Create array of days for the week
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      weekDays.push(date);
    }
    
    // Get events for each day
    const getEventsForDay = (date) => {
      return events.filter(event => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
    };
    
    return (
      <div className="calendar-week-view">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Time</th>
              {weekDays.map((date, index) => (
                <th key={index} className={`text-center ${date.getDate() === new Date().getDate() && 
                                                          date.getMonth() === new Date().getMonth() && 
                                                          date.getFullYear() === new Date().getFullYear() ? 
                                                          'bg-light' : ''}`}>
                  <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className={`${date.getDate() === new Date().getDate() && 
                                    date.getMonth() === new Date().getMonth() && 
                                    date.getFullYear() === new Date().getFullYear() ? 
                                    'bg-primary text-white rounded-circle d-inline-block px-2' : ''}`}>
                    {date.getDate()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 13 }, (_, i) => i + 8).map(hour => (
              <tr key={hour} style={{ height: '60px' }}>
                <td className="hour-cell">
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </td>
                {weekDays.map((date, dayIndex) => {
                  const hourDate = new Date(date);
                  hourDate.setHours(hour, 0, 0, 0);
                  
                  const hoursEvents = getEventsForDay(date).filter(event => {
                    const eventHour = new Date(event.start).getHours();
                    return eventHour === hour;
                  });
                  
                  return (
                    <td key={dayIndex} className="position-relative">
                      {hoursEvents.map(event => (
                        <div 
                          key={event.id}
                          className={`calendar-event bg-${getEventBadgeColor(event.type)} bg-opacity-10 text-${getEventBadgeColor(event.type)} p-1 rounded small`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => openEditEventModal(event)}
                        >
                          <div className="fw-bold">
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </div>
                          <div>{event.title}</div>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render list view of upcoming events
  const renderUpcomingEvents = () => {
    const today = new Date();
    const futureEvents = events
      .filter(event => new Date(event.start) >= today)
      .sort((a, b) => new Date(a.start) - new Date(b.start));
    
    return (
      <div className="upcoming-events mt-4">
        <h5>Upcoming Events</h5>
        <Table responsive hover>
          <thead className="bg-light">
            <tr>
              <th>Date & Time</th>
              <th>Event</th>
              <th>Type</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {futureEvents.map(event => (
              <tr key={event.id}>
                <td>
                  <div>{new Date(event.start).toLocaleDateString()}</div>
                  <div className="text-muted small">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                </td>
                <td>
                  <div className="fw-bold">{event.title}</div>
                  <div className="small text-muted">{event.description}</div>
                </td>
                <td>
                  <Badge bg={getEventBadgeColor(event.type)}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                </td>
                <td>{event.location}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-1"
                    onClick={() => openEditEventModal(event)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => openDeleteModal(event)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {futureEvents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No upcoming events scheduled
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button 
            variant="outline-secondary" 
            className="me-3"
            as={Link}
            to={`/drivers/${id}`}
          >
            <FaArrowLeft /> <span className="d-none d-md-inline ms-1">Back to Driver</span>
          </Button>
          <h1 className="mb-0">
            {driver.name}'s Schedule
          </h1>
        </div>
        <div>
          <Button variant="primary" onClick={openAddEventModal}>
            <FaPlus className="me-1" /> Add Event
          </Button>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          {/* Calendar Controls */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={goToPrevious}
              >
                &laquo; Previous
              </Button>
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={goToToday}
              >
                Today
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={goToNext}
              >
                Next &raquo;
              </Button>
            </div>
            <h4 className="mb-0">
              {viewMode === 'month' ? formatDate(currentDate) : 
               viewMode === 'week' ? `Week of ${new Date(currentDate).toLocaleDateString()}` : 
               new Date(currentDate).toLocaleDateString()}
            </h4>
            <div className="btn-group">
              <Button 
                variant={viewMode === 'month' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button 
                variant={viewMode === 'week' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
            </div>
          </div>
          
          {/* Calendar View */}
          <div className="calendar">
            {viewMode === 'month' ? renderMonthView() : renderWeekView()}
          </div>
          
          {/* Upcoming Events List */}
          {renderUpcomingEvents()}
        </Card.Body>
      </Card>
      
      {/* Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Edit Event' : 'Add New Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Select
                name="type"
                value={newEvent.type}
                onChange={handleInputChange}
              >
                <option value="delivery">Delivery</option>
                <option value="training">Training</option>
                <option value="maintenance">Maintenance</option>
                <option value="time-off">Time Off</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="start"
                    value={newEvent.start}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="end"
                    value={newEvent.end}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {newEvent.type === 'delivery' && (
              <Form.Group className="mb-3">
                <Form.Label>Delivery ID</Form.Label>
                <Form.Control
                  type="text"
                  name="deliveryId"
                  value={newEvent.deliveryId || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. DEL-10032"
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEventModal(false)}>
            Cancel
          </Button>
          {selectedEvent && (
            <Button 
              variant="danger" 
              className="me-auto"
              onClick={() => {
                setShowEventModal(false);
                openDeleteModal(selectedEvent);
              }}
            >
              Delete Event
            </Button>
          )}
          <Button variant="primary" onClick={saveEvent}>
            {selectedEvent ? 'Update Event' : 'Add Event'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the event "{selectedEvent?.title}"?
          <div className="mt-2 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteEvent}>
            Delete Event
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DriverSchedule;