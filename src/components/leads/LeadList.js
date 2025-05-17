import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, InputGroup, Row, Col, Badge, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, FaUserCircle, FaChartBar, FaPhone, FaLightbulb } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';
import { getLeads, deleteLead } from '../../services/leadService';
import ConfirmModal from '../common/ConfirmModal';
import Spinner from '../common/Spinner';
import ErrorAlert from '../common/ErrorAlert';
import { useAuth } from '../../context/AuthContext';
import { isLoggedIn } from '../../services/authService';
import MockDataToggle from '../common/MockDataToggle';
import axios from 'axios';

const LeadList = () => {
  const navigate = useNavigate();
  const { checkAuthState } = useAuth();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  
  // Sort states
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  
  // Confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  
  // Lead statuses and sources for filtering
  const leadStatuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New', color: 'primary' },
    { value: 'contacted', label: 'Contacted', color: 'info' },
    { value: 'qualified', label: 'Qualified', color: 'warning' },
    { value: 'proposal', label: 'Proposal', color: 'secondary' },
    { value: 'negotiation', label: 'Negotiation', color: 'dark' },
    { value: 'closed-won', label: 'Closed (Won)', color: 'success' },
    { value: 'closed-lost', label: 'Closed (Lost)', color: 'danger' }
  ];

  const leadSources = [
    { value: 'all', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email-campaign', label: 'Email Campaign' },
    { value: 'cold-call', label: 'Cold Call' },
    { value: 'lead-generator', label: 'Lead Generator' },
    { value: 'event', label: 'Event/Trade Show' },
    { value: 'other', label: 'Other' }
  ];
  
  // Authentication check on component mount
  useEffect(() => {
    // Verify auth is still valid
    const checkAuth = () => {
      const auth = isLoggedIn();
      if (!auth) {
        console.log('LeadsList: Auth missing, redirecting to login');
        navigate('/login');
        return false;
      }
      
      // Refresh auth context
      checkAuthState();
      return true;
    };
    
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) return;
    
    // Fetch leads data
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const data = await getLeads();
        setLeads(data || []);
        setFilteredLeads(data || []); // Initialize filteredLeads with the same data
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setLeads([]);
        setFilteredLeads([]); // Also set filteredLeads to empty array on error
        setError('Failed to load leads: ' + (error.message || error));
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, [navigate, checkAuthState]);
  // In LeadsList.js - add this in your useEffect for data loading
useEffect(() => {
  const loadLeads = async () => {
    try {
      // Try to get data from API first
      if (process.env.REACT_APP_USE_API === 'true') {
        const response = await axios.get('/api/leads');
        setLeads(response.data);
        setFilteredLeads(response.data);
      } else {
        // Fallback to localStorage
        const storedLeads = localStorage.getItem('crmLeads');
        if (storedLeads) {
          const parsedLeads = JSON.parse(storedLeads);
          setLeads(parsedLeads);
          setFilteredLeads(parsedLeads);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading leads:', error);
      // Fallback to localStorage on API error
      try {
        const storedLeads = localStorage.getItem('crmLeads');
        if (storedLeads) {
          const parsedLeads = JSON.parse(storedLeads);
          setLeads(parsedLeads);
          setFilteredLeads(parsedLeads);
        }
      } catch (localStorageError) {
        console.error('Error loading from localStorage:', localStorageError);
      }
      setIsLoading(false);
    }
  };
  
  loadLeads();
}, []);

  // Apply filters when search, status or source filters change
  useEffect(() => {
    if (!Array.isArray(leads)) {
      console.error('Leads is not an array:', leads);
      setFilteredLeads([]);
      return;
    }
    
    let result = [...leads];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(lead => {
        if (!lead) return false;
        
        const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
        const company = (lead.company || '').toLowerCase();
        const email = (lead.email || '').toLowerCase();
        
        return fullName.includes(term) || 
               company.includes(term) || 
               email.includes(term);
      });
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(lead => lead && lead.status === statusFilter);
    }
    
    // Apply source filter
    if (sourceFilter && sourceFilter !== 'all') {
      result = result.filter(lead => lead && lead.source === sourceFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (!a || !b) return 0;
      
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle nested fields
      if (sortField === 'firstName') {
        fieldA = a.firstName || '';
        fieldB = b.firstName || '';
      } else if (sortField === 'lastName') {
        fieldA = a.lastName || '';
        fieldB = b.lastName || '';
      } else if (sortField === 'assignedTo') {
        fieldA = a.assignedTo?.firstName || '';
        fieldB = b.assignedTo?.firstName || '';
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
      
      // Handle numbers or null values
      if ((fieldA === null || fieldA === undefined) && (fieldB === null || fieldB === undefined)) return 0;
      if (fieldA === null || fieldA === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (fieldB === null || fieldB === undefined) return sortDirection === 'asc' ? 1 : -1;
      
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });
    
    setFilteredLeads(result);
  }, [leads, searchTerm, statusFilter, sourceFilter, sortField, sortDirection]);
  
  // Handle filter changes
  const handleFilterChange = (filter, value) => {
    // Reset to first page when filters change
    setCurrentPage(1);
    
    if (filter === 'status') {
      setStatusFilter(value);
    } else if (filter === 'source') {
      setSourceFilter(value);
    } else if (filter === 'search') {
      setSearchTerm(value);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSourceFilter('all');
    setCurrentPage(1);
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
  
  // Handle delete confirmation
  const confirmDelete = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!leadToDelete) return;
    
    try {
      // Verify auth before making API call
      if (!isLoggedIn()) {
        navigate('/login');
        return;
      }
      
      await deleteLead(leadToDelete._id);
      
      // Update the lead list
      setLeads(leads.filter(lead => lead._id !== leadToDelete._id));
      setShowDeleteModal(false);
      setLeadToDelete(null);
    } catch (err) {
      // Check if this is an authentication error
      if (err.response && err.response.status === 401) {
        console.error('Authentication error deleting lead');
        // Force auth check
        checkAuthState();
        if (!isLoggedIn()) {
          navigate('/login');
          return;
        }
      }
      
      setError('Failed to delete lead: ' + (err.message || err));
      setShowDeleteModal(false);
    }
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status badge
  const getStatusBadge = (statusValue) => {
    const status = leadStatuses.find(s => s.value === statusValue);
    if (!status) return null;
    
    return (
      <Badge bg={status.color}>
        {status.label}
      </Badge>
    );
  };
  
  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = Array.isArray(filteredLeads) 
    ? filteredLeads.slice(indexOfFirstLead, indexOfLastLead) 
    : [];
  const totalPages = Math.ceil((filteredLeads?.length || 0) / leadsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (isLoading) {
    return <Spinner message="Loading leads..." />;
  }
  
  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="container-fluid py-4">
      <PageTitle 
        title="Leads"
        subtitle="Manage and track sales leads"
        backButton={false}
      />
      
      <div className="d-flex justify-content-between mb-4">
        <div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            as={Link}
            to="/leads/stats"
          >
            <FaChartBar className="me-1" /> Statistics
          </Button>
          <Button 
            variant="outline-info" 
            className="me-2"
            as={Link}
            to="/lead-generator"
          >
            <FaLightbulb className="me-1" /> Lead Generator
          </Button>
          <Button 
            variant="outline-warning"
            as={Link}
            to="/leads/script"
          >
            <FaPhone className="me-1" /> Script Navigator
          </Button>
        </div>
        <div className="d-flex align-items-center">
          {process.env.NODE_ENV === 'development' && (
            <div className="me-3">
              <MockDataToggle />
            </div>
          )}
          <Button 
            variant="primary"
            as={Link}
            to="/leads/new"
          >
            <FaPlus className="me-1" /> Add New Lead
          </Button>
        </div>
      </div>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select 
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {leadStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select 
                  value={sourceFilter}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                  {leadSources.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
          
          {!Array.isArray(filteredLeads) || filteredLeads.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">No leads found matching your filters.</p>
              <Button 
                variant="primary"
                as={Link}
                to="/leads/new"
              >
                <FaPlus className="me-1" /> Add New Lead
              </Button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>
                        Name {sortField === 'firstName' && (
                          <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                        )}
                      </th>
                      <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>
                        Company {sortField === 'company' && (
                          <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                        )}
                      </th>
                      <th>Contact</th>
                      <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                        Status {sortField === 'status' && (
                          <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                        )}
                      </th>
                      <th onClick={() => handleSort('source')} style={{ cursor: 'pointer' }}>
                        Source {sortField === 'source' && (
                          <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                        )}
                      </th>
                      <th onClick={() => handleSort('value')} style={{ cursor: 'pointer' }}>
                        Value {sortField === 'value' && (
                          <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                        )}
                      </th>
                      <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                        Created {sortField === 'createdAt' && (
                          <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                        )}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLeads.map((lead) => (
                      <tr 
                        key={lead._id} 
                        onClick={() => navigate(`/leads/${lead._id}`)}
                        style={{ cursor: 'pointer' }}
                        className="hover-highlight"
                      >
                        <td>
                          <div className="d-flex align-items-center">
                            <FaUserCircle className="me-2 text-secondary" size={24} />
                            <div>
                              <Link 
                                to={`/leads/${lead._id}`} 
                                className="fw-bold text-decoration-none"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lead.firstName} {lead.lastName}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td>{lead.company}</td>
                        <td>
                          <div className="small">
                            <div>{lead.email}</div>
                            <div>{lead.phone}</div>
                          </div>
                        </td>
                        <td>{getStatusBadge(lead.status)}</td>
                        <td>{leadSources.find(s => s.value === lead.source)?.label || lead.source}</td>
                        <td>${lead.value ? lead.value.toLocaleString() : '0'}</td>
                        <td>{formatDate(lead.createdAt)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${lead._id}`}>
                              <FaEllipsisV />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item 
                                as={Link} 
                                to={`/leads/${lead._id}`}
                              >
                                <FaUserCircle className="me-2" /> View Details
                              </Dropdown.Item>
                              <Dropdown.Item 
                                as={Link} 
                                to={`/leads/${lead._id}/edit`}
                              >
                                <FaPencilAlt className="me-2" /> Edit
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger"
                                onClick={() => confirmDelete(lead)}
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    />
                    
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete ${leadToDelete?.firstName} ${leadToDelete?.lastName} from ${leadToDelete?.company}? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default LeadList;