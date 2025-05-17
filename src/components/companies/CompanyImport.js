import React, { useState } from 'react';
import { Card, Form, Button, Table, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUpload, FaFileExcel, FaFileCsv, FaArrowLeft, FaDownload, FaTimes, FaCheck } from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

const CompanyImport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [mappedFields, setMappedFields] = useState({
    name: '',
    industry: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    type: '',
    size: '',
    employees: '',
    revenue: ''
  });
  
  // Sample headers for demonstration
  const [headers, setHeaders] = useState([]);
  
  // Required fields
  const requiredFields = ['name', 'industry'];
  
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
      const mockHeaders = ['Company Name', 'Industry', 'Website', 'Email', 'Phone', 'Address', 'City', 'State', 'ZIP', 'Country', 'Type', 'Size', 'Employees', 'Annual Revenue'];
      
      // Set mock data for preview
      const mockData = [
        {
          'Company Name': 'Tech Innovations Inc',
          'Industry': 'Technology',
          'Website': 'www.techinnovations.com',
          'Email': 'info@techinnovations.com',
          'Phone': '(555) 123-4567',
          'Address': '123 Tech Blvd',
          'City': 'Atlanta',
          'State': 'GA',
          'ZIP': '30318',
          'Country': 'USA',
          'Type': 'Prospect',
          'Size': 'Medium (51-200)',
          'Employees': '120',
          'Annual Revenue': '$10-50M'
        },
        {
          'Company Name': 'Global Shipping Solutions',
          'Industry': 'Transportation',
          'Website': 'www.globalshipping.com',
          'Email': 'contact@globalshipping.com',
          'Phone': '(555) 987-6543',
          'Address': '456 Port Way',
          'City': 'Savannah',
          'State': 'GA',
          'ZIP': '31401',
          'Country': 'USA',
          'Type': 'Customer',
          'Size': 'Large (201-1000)',
          'Employees': '750',
          'Annual Revenue': '$50-100M'
        },
        {
          'Company Name': 'Fresh Foods Distributors',
          'Industry': 'Food & Beverage',
          'Website': 'www.freshfoodsdist.com',
          'Email': 'sales@freshfoodsdist.com',
          'Phone': '(555) 456-7890',
          'Address': '789 Produce Ln',
          'City': 'Macon',
          'State': 'GA',
          'ZIP': '31201',
          'Country': 'USA',
          'Type': 'Prospect',
          'Size': 'Small (11-50)',
          'Employees': '45',
          'Annual Revenue': '$1-5M'
        }
      ];
      
      setHeaders(mockHeaders);
      setFilePreview(mockData);
      
      // Auto-map fields based on header names
      const initialMapping = {
        name: mockHeaders.findIndex(h => h.toLowerCase().includes('company') && h.toLowerCase().includes('name')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('company') && h.toLowerCase().includes('name'))] : '',
        industry: mockHeaders.findIndex(h => h.toLowerCase().includes('industry')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('industry'))] : '',
        website: mockHeaders.findIndex(h => h.toLowerCase().includes('website')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('website'))] : '',
        email: mockHeaders.findIndex(h => h.toLowerCase().includes('email')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('email'))] : '',
        phone: mockHeaders.findIndex(h => h.toLowerCase().includes('phone')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('phone'))] : '',
        address: mockHeaders.findIndex(h => h.toLowerCase().includes('address') && !h.toLowerCase().includes('city') && !h.toLowerCase().includes('state') && !h.toLowerCase().includes('zip')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('address') && !h.toLowerCase().includes('city') && !h.toLowerCase().includes('state') && !h.toLowerCase().includes('zip'))] : '',
        city: mockHeaders.findIndex(h => h.toLowerCase().includes('city')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('city'))] : '',
        state: mockHeaders.findIndex(h => h.toLowerCase().includes('state') || h.toLowerCase().includes('province')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('state') || h.toLowerCase().includes('province'))] : '',
        zip: mockHeaders.findIndex(h => h.toLowerCase().includes('zip') || h.toLowerCase().includes('postal')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('zip') || h.toLowerCase().includes('postal'))] : '',
        country: mockHeaders.findIndex(h => h.toLowerCase().includes('country')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('country'))] : '',
        type: mockHeaders.findIndex(h => h.toLowerCase().includes('type')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('type'))] : '',
        size: mockHeaders.findIndex(h => h.toLowerCase().includes('size')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('size'))] : '',
        employees: mockHeaders.findIndex(h => h.toLowerCase().includes('employee')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('employee'))] : '',
        revenue: mockHeaders.findIndex(h => h.toLowerCase().includes('revenue')) !== -1 ? 
          mockHeaders[mockHeaders.findIndex(h => h.toLowerCase().includes('revenue'))] : '',
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
      setUploadError('Please map all required fields (Company Name, Industry)');
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
    alert('This would download a CSV template for companies');
  };
  
  return (
    <div className="container-fluid py-4">
      <PageTitle 
  title="Import Companies"
  subtitle="Upload companies from CSV or Excel files"
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
            Upload a CSV or Excel file containing your companies. The file should include columns for company details.
          </p>
          
          {uploadSuccess ? (
            <Alert variant="success">
              <FaCheck className="me-2" /> Companies imported successfully! 
              <div className="mt-3">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/companies')}
                >
                  View Companies
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
                    Map the columns from your file to the company fields in our system. 
                    <span className="text-danger"> * Required fields.</span>
                  </p>
                  
                  <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={mappedFields.name}
                          onChange={(e) => handleMappingChange('name', e.target.value)}
                          isInvalid={!mappedFields.name && requiredFields.includes('name')}
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
                        <Form.Label>Industry <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={mappedFields.industry}
                          onChange={(e) => handleMappingChange('industry', e.target.value)}
                          isInvalid={!mappedFields.industry && requiredFields.includes('industry')}
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
                        <Form.Label>Website</Form.Label>
                        <Form.Select
                          value={mappedFields.website}
                          onChange={(e) => handleMappingChange('website', e.target.value)}
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
                        <Form.Label>Email</Form.Label>
                        <Form.Select
                          value={mappedFields.email}
                          onChange={(e) => handleMappingChange('email', e.target.value)}
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
                        <Form.Label>Type</Form.Label>
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
                    <div className="col-md-3 mb-3">
                      <Form.Group>
                        <Form.Label>Size</Form.Label>
                        <Form.Select
                          value={mappedFields.size}
                          onChange={(e) => handleMappingChange('size', e.target.value)}
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
                        <>Import Companies ({filePreview.length})</>
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

export default CompanyImport;