import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Spinner, Tabs, Tab, InputGroup, Modal } from 'react-bootstrap';
import { FaSearch, FaFilter, FaSave, FaExternalLinkAlt, FaEnvelope, FaPhone, FaStar, FaUserPlus, FaPlus } from 'react-icons/fa';
import BackButton from '../common/BackButton';
import PageTitle from '../common/PageTitle';
import axios from 'axios';
import { formatPhoneForDisplay, getCallRedirectUrl } from '../../utils/phoneUtils';
import PhoneContact from '../common/PhoneContact';

const LeadGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState(['Independent Contract Driver']);
  const [selectedLocation, setSelectedLocation] = useState('Atlanta, GA');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [savedLeads, setSavedLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [filterRating, setFilterRating] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [searchHistory, setSearchHistory] = useState([]);
  const [favoriteKeywords, setFavoriteKeywords] = useState([]);
  const [customKeyword, setCustomKeyword] = useState('');
  
  // Convert to Lead Modal states
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertingLead, setConvertingLead] = useState(null);
  const [convertedLeadData, setConvertedLeadData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    title: '',
    type: 'prospect',
    source: 'job-board',
    status: 'new',
    notes: '',
    tags: []
  });
  const [convertSuccess, setConvertSuccess] = useState(false);

  // Predefined keywords for searching
  const predefinedKeywords = [
    'Independent Contract Driver',
    'Owner Operator',
    'Owner Operator Cargo Van',
    'Owner Operator Sprinter',
    'Owner Operator Box Truck',
    '1099 Courier',
    '1099 Driver',
    'Delivery Service Provider',
    'Last Mile Delivery',
    'Contract Delivery Driver',
    'Independent Contractor Route'
  ];

  // Predefined locations
  const predefinedLocations = [
    'Atlanta, GA',
    'McDonough, GA',
    'Columbus, GA',
    'Savannah, GA',
    'Macon, GA',
    'Augusta, GA',
    'Athens, GA',
    'Marietta, GA',
    'Roswell, GA',
    'Albany, GA'
  ];

  // Predefined sources
  const sources = [
    { id: 'all', name: 'All Sources' },
    { id: 'indeed', name: 'Indeed' },
    { id: 'ziprecruiter', name: 'ZipRecruiter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'craigslist', name: 'Craigslist' },
    { id: 'glassdoor', name: 'Glassdoor' },
    { id: 'monster', name: 'Monster' },
    { id: 'careerbuilder', name: 'CareerBuilder' },
    { id: 'google', name: 'Google Jobs' },
    { id: 'github', name: 'GitHub Jobs' },
    { id: 'usajobs', name: 'USA Jobs' }
  ];

  // Lead types options for convert modal
  const leadTypes = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'qualified', label: 'Qualified Lead' },
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'customer', label: 'Customer' },
    { value: 'partner', label: 'Partner' }
  ];

  // Using useEffect to load saved leads from localStorage on component mount
  useEffect(() => {
    const loadSavedLeads = () => {
      try {
        const savedLeadsData = localStorage.getItem('savedLeads');
        if (savedLeadsData) {
          setSavedLeads(JSON.parse(savedLeadsData));
        }
        
        const savedKeywords = localStorage.getItem('favoriteKeywords');
        if (savedKeywords) {
          setFavoriteKeywords(JSON.parse(savedKeywords));
        }
      } catch (error) {
        console.error('Error loading saved data from localStorage:', error);
      }
    };
    
    loadSavedLeads();
    
    // Check if API is available
    const checkApiStatus = async () => {
      try {
        const response = await axios.get('/api/health');
        console.log('API Status:', response.status);
      } catch (error) {
        console.warn('API health check failed. Using mock data:', error);
      }
    };
    
    checkApiStatus();
  }, []);

  // Save leads to localStorage whenever savedLeads changes
  useEffect(() => {
    localStorage.setItem('savedLeads', JSON.stringify(savedLeads));
  }, [savedLeads]);
  
  // Save favorite keywords to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteKeywords', JSON.stringify(favoriteKeywords));
  }, [favoriteKeywords]);

  // Search function - now updated to use axios
  const performSearch = () => {
    setIsLoading(true);
    
    // If API integration is complete, use this:
    if (process.env.REACT_APP_USE_API === 'true') {
      // Create query params
      const queryParams = new URLSearchParams();
      if (selectedKeywords.length > 0) {
        queryParams.append('keywords', JSON.stringify(selectedKeywords));
      }
      if (selectedLocation) {
        queryParams.append('location', selectedLocation);
      }
      if (selectedSource !== 'all') {
        queryParams.append('source', selectedSource);
      }
      
      // Make API call to our backend
      axios.get(`/api/jobs/search?${queryParams.toString()}`)
        .then(response => {
          setSearchResults(response.data);
          
          // Add to search history
          addToSearchHistory(response.data.length);
        })
        .catch(error => {
          console.error('Error searching for jobs:', error);
          alert('An error occurred while searching for jobs. Please try again later.');
          
          // Fallback to mock data in case of error
          mockSearchWithDelay();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Use mock data for now
      mockSearchWithDelay();
    }
  };
  
  // Mock search function with delay to simulate API call
  const mockSearchWithDelay = () => {
    setTimeout(() => {
      // Filtering based on selected criteria
      const filteredResults = mockSearchResults.filter(job => {
        // Filter by location
        const locationMatch = job.location.toLowerCase().includes(selectedLocation.toLowerCase());
        
        // Filter by keyword
        const keywordMatch = selectedKeywords.some(keyword => 
          job.title.toLowerCase().includes(keyword.toLowerCase()) || 
          job.description.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // Filter by source
        const sourceMatch = selectedSource === 'all' || job.source === selectedSource;
        
        return locationMatch && keywordMatch && sourceMatch;
      });
      
      setSearchResults(filteredResults);
      
      // Add to search history
      addToSearchHistory(filteredResults.length);
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Helper function to add to search history
  const addToSearchHistory = (resultsCount) => {
    setSearchHistory(prev => {
      // Create a new history item
      const newHistory = {
        id: Date.now(),
        keywords: [...selectedKeywords],
        location: selectedLocation,
        source: selectedSource,
        resultsCount: resultsCount,
        date: new Date().toLocaleString()
      };
      
      // Add to the beginning of the array and keep only the most recent 10
      return [newHistory, ...prev].slice(0, 10);
    });
  };

  // Handle selecting/deselecting a keyword
  const toggleKeyword = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };
  
  // Toggle a keyword as favorite
  const toggleFavoriteKeyword = (keyword) => {
    if (favoriteKeywords.includes(keyword)) {
      setFavoriteKeywords(favoriteKeywords.filter(k => k !== keyword));
    } else {
      setFavoriteKeywords([...favoriteKeywords, keyword]);
    }
  };

  // Save a lead
  const saveLead = (lead) => {
    // Check if lead is already saved
    if (!savedLeads.some(savedLead => savedLead.id === lead.id)) {
      setSavedLeads([...savedLeads, { ...lead, savedDate: new Date().toLocaleString() }]);
    }
  };

  // Remove a saved lead
  const removeSavedLead = (leadId) => {
    setSavedLeads(savedLeads.filter(lead => lead.id !== leadId));
  };

  // Filter saved leads
  const filteredSavedLeads = savedLeads.filter(lead => {
    const ratingMatch = filterRating === 'all' || lead.rating >= parseInt(filterRating);
    const sourceMatch = filterSource === 'all' || lead.source === filterSource;
    const searchMatch = searchTerm === '' || 
      lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return ratingMatch && sourceMatch && searchMatch;
  });

  // Render star rating (now using FaStar icon)
  const renderRating = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-warning" : "text-muted"} 
        style={{ marginRight: '2px' }}
      />
    ));
  };

  // Get source name from id
  const getSourceName = (sourceId) => {
    const source = sources.find(s => s.id === sourceId);
    return source ? source.name : sourceId;
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedKeywords(['Independent Contract Driver']);
    setSelectedLocation('Atlanta, GA');
    setSelectedSource('all');
  };
  
  // Add a custom keyword
  const addCustomKeyword = () => {
    if (customKeyword && !selectedKeywords.includes(customKeyword)) {
      setSelectedKeywords([...selectedKeywords, customKeyword]);
      setCustomKeyword('');
    }
  };

  // Open convert to lead modal
  const openConvertModal = (lead) => {
    setConvertingLead(lead);
    
    // Try to extract name from the job title or company
    let firstName = '';
    let lastName = '';
    
    // Auto-fill form data from the job posting
    setConvertedLeadData({
      firstName,
      lastName,
      company: lead.company,
      email: '',
      phone: lead.phone || '',
      title: lead.title,
      type: 'prospect',
      source: lead.source,
      status: 'new',
      notes: `Job Description: ${lead.description}\n\nRequirements: ${lead.requirements.join(', ')}\n\nPay: ${lead.pay}\n\nOriginal posting: ${lead.url}`,
      tags: [lead.source, 'job-lead', ...selectedKeywords.slice(0, 3)]
    });
    
    setShowConvertModal(true);
    setConvertSuccess(false);
  };
  
  // Handle convert form input changes
  const handleConvertInputChange = (e) => {
    const { name, value } = e.target;
    setConvertedLeadData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle tags input (comma-separated)
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setConvertedLeadData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };
  
  // Submit converted lead
const submitConvertedLead = async () => {
  try {
    // Validate required fields
    if (!convertedLeadData.firstName || !convertedLeadData.lastName) {
      alert('First name and last name are required');
      return;
    }
    
    // Format the lead data with a unique ID
    const newLead = {
      ...convertedLeadData,
      id: Date.now().toString(), // Generate a unique ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    };
    
    // If API integration is ready, use this:
    if (process.env.REACT_APP_USE_API === 'true') {
      const response = await axios.post('/api/leads', newLead);
      console.log('Lead created:', response.data);
    } else {
      // For demo purposes, save to localStorage
      // Get existing leads from localStorage
      let existingLeads = [];
      try {
        const storedLeads = localStorage.getItem('crmLeads');
        if (storedLeads) {
          existingLeads = JSON.parse(storedLeads);
        }
      } catch (error) {
        console.error('Error parsing leads from localStorage:', error);
      }
      
      // Add new lead to the array
      existingLeads.push(newLead);
      
      // Save updated leads array back to localStorage
      localStorage.setItem('crmLeads', JSON.stringify(existingLeads));
      console.log('New lead saved to localStorage:', newLead);
    }
    
    // Show success state
    setConvertSuccess(true);
    
    // Remove from saved leads list (optional)
    if (convertingLead) {
      removeSavedLead(convertingLead.id);
    }
    
    // Close modal after success
    setTimeout(() => {
      setShowConvertModal(false);
      setConvertingLead(null);
    }, 2000);
    
  } catch (error) {
    console.error('Error creating lead:', error);
    alert('An error occurred while creating the lead. Please try again.');
  }
};

  return (
    <Container fluid className="py-4">
      {/* Using BackButton directly instead of through PageTitle */}
      <div className="d-flex align-items-center mb-3">
        <BackButton />
        <div className="ms-3">
          <h1 className="mb-0">Lead Generator</h1>
          <p className="text-muted">Find and qualify new leads</p>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="search" title="Search Leads">
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Form>
                <Row className="mb-4">
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Keywords (select one or more)</Form.Label>
                      <div className="d-flex flex-wrap">
                        {predefinedKeywords.map((keyword, index) => (
                          <Button
                            key={index}
                            variant={selectedKeywords.includes(keyword) ? "primary" : "outline-secondary"}
                            size="sm"
                            className="me-2 mb-2"
                            onClick={() => toggleKeyword(keyword)}
                          >
                            {keyword}
                            {favoriteKeywords.includes(keyword) && (
                              <FaStar className="ms-1 text-warning" />
                            )}
                          </Button>
                        ))}
                      </div>
                      
                      {/* Custom keyword input - using FaPlus */}
                      <InputGroup className="mt-2">
                        <Form.Control
                          placeholder="Add custom keyword..."
                          value={customKeyword}
                          onChange={(e) => setCustomKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomKeyword()}
                        />
                        <Button 
                          variant="outline-secondary" 
                          onClick={addCustomKeyword}
                          disabled={!customKeyword}
                        >
                          <FaPlus /> Add
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Select 
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                      >
                        {predefinedLocations.map((location, index) => (
                          <option key={index} value={location}>{location}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Source</Form.Label>
                      <Form.Select 
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                      >
                        {sources.map((source) => (
                          <option key={source.id} value={source.id}>{source.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={1} className="d-flex align-items-end mb-3">
                    <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <div className="selected-filters">
                    <p className="mb-0"><strong>Selected:</strong> {selectedKeywords.join(', ')} in {selectedLocation}</p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={performSearch} 
                    disabled={isLoading || selectedKeywords.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Searching...
                      </>
                    ) : (
                      <>
                        <FaSearch className="me-2" /> Search for Leads
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Search Results ({searchResults.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {searchResults.map((result) => (
                  <div key={result.id} className="lead-card p-3 border-bottom">
                    <Row>
                      <Col md={8}>
                        <h5 className="mb-1">{result.title}</h5>
                        <p className="mb-1">
                          <strong>{result.company}</strong> - {result.location}
                        </p>
                        <div className="mb-2 text-muted small">
                          <span className="me-3">Source: {getSourceName(result.source)}</span>
                          <span className="me-3">Posted: {result.postedDate}</span>
                          <span>
                            {renderRating(result.rating)}
                            <Button 
                              variant="link" 
                              className="p-0 ms-2" 
                              onClick={() => toggleFavoriteKeyword(result.title.split(' ')[0])}
                              title="Add keyword to favorites"
                            >
                              <FaStar 
                                className={favoriteKeywords.includes(result.title.split(' ')[0]) ? "text-warning" : "text-muted"}
                                size={12}
                              />
                            </Button>
                          </span>
                        </div>
                        <p className="mb-2">{result.description}</p>
                        <div className="mb-2">
                          <strong>Pay:</strong> {result.pay}
                        </div>
                        <div className="mb-2">
                          <strong>Requirements:</strong>
                          <ul className="mb-0 ps-3">
                            {result.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                      <Col md={4} className="d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-end mb-3">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            href={result.url} 
                            target="_blank" 
                            className="me-2"
                          >
                            <FaExternalLinkAlt className="me-1" /> View Original
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => saveLead(result)}
                            disabled={savedLeads.some(lead => lead.id === result.id)}
                          >
                            <FaSave className="me-1" /> {savedLeads.some(lead => lead.id === result.id) ? 'Saved' : 'Save Lead'}
                          </Button>
                        </div>
                        <div className="d-flex mt-3 justify-content-end">
                          <Button variant="outline-success" size="sm" className="me-2">
                            <FaEnvelope className="me-1" /> Email
                          </Button>
                          {result.phone && (
                            <PhoneContact phoneNumber={result.phone} buttonVariant="outline-info" />
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Recent Searches</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Date</th>
                      <th>Keywords</th>
                      <th>Location</th>
                      <th>Source</th>
                      <th>Results</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchHistory.map((history) => (
                      <tr key={history.id}>
                        <td>{history.date}</td>
                        <td>{history.keywords.join(', ')}</td>
                        <td>{history.location}</td>
                        <td>{getSourceName(history.source)}</td>
                        <td>{history.resultsCount}</td>
                        <td>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0" 
                            onClick={() => {
                              setSelectedKeywords(history.keywords);
                              setSelectedLocation(history.location);
                              setSelectedSource(history.source);
                              performSearch();
                            }}
                          >
                            Run Again
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Tab>

        <Tab eventKey="saved" title={`Saved Leads (${savedLeads.length})`}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search saved leads..."
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
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaFilter />
                    </InputGroup.Text>
                    <Form.Select 
                      value={filterSource}
                      onChange={(e) => setFilterSource(e.target.value)}
                    >
                      <option value="all">All Sources</option>
                      {sources.filter(s => s.id !== 'all').map((source) => (
                        <option key={source.id} value={source.id}>{source.name}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterRating('all');
                      setFilterSource('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {filteredSavedLeads.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Saved Leads ({filteredSavedLeads.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {filteredSavedLeads.map((lead) => (
                  <div key={lead.id} className="lead-card p-3 border-bottom">
                    <Row>
                      <Col md={8}>
                        <div className="d-flex justify-content-between">
                          <h5 className="mb-1">{lead.title}</h5>
                          <Badge bg="primary">Saved {lead.savedDate}</Badge>
                        </div>
                        <p className="mb-1">
                          <strong>{lead.company}</strong> - {lead.location}
                        </p>
                        <div className="mb-2 text-muted small">
                          <span className="me-3">Source: {getSourceName(lead.source)}</span>
                          <span className="me-3">Posted: {lead.postedDate}</span>
                          <span>{renderRating(lead.rating)}</span>
                        </div>
                        <p className="mb-2">{lead.description}</p>
                        <div className="mb-2">
                          <strong>Pay:</strong> {lead.pay}
                        </div>
                        <div className="mb-2">
                          <strong>Requirements:</strong>
                          <ul className="mb-0 ps-3">
                            {lead.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                      <Col md={4} className="d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-end mb-3">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            href={lead.url} 
                            target="_blank" 
                            className="me-2"
                          >
                            <FaExternalLinkAlt className="me-1" /> View Original
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => removeSavedLead(lead.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="d-flex mt-3 justify-content-end">
                          <Button variant="outline-success" size="sm" className="me-2">
                            <FaEnvelope className="me-1" /> Contact
                          </Button>
                          {lead.phone && (
                            <PhoneContact phoneNumber={lead.phone} buttonVariant="outline-info" />
                          )}
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="ms-2"
                            onClick={() => openConvertModal(lead)}
                          >
                            <FaUserPlus className="me-1" /> Convert to Lead
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <h5 className="text-muted mb-3">No saved leads found</h5>
                <p>Save leads from your search results to view them here.</p>
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('search')}
                >
                  <FaSearch className="me-2" /> Search for Leads
                </Button>
              </Card.Body>
            </Card>
          )}
        </Tab>
      </Tabs>

      {/* Convert to Lead Modal */}
      <Modal
        show={showConvertModal}
        onHide={() => !convertSuccess && setShowConvertModal(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton={!convertSuccess}>
          <Modal.Title>{convertSuccess ? 'Lead Created Successfully!' : 'Convert to CRM Lead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {convertSuccess ? (
            <div className="text-center py-4">
              <div className="mb-3 text-success" style={{ fontSize: '3rem' }}>
                <FaUserPlus />
              </div>
              <h4>Lead Created Successfully!</h4>
              <p>The job lead has been converted and added to your CRM system.</p>
              <Button 
                variant="primary" 
                onClick={() => setShowConvertModal(false)}
                className="mt-3"
              >
                Close
              </Button>
            </div>
          ) : (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name*</Form.Label>
                    <Form.Control 
                      type="text"
                      name="firstName"
                      value={convertedLeadData.firstName}
                      onChange={handleConvertInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name*</Form.Label>
                    <Form.Control 
                      type="text"
                      name="lastName"
                      value={convertedLeadData.lastName}
                      onChange={handleConvertInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control 
                  type="text"
                  name="company"
                  value={convertedLeadData.company}
                  onChange={handleConvertInputChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email"
                      name="email"
                      value={convertedLeadData.email}
                      onChange={handleConvertInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control 
                      type="text"
                      name="phone"
                      value={convertedLeadData.phone}
                      onChange={handleConvertInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Job Title</Form.Label>
                <Form.Control 
                  type="text"
                  name="title"
                  value={convertedLeadData.title}
                  onChange={handleConvertInputChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lead Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={convertedLeadData.type}
                      onChange={handleConvertInputChange}
                    >
                      {leadTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Source</Form.Label>
                    <Form.Control 
                      type="text"
                      name="source"
                      value={convertedLeadData.source}
                      onChange={handleConvertInputChange}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tags (comma separated)</Form.Label>
                <Form.Control 
                  type="text"
                  value={convertedLeadData.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="e.g. driver, owner-operator, qualified"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={5}
                  name="notes"
                  value={convertedLeadData.notes}
                  onChange={handleConvertInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        {!convertSuccess && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConvertModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={submitConvertedLead}
              disabled={!convertedLeadData.firstName || !convertedLeadData.lastName}
            >
              Create Lead
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

// Mock data for search results (still needed for fallback)
const mockSearchResults = [
  {
    id: 1,
    title: "Independent Contract Driver - Last Mile Delivery",
    company: "Express Logistics",
    location: "Atlanta, GA",
    description: "Looking for independent contractors with their own cargo vans or sprinter vans for last mile delivery services. Competitive pay, flexible schedule.",
    requirements: ['Own vehicle (Cargo Van, Sprinter, or Box Truck)', 'Valid driver\'s license', 'Insurance', 'Clean driving record'],
    pay: '$25-35/hour',
    source: 'indeed',
    url: 'https://www.indeed.com/job/independent-contract-driver',
    postedDate: '2 days ago',
    rating: 4,
    phone: '(404) 555-1234'
  },
  {
    id: 2,
    title: "Owner Operator - Box Truck Delivery",
    company: "Southern Freight Solutions",
    location: "Marietta, GA",
    description: "Owner Operators needed for regional delivery routes. Box truck owners preferred. Daily routes available with consistent work.",
    requirements: ['Box truck ownership', 'DOT compliance', 'Minimum 1 year experience', 'Ability to lift 50 lbs'],
    pay: '$1,200-1,800/week',
    source: 'ziprecruiter',
    url: 'https://www.ziprecruiter.com/job/owner-operator-box-truck',
    postedDate: 'Today',
    rating: 5,
    phone: '(678) 555-2345'
  },
  {
    id: 3,
    title: "1099 Courier - Medical Deliveries",
    company: "MedEx Delivery Services",
    location: "Decatur, GA",
    description: "Immediate openings for 1099 couriers to handle sensitive medical deliveries. Consistent routes, same-day scheduling.",
    requirements: ['Reliable vehicle', 'Smartphone with data plan', 'Ability to pass background check', 'Professional appearance'],
    pay: '$20-30/hour',
    source: 'craigslist',
    url: 'https://atlanta.craigslist.org/job/1099-courier-medical-deliveries',
    postedDate: '3 days ago',
    rating: 3,
    phone: '(770) 555-3456'
  },
  {
    id: 4,
    title: "Delivery Service Provider - Amazon DSP Program",
    company: "Amazon Delivery Service Partner",
    location: "Atlanta, GA",
    description: "Become a Delivery Service Provider for Amazon. Opportunities to build your own delivery business with 20-40 vans.",
    requirements: ['Business experience', 'Liquid assets of $30k+', 'Strong leadership', 'Commitment to success'],
    pay: '$75,000-300,000/year potential',
    source: 'linkedin',
    url: 'https://www.linkedin.com/jobs/view/amazon-dsp-program',
    postedDate: '1 week ago',
    rating: 5,
    phone: '(404) 555-4567'
  },
  {
    id: 5,
    title: "Owner Operator Sprinter Van Drivers",
    company: "Prime Delivery Co.",
    location: "Alpharetta, GA",
    description: "Looking for owner operators with Sprinter vans for dedicated routes. Weekly settlements, fuel cards available.",
    requirements: ['Sprinter van (2015 or newer)', 'Clean MVR', 'Smartphone', 'Able to work weekends'],
    pay: '$900-1,400/week',
    source: 'glassdoor',
    url: 'https://www.glassdoor.com/job/owner-operator-sprinter',
    postedDate: '3 days ago',
    rating: 4,
    phone: '(470) 555-5678'
  },
  {
    id: 6,
    title: "Independent Contractor - Final Mile Delivery",
    company: "Last Mile Experts",
    location: "Lawrenceville, GA",
    description: "Independent contractors needed for home delivery of appliances and furniture. Great earning potential.",
    requirements: ['Box truck or cargo van', '2+ years experience', 'Ability to install appliances a plus', 'Customer service skills'],
    pay: '$1,000-1,500/week',
    source: 'indeed',
    url: 'https://www.indeed.com/job/independent-contractor-final-mile',
    postedDate: '1 day ago',
    rating: 4,
    phone: '(678) 555-6789'
  },
  {
    id: 7,
    title: "1099 Driver - Food Delivery",
    company: "Metro Meal Delivery",
    location: "Atlanta, GA",
    description: "Drivers needed for restaurant delivery service. Be your own boss, work when you want. High demand in Atlanta area.",
    requirements: ['Any vehicle', 'Valid license and insurance', 'Smartphone', '18+ years old'],
    pay: '$15-25/hour + tips',
    source: 'monster',
    url: 'https://www.monster.com/jobs/1099-driver-food-delivery',
    postedDate: 'Today',
    rating: 3,
    phone: '(404) 555-7890'
  },
  {
    id: 8,
    title: "Contract Route Driver - Package Delivery",
    company: "Regional Delivery Systems",
    location: "Smyrna, GA",
    description: "Contract drivers needed for dedicated package delivery routes. Monday-Friday schedule with consistent territory.",
    requirements: ['Cargo van or larger', 'Clean driving record', 'Background check', 'Reliable transportation'],
    pay: '$200-250/day',
    source: 'careerbuilder',
    url: 'https://www.careerbuilder.com/job/contract-route-driver',
    postedDate: '5 days ago',
    rating: 4,
    phone: '(770) 555-8901'
  }
];

export default LeadGenerator;