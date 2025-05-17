import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Dropdown, Alert, Pagination } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaSortAmountDown, FaFilter, FaUpload, FaEllipsisV, 
         FaEye, FaPencilAlt, FaCalendarAlt, FaFileImport, FaDownload, FaTrash } from 'react-icons/fa';
import BackButton from '../common/BackButton';

const DriversList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [driversPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for drivers
  const [drivers, setDrivers] = useState([]);

  // Fetch drivers data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      const mockDrivers = [
        { 
          id: 1, 
          name: 'John Doe', 
          phone: '(555) 123-4567', 
          email: 'john.doe@example.com',
          vehicleType: 'Delivery Van', 
          licensePlate: 'ABC-1234',
          status: 'active',
          deliveries: {
            completed: 145,
            pending: 3,
            cancelled: 2
          },
          rating: 4.8,
          areasCovered: ['North Zone', 'Central Zone']
        },
        { 
          id: 2, 
          name: 'Jane Smith', 
          phone: '(555) 987-6543', 
          email: 'jane.smith@example.com',
          vehicleType: 'Cargo Truck', 
          licensePlate: 'XYZ-7890',
          status: 'active',
          deliveries: {
            completed: 203,
            pending: 0,
            cancelled: 5
          },
          rating: 4.9,
          areasCovered: ['South Zone', 'West Zone']
        },
        { 
          id: 3, 
          name: 'Bob Johnson', 
          phone: '(555) 456-7890', 
          email: 'bob.johnson@example.com',
          vehicleType: 'Compact Car', 
          licensePlate: 'DEF-4567',
          status: 'inactive',
          deliveries: {
            completed: 78,
            pending: 0,
            cancelled: 8
          },
          rating: 3.7,
          areasCovered: ['East Zone']
        },
        { 
          id: 4, 
          name: 'Sarah Williams', 
          phone: '(555) 789-0123', 
          email: 'sarah.williams@example.com',
          vehicleType: 'Delivery Van', 
          licensePlate: 'GHI-9012',
          status: 'active',
          deliveries: {
            completed: 112,
            pending: 2,
            cancelled: 1
          },
          rating: 4.6,
          areasCovered: ['North Zone', 'East Zone']
        },
        { 
          id: 5, 
          name: 'Mike Turner', 
          phone: '(555) 234-5678', 
          email: 'mike.turner@example.com',
          vehicleType: 'Cargo Truck', 
          licensePlate: 'JKL-3456',
          status: 'on-leave',
          deliveries: {
            completed: 89,
            pending: 0,
            cancelled: 3
          },
          rating: 4.5,
          areasCovered: ['West Zone', 'Central Zone']
        }
      ];
      
      setDrivers(mockDrivers);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter drivers based on search term and status filter
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort drivers
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    
    // Handle nested fields
    if (sortField === 'deliveries.completed') {
      fieldA = a.deliveries.completed;
      fieldB = b.deliveries.completed;
    }
    
    if (typeof fieldA === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    } else {
      return sortDirection === 'asc' 
        ? fieldA - fieldB 
        : fieldB - fieldA;
    }
  });

  // Pagination
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = sortedDrivers.slice(indexOfFirstDriver, indexOfLastDriver);
  const totalPages = Math.ceil(sortedDrivers.length / driversPerPage);

  // Helper function to display status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="danger">Inactive</Badge>;
      case 'on-leave':
        return <Badge bg="warning">On Leave</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next 
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Drivers</h1>
        <div>
          <Button 
            variant="outline-primary" 
            className="me-2"
            onClick={() => navigate('/drivers/import')}
          >
            <FaFileImport className="me-2" /> Import Drivers
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate('/drivers/new')}
          >
            <FaUserPlus className="me-2" /> Add New Driver
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <Row className="mb-4">
        <Col md={6} lg={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} lg={2}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col lg={6} className="d-flex justify-content-end mt-3 mt-lg-0">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-export">
              <FaDownload className="me-1" /> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Export as CSV</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Export as Excel</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Export as PDF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-secondary">
            <FaFilter className="me-1" /> Advanced Filter
          </Button>
        </Col>
      </Row>

      {/* Drivers Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading drivers...</p>
            </div>
          ) : currentDrivers.length === 0 ? (
            <Alert variant="info">
              No drivers found matching your search criteria. Try adjusting your filters or <Link to="/drivers/new">add a new driver</Link>.
            </Alert>
          ) : (
            <>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th 
                      onClick={() => handleSort('name')} 
                      style={{ cursor: 'pointer' }}
                    >
                      Name {sortField === 'name' && (
                        <FaSortAmountDown 
                          className={`ms-1 ${sortDirection === 'asc' ? 'text-muted' : ''}`}
                          style={{ transform: sortDirection === 'asc' ? 'rotate(180deg)' : '' }}
                        />
                      )}
                    </th>
                    <th>Contact</th>
                    <th>Vehicle</th>
                    <th 
                      onClick={() => handleSort('status')} 
                      style={{ cursor: 'pointer' }}
                    >
                      Status {sortField === 'status' && (
                        <FaSortAmountDown 
                          className={`ms-1 ${sortDirection === 'asc' ? 'text-muted' : ''}`}
                          style={{ transform: sortDirection === 'asc' ? 'rotate(180deg)' : '' }}
                        />
                      )}
                    </th>
                    <th 
                      onClick={() => handleSort('deliveries.completed')} 
                      style={{ cursor: 'pointer' }}
                    >
                      Deliveries {sortField === 'deliveries.completed' && (
                        <FaSortAmountDown 
                          className={`ms-1 ${sortDirection === 'asc' ? 'text-muted' : ''}`}
                          style={{ transform: sortDirection === 'asc' ? 'rotate(180deg)' : '' }}
                        />
                      )}
                    </th>
                    <th 
                      onClick={() => handleSort('rating')} 
                      style={{ cursor: 'pointer' }}
                    >
                      Rating {sortField === 'rating' && (
                        <FaSortAmountDown 
                          className={`ms-1 ${sortDirection === 'asc' ? 'text-muted' : ''}`}
                          style={{ transform: sortDirection === 'asc' ? 'rotate(180deg)' : '' }}
                        />
                      )}
                    </th>
                    <th>Areas Covered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                
<tbody>
  {currentDrivers.map(driver => (
    <tr 
      key={driver.id}
      onClick={() => navigate(`/drivers/${driver.id}`)}
      style={{ cursor: 'pointer' }}
      className="hover-highlight"
    >
      <td>
        <Link 
          to={`/drivers/${driver.id}`} 
          className="text-decoration-none"
          onClick={(e) => e.stopPropagation()} // Prevent double triggering
        >
          {driver.name}
        </Link>
      </td>
      <td>
        <div>{driver.phone}</div>
        <div className="text-muted small">{driver.email}</div>
      </td>
      <td>
        <div>{driver.vehicleType}</div>
        <div className="text-muted small">{driver.licensePlate}</div>
      </td>
      <td>{getStatusBadge(driver.status)}</td>
      <td>
        <div><span className="fw-bold">{driver.deliveries.completed}</span> completed</div>
        {driver.deliveries.pending > 0 && 
          <div className="text-warning small">{driver.deliveries.pending} pending</div>
        }
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="me-2">{driver.rating}</div>
          <div>
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(driver.rating) ? "text-warning" : "text-muted"}>★</span>
            ))}
          </div>
        </div>
      </td>
      <td>
        {driver.areasCovered.map(area => (
          <Badge key={area} bg="info" className="me-1">{area}</Badge>
        ))}
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <Dropdown>
          <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${driver.id}`} className="border">
            <FaEllipsisV />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={`/drivers/${driver.id}`}>
              <FaEye className="me-2" /> View Details
            </Dropdown.Item>
            <Dropdown.Item as={Link} to={`/drivers/${driver.id}/edit`}>
              <FaPencilAlt className="me-2" /> Edit
            </Dropdown.Item>
            <Dropdown.Item as={Link} to={`/drivers/${driver.id}/schedule`}>
              <FaCalendarAlt className="me-2" /> Schedule
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger">
              <FaTrash className="me-2" /> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  ))}
</tbody>
              </Table>
              {renderPagination()}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DriversList;