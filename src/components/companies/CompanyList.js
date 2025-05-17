import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, InputGroup, Row, Col, Badge, Modal, Pagination, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaSort, FaEllipsisV, FaTrash, FaPencilAlt, 
         FaBuilding, FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, 
         FaUserFriends, FaFileCsv, FaIndustry } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';
import { getCallRedirectUrl, formatPhoneForDisplay } from '../../utils/phoneUtils'; // Assuming you have a utility function for phone formatting

const CompanyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchName = searchParams.get('name') || '';
  
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchName);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  
  // Company types
  const companyTypes = [
    { value: 'customer', label: 'Customer', color: 'success' },
    { value: 'prospect', label: 'Prospect', color: 'warning' },
    { value: 'vendor', label: 'Vendor', color: 'primary' },
    { value: 'partner', label: 'Partner', color: 'info' },
    { value: 'competitor', label: 'Competitor', color: 'danger' },
    { value: 'other', label: 'Other', color: 'secondary' }
  ];
  
  // Company sizes
  const companySizes = [
    { value: 'solo', label: 'Solo (1)' },
    { value: 'micro', label: 'Micro (2-10)' },
    { value: 'small', label: 'Small (11-50)' },
    { value: 'medium', label: 'Medium (51-200)' },
    { value: 'large', label: 'Large (201-1000)' },
    { value: 'enterprise', label: 'Enterprise (1000+)' }
  ];

  // Mock data for companies
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCompanies = [
        {
          id: 1,
          name: 'ABC Logistics',
          industry: 'Transportation',
          type: 'customer',
          size: 'medium',
          website: 'www.abclogistics.com',
          phone: '(555) 123-4567',
          email: 'info@abclogistics.com',
          address: '123 Commerce St, Atlanta, GA 30303',
          revenue: '$5-10M',
          employees: 150,
          contacts: 5,
          createdAt: new Date('2023-05-15'),
          updatedAt: new Date('2025-03-20'),
          notes: 'Key customer for last-mile delivery services.',
          status: 'active'
        },
        {
          id: 2,
          name: 'XYZ Retail',
          industry: 'Retail',
          type: 'customer',
          size: 'large',
          website: 'www.xyzretail.com',
          phone: '(555) 234-5678',
          email: 'corporate@xyzretail.com',
          address: '456 Market Ave, Marietta, GA 30060',
          revenue: '$50-100M',
          employees: 850,
          contacts: 12,
          createdAt: new Date('2023-08-22'),
          updatedAt: new Date('2025-04-15'),
          notes: 'Multiple store locations across Georgia. Regular weekly deliveries.',
          status: 'active'
        },
        {
          id: 3,
          name: 'Tech Solutions Inc.',
          industry: 'Technology',
          type: 'vendor',
          size: 'small',
          website: 'www.techsolutions.io',
          phone: '(555) 345-6789',
          email: 'support@techsolutions.io',
          address: '789 Innovation Dr, Alpharetta, GA 30009',
          revenue: '$1-5M',
          employees: 45,
          contacts: 3,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2025-03-05'),
          notes: 'Provides our route optimization software.',
          status: 'active'
        },
        {
          id: 4,
          name: 'Global Shipping Co.',
          industry: 'Transportation',
          type: 'prospect',
          size: 'enterprise',
          website: 'www.globalshipping.com',
          phone: '(555) 456-7890',
          email: 'inquiries@globalshipping.com',
          address: '101 Harbor Blvd, Savannah, GA 31401',
          revenue: '$500M+',
          employees: 5000,
          contacts: 2,
          createdAt: new Date('2025-02-18'),
          updatedAt: new Date('2025-04-02'),
          notes: 'Potential partnership for international shipping handoffs.',
          status: 'active'
        },
        {
          id: 5,
          name: 'Fast Track Couriers',
          industry: 'Transportation',
          type: 'competitor',
          size: 'small',
          website: 'www.fasttrackdelivery.com',
          phone: '(555) 567-8901',
          email: 'info@fasttrackdelivery.com',
          address: '222 Speedway St, Atlanta, GA 30318',
          revenue: '$1-5M',
          employees: 30,
          contacts: 0,
          createdAt: new Date('2024-11-05'),
          updatedAt: new Date('2025-01-20'),
          notes: 'Local competitor focused on same-day delivery.',
          status: 'active'
        },
        {
          id: 6,
          name: 'Metro Electronics',
          industry: 'Electronics',
          type: 'customer',
          size: 'medium',
          website: 'www.metroelectronics.com',
          phone: '(555) 678-9012',
          email: 'sales@metroelectronics.com',
          address: '333 Circuit Ave, Duluth, GA 30096',
          revenue: '$10-50M',
          employees: 175,
          contacts: 7,
          createdAt: new Date('2024-03-12'),
          updatedAt: new Date('2025-04-10'),
          notes: 'Frequent deliveries of high-value electronics. Requires special handling.',
          status: 'active'
        },
        {
          id: 7,
          name: 'Green Valley Farms',
          industry: 'Agriculture',
          type: 'customer',
          size: 'small',
          website: 'www.greenvalleyfarms.com',
          phone: '(555) 789-0123',
          email: 'contact@greenvalleyfarms.com',
          address: '444 Rural Route, Macon, GA 31201',
          revenue: '$1-5M',
          employees: 25,
          contacts: 3,
          createdAt: new Date('2024-08-30'),
          updatedAt: new Date('2025-02-15'),
          notes: 'Weekly deliveries of fresh produce to metro Atlanta restaurants.',
          status: 'active'
        },
        {
          id: 8,
          name: 'City Express',
          industry: 'Transportation',
          type: 'partner',
          size: 'micro',
          website: 'www.cityexpress.net',
          phone: '(555) 890-1234',
          email: 'dispatch@cityexpress.net',
          address: '555 Urban Dr, Atlanta, GA 30308',
          revenue: '$500K-1M',
          employees: 10,
          contacts: 2,
          createdAt: new Date('2025-01-05'),
          updatedAt: new Date('2025-03-22'),
          notes: 'Local partner for downtown Atlanta deliveries during peak times.',
          status: 'active'
        }
      ];
      
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      
      // Extract unique industries for filter
      const uniqueIndustries = [...new Set(mockCompanies.map(company => company.industry))];
      setIndustries(uniqueIndustries);
      
      // If there was a search param in the URL, filter companies
      if (initialSearchName) {
        const filtered = mockCompanies.filter(company => 
          company.name.toLowerCase().includes(initialSearchName.toLowerCase())
        );
        setFilteredCompanies(filtered);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [initialSearchName]);

  // Filter and sort companies
  useEffect(() => {
    let result = [...companies];
    
    // Apply filters
    if (industryFilter !== 'all') {
      result = result.filter(company => company.industry === industryFilter);
    }
    
    if (typeFilter !== 'all') {
      result = result.filter(company => company.type === typeFilter);
    }
    
    if (sizeFilter !== 'all') {
      result = result.filter(company => company.size === sizeFilter);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(company => 
        company.name.toLowerCase().includes(search) ||
        company.industry.toLowerCase().includes(search) ||
        company.email.toLowerCase().includes(search) ||
        company.phone.includes(search) ||
        company.address.toLowerCase().includes(search)
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
    
    setFilteredCompanies(result);
  }, [companies, searchTerm, industryFilter, typeFilter, sizeFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

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
    const type = companyTypes.find(t => t.value === typeValue);
    return type ? (
      <Badge bg={type.color} className="text-uppercase">
        {type.label}
      </Badge>
    ) : null;
  };
  
  // Get size label
  const getSizeLabel = (sizeValue) => {
    const size = companySizes.find(s => s.value === sizeValue);
    return size ? size.label : sizeValue;
  };

  // Handle delete confirmation
  const confirmDelete = (company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (companyToDelete) {
      // In a real app, this would be an API call
      setCompanies(companies.filter(company => company.id !== companyToDelete.id));
      setShowDeleteModal(false);
      setCompanyToDelete(null);
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
        title="Companies" 
        subtitle="Manage your organization database"
        backButton={false}
        actionButton={true}
        actionButtonLink="/companies/new"
        actionButtonText="Add Company"
        actionButtonIcon={<FaPlus />}
      />

      <div className="mb-3">
        <Button 
          variant="outline-primary"
          className="me-2"
          as={Link}
          to="/companies/import"
        >
          <FaFileCsv className="me-1" /> Import Companies
        </Button>
      </div>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaIndustry />
                </InputGroup.Text>
                <Form.Select 
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                >
                  <option value="all">All Industries</option>
                  {industries.map((industry, index) => (
                    <option key={index} value={industry}>{industry}</option>
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
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {companyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <InputGroup>
                <InputGroup.Text>
                  <FaUserFriends />
                </InputGroup.Text>
                <Form.Select 
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                >
                  <option value="all">All Sizes</option>
                  {companySizes.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
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
                  setIndustryFilter('all');
                  setTypeFilter('all');
                  setSizeFilter('all');
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
              <p className="mt-3">Loading companies...</p>
            </div>
          ) : (
            <>
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No companies found matching your filters.</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/companies/new')}
                  >
                    <FaPlus className="me-1" /> Add Company
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                          Company {sortField === 'name' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('industry')} style={{ cursor: 'pointer' }}>
                          Industry {sortField === 'industry' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Contact Info</th>
                        <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                          Type {sortField === 'type' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('size')} style={{ cursor: 'pointer' }}>
                          Size {sortField === 'size' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('contacts')} style={{ cursor: 'pointer' }}>
                          Contacts {sortField === 'contacts' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th onClick={() => handleSort('updatedAt')} style={{ cursor: 'pointer' }}>
                          Last Updated {sortField === 'updatedAt' && (
                            <FaSort className={`ms-1 text-${sortDirection === 'asc' ? 'muted' : 'dark'}`} />
                          )}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCompanies.map(company => (
                        <tr key={company.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded p-2 me-2">
                                <FaBuilding className="text-secondary" />
                              </div>
                              <div>
                                <Link to={`/companies/${company.id}`} className="fw-bold text-decoration-none">
                                  {company.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td>{company.industry}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <div className="mb-1">
                                <FaEnvelope className="me-1 text-muted" />
                                <a href={`mailto:${company.email}`}>{company.email}</a>
                              </div>
                              <div className="mb-1">
                                <FaPhoneAlt className="me-1 text-muted" />
                                <a href={getCallRedirectUrl(company.phone)}>
  {formatPhoneForDisplay(company.phone)}
</a>
                              </div>
                              <div>
                                <FaGlobe className="me-1 text-muted" />
                                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                                  {company.website}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td>{getTypeBadge(company.type)}</td>
                          <td>{getSizeLabel(company.size)}</td>
                          <td>
                            <Link to={`/contacts?company=${encodeURIComponent(company.name)}`}>
                              {company.contacts} contacts
                            </Link>
                          </td>
                          <td>{formatDate(company.updatedAt)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${company.id}`}>
                                <FaEllipsisV />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/companies/${company.id}`}>
                                  <FaBuilding className="me-2" /> View Details
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/companies/${company.id}/edit`}>
                                  <FaPencilAlt className="me-2" /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/contacts?company=${encodeURIComponent(company.name)}`}>
                                  <FaUserFriends className="me-2" /> View Contacts
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => confirmDelete(company)}
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
          Are you sure you want to delete the company <strong>{companyToDelete?.name}</strong>?
          
          {companyToDelete?.contacts > 0 && (
            <div className="mt-2 text-warning">
              <strong>Warning:</strong> This company has {companyToDelete.contacts} associated contacts. 
              Deleting this company will not delete these contacts, but they will no longer be associated 
              with this company.
            </div>
          )}
          
          <div className="mt-3 text-danger">
            This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Company
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyList;