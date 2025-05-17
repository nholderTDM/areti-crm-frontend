import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, InputGroup, Row, Col, Badge, Modal, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, FaUserCircle, FaPhoneAlt, FaEnvelope, FaBuilding, FaTag, FaFileCsv } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';
import { formatPhoneForDisplay, getCallRedirectUrl } from '../../utils/phoneUtils';

const ContactList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);

  // Contact types
  const contactTypes = [
    { value: 'customer', label: 'Customer', color: 'success' },
    { value: 'vendor', label: 'Vendor', color: 'primary' },
    { value: 'partner', label: 'Partner', color: 'info' },
    { value: 'employee', label: 'Employee', color: 'secondary' },
    { value: 'prospect', label: 'Prospect', color: 'warning' },
    { value: 'other', label: 'Other', color: 'light' }
  ];

  // Mock data for contacts
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockContacts = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          company: 'ABC Logistics',
          email: 'john.doe@abclogistics.com',
          phone: '(555) 123-4567',
          mobile: '(555) 987-6543',
          type: 'customer',
          title: 'Operations Manager',
          address: '123 Main St, Atlanta, GA 30303',
          tags: ['vip', 'key-decision-maker'],
          assignedTo: 'Admin User',
          createdAt: new Date('2025-01-15T14:30:00'),
          updatedAt: new Date('2025-04-20T09:15:00'),
          lastContact: new Date('2025-04-20T09:15:00'),
          notes: 'Key decision maker for delivery services.'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          company: 'XYZ Retail',
          email: 'jane.smith@xyzretail.com',
          phone: '(555) 234-5678',
          mobile: '(555) 876-5432',
          type: 'customer',
          title: 'Logistics Director',
          address: '456 Oak St, Marietta, GA 30060',
          tags: ['frequent-contact'],
          assignedTo: 'Admin User',
          createdAt: new Date('2025-02-10T11:45:00'),
          updatedAt: new Date('2025-04-18T13:20:00'),
          lastContact: new Date('2025-04-18T13:20:00'),
          notes: 'Prefers communication via email. Quarterly business review scheduled for next month.'
        },
        {
          id: 3,
          firstName: 'Michael',
          lastName: 'Johnson',
          company: 'Johnson Freight Services',
          email: 'michael@johnsonfreight.com',
          phone: '(555) 345-6789',
          mobile: '(555) 765-4321',
          type: 'partner',
          title: 'Owner',
          address: '789 Peachtree St, Atlanta, GA 30308',
          tags: ['partner', 'referral-source'],
          assignedTo: 'Admin User',
          createdAt: new Date('2025-02-28T09:00:00'),
          updatedAt: new Date('2025-04-15T16:30:00'),
          lastContact: new Date('2025-04-15T16:30:00'),
          notes: 'Partnership agreement renewed in March. Sends referrals regularly.'
        },
        {
          id: 4,
          firstName: 'Sarah',
          lastName: 'Williams',
          company: 'City Express Delivery',
          email: 'sarah.williams@cityexpress.com',
          phone: '(555) 456-7890',
          mobile: '(555) 654-3210',
          type: 'vendor',
          title: 'Supplier Relations',
          address: '101 Pine Ave, Decatur, GA 30030',
          tags: ['vendor', 'supplies'],
          assignedTo: 'Admin User',
          createdAt: new Date('2025-03-05T13:15:00'),
          updatedAt: new Date('2025-04-10T10:45:00'),
          lastContact: new Date('2025-04-10T10:45:00'),
          notes: 'Supplies packaging materials. Volume discount negotiated for Q2.'
        },
        {
          id: 5,
          firstName: 'Robert',
          lastName: 'Brown',
          company: 'Tech Solutions Inc.',
          email: 'robert.brown@techsolutions.com',
          phone: '(555) 567-8901',
          mobile: '(555) 543-2109',
          type: 'vendor',
          title: 'Account Manager',
          address: '222 Maple Dr, Alpharetta, GA 30009',
          tags: ['vendor', 'technology'],
          assignedTo: 'Admin User',
          createdAt: new Date('2025-03-12T15:30:00'),
          updatedAt: new Date('2025-04-05T11:20:00'),
          lastContact: new Date('2025-04-05T11:20:00'),
          notes: 'Manages our tracking software account. Annual contract renewal in September.'
        },
        {
          id: 6,
          firstName: 'Emily',
          lastName: 'Davis',
          company: 'Davis Consulting',
          email: 'emily@davisconsulting.com',
          phone: '(555) 678-9012',
          mobile: '(555) 432-1098',
          type: 'partner',
          title: 'CEO',
          address: '333 Cedar Blvd, Roswell, GA 30076',
          tags: ['partner', 'influencer'],
          assignedTo: 'Admin User',
          createdAt: new Date('2025-03-20T10:00:00'),
          updatedAt: new Date('2025-04-02T14:15:00'),
          lastContact: new Date('2025-04-02T14:15:00'),
          notes: 'Potential co-marketing opportunity discussed in last meeting.'
        },
        {
          id: 7,
          firstName: 'Daniel',
          lastName: 'Wilson',
          company: 'Areti Alliance',
          email: 'daniel.wilson@aretialliance.com',
          phone: '(555) 789-0123',
          mobile: '(555) 321-0987',
          type: 'employee',
          title: 'Route Manager',
          address: '444 Elm St, Atlanta, GA 30307',
          tags: ['employee', 'management'],
          assignedTo: 'Admin User',
          createdAt: new Date('2025-01-05T09:30:00'),
          updatedAt: new Date('2025-03-28T16:45:00'),
          lastContact: new Date('2025-03-28T16:45:00'),
          notes: 'Manages the southeast region routes. Annual review scheduled for June.'
        },
        {
          id: 8,
          firstName: 'Lisa',
          lastName: 'Martinez',
          company: 'Global Shipping Co.',
          email: 'lisa.martinez@globalshipping.com',
          phone: '(555) 890-1234',
          mobile: '(555) 210-9876',
          type: 'prospect',
          title: 'Procurement Director',
          address: '555 Willow Ln, Smyrna, GA 30080',
          tags: ['prospect', 'high-value'],
          assignedTo: 'Admin User',
          createdAt: new Date('2025-04-01T11:30:00'),
          updatedAt: new Date('2025-04-01T11:30:00'),
          lastContact: new Date('2025-04-01T11:30:00'),
          notes: 'Interested in our services for international last-mile delivery. Follow up next week.'
        }
      ];
      
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
      
      // Extract companies for filter
      const uniqueCompanies = [...new Set(mockContacts.map(contact => contact.company))];
      setCompanies(uniqueCompanies);
      
      // Extract tags for filter
      const allTags = mockContacts.flatMap(contact => contact.tags);
      const uniqueTags = [...new Set(allTags)];
      setTags(uniqueTags);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort contacts
  useEffect(() => {
    let result = [...contacts];
    
    // Apply filters
    if (typeFilter !== 'all') {
      result = result.filter(contact => contact.type === typeFilter);
    }
    
    if (companyFilter !== 'all') {
      result = result.filter(contact => contact.company === companyFilter);
    }
    
    if (tagFilter !== 'all') {
      result = result.filter(contact => contact.tags.includes(tagFilter));
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(contact => 
        contact.firstName.toLowerCase().includes(search) ||
        contact.lastName.toLowerCase().includes(search) ||
        contact.company.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.phone.includes(search) ||
        (contact.title && contact.title.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
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
    
    setFilteredContacts(result);
  }, [contacts, searchTerm, typeFilter, companyFilter, tagFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

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
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  // Handle delete confirmation
  const confirmDelete = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (contactToDelete) {
      // In a real app, this would be an API call
      setContacts(contacts.filter(contact => contact.id !== contactToDelete.id));
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  // Render pagination
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

  return (
    <div>
      <PageTitle 
        title="Contacts" 
        subtitle="Manage your contact database"
        backButton={false}
        actionButton={true}
        actionButtonLink="/contacts/new"
        actionButtonText="Add Contact"
        actionButtonIcon={<FaPlus />}
      />

      <div className="mb-3">
        <Button 
          variant="outline-primary"
          className="me-2"
          as={Link}
          to="/contacts/import"
        >
          <FaFileCsv className="me-1" /> Import Contacts
        </Button>
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
                  placeholder="Search contacts..."
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
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {contactTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <InputGroup>
                <InputGroup.Text>
                  <FaBuilding />
                </InputGroup.Text>
                <Form.Select 
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <option value="all">All Companies</option>
                  {companies.map(company => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <InputGroup>
                <InputGroup.Text>
                  <FaTag />
                </InputGroup.Text>
                <Form.Select 
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <option value="all">All Tags</option>
                  {tags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
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
                  setTypeFilter('all');
                  setCompanyFilter('all');
                  setTagFilter('all');
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
              <p className="mt-3">Loading contacts...</p>
            </div>
          ) : (
            <>
              {filteredContacts.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No contacts found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/contacts/new')}
                  >
                    <FaPlus className="me-1" /> Add Contact
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('lastName')} style={{ cursor: 'pointer' }}>
                          Name {sortField === 'lastName' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>
                          Company {sortField === 'company' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Contact Info</th>
                        <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                          Title {sortField === 'title' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                          Type {sortField === 'type' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Tags</th>
                        <th onClick={() => handleSort('lastContact')} style={{ cursor: 'pointer' }}>
                          Last Contact {sortField === 'lastContact' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentContacts.map(contact => (
                        <tr key={contact.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaUserCircle className="me-2 text-secondary" size={24} />
                              <div>
                                <Link to={`/contacts/${contact.id}`} className="fw-bold text-decoration-none">
                                  {contact.firstName} {contact.lastName}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Link to={`/companies?name=${encodeURIComponent(contact.company)}`} className="text-decoration-none">
                              {contact.company}
                            </Link>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <div className="mb-1">
                                <FaEnvelope className="me-1 text-muted" />
                                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                              </div>
                              <div>
                                <FaPhoneAlt className="me-1 text-muted" />
                                <a href={getCallRedirectUrl(contact.phone)}>
  {formatPhoneForDisplay(contact.phone)}
</a>
                              </div>
                            </div>
                          </td>
                          <td>{contact.title || '—'}</td>
                          <td>{getTypeBadge(contact.type)}</td>
                          <td>
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
                          </td>
                          <td>{formatDate(contact.lastContact)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${contact.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/contacts/${contact.id}`}>
                                  <FaUserCircle className="me-2" /> View Details
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/contacts/${contact.id}/edit`}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => confirmDelete(contact)}
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
          Are you sure you want to delete the contact for{' '}
          <strong>{contactToDelete?.firstName} {contactToDelete?.lastName}</strong> from{' '}
          <strong>{contactToDelete?.company}</strong>?
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Contact
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactList;