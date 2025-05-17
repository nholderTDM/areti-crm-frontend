import React, { useState } from 'react';
import { Card, Form, Button, Table, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileExcel, FaFileCsv, FaFileAlt, FaCheck, FaTimes, FaArrowLeft, FaDownload } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const ContactImport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [mappedFields, setMappedFields] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    mobile: '',
    title: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    type: '',
    tags: ''
  });
  
  // Sample headers for demonstration
  const [headers, setHeaders] = useState([]);
  
  // Required fields
  const requiredFields = ['firstName', 'lastName', 'email'];
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Check file type
    if (!['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(selectedFile.type)) {
      setUploadError('Please upload a CSV or Excel file');
      return;
    }
    
    // Reset previous data
    setUploadError('');
    setFilePreview([]);
    setHeaders([]);
    
    // For demo purposes, we'll simulate parsing the file
    setTimeout(() => {
      // Mock CSV parsing - in a real app, you would use a library like PapaParse
      const mockHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Job Title', 'Address', 'City', 'State', 'ZIP', 'Country', 'Contact Type', 'Tags'];
      
      // Set mock data for preview
      const mockData = [
        {
          'First Name': 'John',
          'Last Name': 'Smith',
          'Email': 'john.smith@example.com',
          'Phone': '555-123-4567',
          'Company': 'ABC Corporation',
          'Job Title': 'Marketing Director',
          'Address': '123 Main St',
          'City': 'Atlanta',
          'State': 'GA',
          'ZIP': '30301',
          'Country': 'USA',
          'Contact Type': 'Customer',
          'Tags': 'vip, marketing'
        },
        {
          'First Name': 'Sarah',
          'Last Name': 'Johnson',
          'Email': 'sarah.j@example.com',
          'Phone': '555-987-6543',
          'Company': 'XYZ Inc',
          'Job Title': 'Operations Manager',
          'Address': '456 Oak Ave',
          'City': 'Marietta',
          'State': 'GA',
          'ZIP': '30060',
          'Country': 'USA',
          'Contact Type': 'Prospect',
          'Tags': 'new-lead'
        },
        {
          'First Name': 'Michael',
          'Last Name': 'Williams',
          'Email': 'mwilliams@example.com',
          'Phone': '555-567-8901',
          'Company': 'Tech Solutions',
          'Job Title': 'IT Director',
          'Address': '789 Peachtree St',
          'City': 'Atlanta',
          'State': 'GA',
          'ZIP': '30308',
          'Country': 'USA',
          'Contact Type': 'Vendor',
          'Tags': 'it, technical'
        }
      ];
      
      setHeaders(mockHeaders);
      setFilePreview(mockData);
      
      // Auto-map fields based on header names
      const initialMapping = {
        firstName: mockHeaders.findIndex(h => h.toLowerCase().includes('first')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('first'))] : '',
        lastName: mockHeaders.findIndex(h => h.toLowerCase().includes('last')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('last'))] : '',
        email: mockHeaders.findIndex(h => h.toLowerCase().includes('email')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('email'))] : '',
        phone: mockHeaders.findIndex(h => h.toLowerCase().includes('phone')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('phone'))] : '',
        mobile: mockHeaders.findIndex(h => h.toLowerCase().includes('mobile') || h.toLowerCase().includes('cell')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('mobile') || h.toLowerCase().includes('cell'))] : '',
        company: mockHeaders.findIndex(h => h.toLowerCase().includes('company') || h.toLowerCase().includes('organization')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('company') || h.toLowerCase().includes('organization'))] : '',
        title: mockHeaders.findIndex(h => h.toLowerCase().includes('title') || h.toLowerCase().includes('job')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('title') || h.toLowerCase().includes('job'))] : '',
        address: mockHeaders.findIndex(h => h.toLowerCase().includes('address') || h.toLowerCase().includes('street')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('address') || h.toLowerCase().includes('street'))] : '',
        city: mockHeaders.findIndex(h => h.toLowerCase().includes('city')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('city'))] : '',
        state: mockHeaders.findIndex(h => h.toLowerCase().includes('state') || h.toLowerCase().includes('province')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('state') || h.toLowerCase().includes('province'))] : '',
        zip: mockHeaders.findIndex(h => h.toLowerCase().includes('zip') || h.toLowerCase().includes('postal')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('zip') || h.toLowerCase().includes('postal'))] : '',
        country: mockHeaders.findIndex(h => h.toLowerCase().includes('country')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('country'))] : '',
        type: mockHeaders.findIndex(h => h.toLowerCase().includes('type')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('type'))] : '',
        tags: mockHeaders.findIndex(h => h.toLowerCase().includes('tag')) !== -1 ? mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('tag'))] : '',
      };
      
      setMappedFields(initialMapping);
    }, 1000);
  };
  
  // Handle field mapping changes
  const handleMappingChange = (field, value) => {
    setMappedFields({
      ...mappedFields,
      [field]: value
    });
  };
  
  // Check if all required fields are mapped
  const areRequiredFieldsMapped = () => {
    return requiredFields.every(field => mappedFields[field] !== '');
  };
  
  // Handle import submission
  const handleImport = () => {
    if (!areRequiredFieldsMapped()) {
      setUploadError('Please map all required fields (First Name, Last Name, Email)');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Get a sample CSV template
  const downloadTemplate = () => {
    // In a real app, this would generate and download a CSV file
    alert('This would download a CSV template');
  };
  
  return (
    <div className="container-fluid py-4">
      <PageTitle 
  title="Import Contacts"
  subtitle="Upload contacts from CSV or Excel files"
  backButton={true}
/>

<div className="d-flex justify-content-end mb-4">
  <Button 
    variant="outline-primary"
    onClick={downloadTemplate}
  >
    <FaDownload className="me-1" /> Download Template
  </Button>
</div>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Upload File</h5>
          <p className="text-muted">
            Upload a CSV or Excel file containing your contacts. The file should include columns for contact details.
          </p>
          
          {uploadSuccess ? (
            <Alert variant="success">
              <FaCheck className="me-2" /> Contacts imported successfully! 
              <div className="mt-3">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/contacts')}
                >
                  View Contacts
                </Button>
              </div>
            </Alert>
          ) : (
            <Form>
              <div className="mb-4">
                <Form.Group controlId="fileUpload" className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Form.Label className="btn btn-outline-primary mb-0">
                        <FaUpload className="me-2" /> Select File
                        <Form.Control
                          type="file"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                          accept=".csv,.xls,.xlsx"
                        />
                      </Form.Label>
                    </div>
                    {file && (
                      <div className="d-flex align-items-center text-muted">
                        {file.type === 'text/csv' ? (
                          <FaFileCsv className="me-2" />
                        ) : (
                          <FaFileExcel className="me-2" />
                        )}
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </div>
                    )}
                  </div>
                </Form.Group>
                
                {uploadError && (
                  <Alert variant="danger">
                    <FaTimes className="me-2" /> {uploadError}
                  </Alert>
                )}
                
                {isUploading && (
                  <div className="mt-3">
                    <ProgressBar 
                      now={uploadProgress} 
                      label={`${uploadProgress}%`} 
                      animated 
                    />
                  </div>
                )}
              </div>
              
              {headers.length > 0 && filePreview.length > 0 && (
                <div>
                  <h5 className="mb-3">Map Fields</h5>
                  <p className="text-muted">
                    Map the columns from your file to the contact fields in our system. 
                    <span className="text-danger"> * Required fields.</span>
                  </p>
                  
                  <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={mappedFields.firstName}
                          onChange={(e) => handleMappingChange('firstName', e.target.value)}
                          isInvalid={!mappedFields.firstName && requiredFields.includes('firstName')}
                        >
                          <option value="">-- Select Field --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={mappedFields.lastName}
                          onChange={(e) => handleMappingChange('lastName', e.target.value)}
                          isInvalid={!mappedFields.lastName && requiredFields.includes('lastName')}
                        >
                          <option value="">-- Select Field --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={mappedFields.email}
                          onChange={(e) => handleMappingChange('email', e.target.value)}
                          isInvalid={!mappedFields.email && requiredFields.includes('email')}
                        >
                          <option value="">-- Select Field --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Select
                          value={mappedFields.phone}
                          onChange={(e) => handleMappingChange('phone', e.target.value)}
                        >
                          <option value="">-- Select Field --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Company</Form.Label>
                        <Form.Select
                          value={mappedFields.company}
                          onChange={(e) => handleMappingChange('company', e.target.value)}
                        >
                          <option value="">-- Select Field --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Select
                          value={mappedFields.title}
                          onChange={(e) => handleMappingChange('title', e.target.value)}
                        >
                          <option value="">-- Select Field --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Select
                          value={mappedFields.address}
                          onChange={(e) => handleMappingChange('address', e.target.value)}
                        >
                          <option value="">-- Select Field --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Contact Type</Form.Label>
                        <Form.Select
                          value={mappedFields.type}
                          onChange={(e) => handleMappingChange('type', e.target.value)}
                        >
                          <option value="">-- Select Field --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  
                  <h5 className="mb-3">Preview</h5>
                  <div className="table-responsive">
                    <Table bordered hover size="sm">
                      <thead>
                        <tr>
                          {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filePreview.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {headers.map((header, headerIndex) => (
                              <td key={headerIndex}>{row[header]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  
                  <div className="text-end mt-4">
                    <Button 
                      variant="primary" 
                      onClick={handleImport}
                      disabled={isUploading || !areRequiredFieldsMapped()}
                    >
                      {isUploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Importing...
                        </>
                      ) : (
                        <>Import Contacts ({filePreview.length})</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ContactImport;