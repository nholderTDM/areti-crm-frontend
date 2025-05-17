import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Badge, Table, ProgressBar, Tab, Nav, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileCsv, FaFileExcel, FaGoogle, FaTable, FaCheckCircle, FaTimesCircle, FaSave, FaArrowLeft } from 'react-icons/fa';
import Papa from 'papaparse'; // For CSV parsing
import BackButton from '../common/BackButton';

const DriverImport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('file');
  const [file, setFile] = useState(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [importData, setImportData] = useState([]);
  const [hasHeaders, setHasHeaders] = useState(true);
  const [mappedFields, setMappedFields] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importStep, setImportStep] = useState(1);
  
  // Available fields for mapping
  const availableFields = [
    { key: 'name', label: 'Full Name', required: true },
    { key: 'email', label: 'Email Address', required: true },
    { key: 'phone', label: 'Phone Number', required: true },
    { key: 'address', label: 'Address', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'zip', label: 'ZIP Code', required: false },
    { key: 'licenseNumber', label: 'License Number', required: true },
    { key: 'licenseExpiry', label: 'License Expiry Date', required: true },
    { key: 'vehicleType', label: 'Vehicle Type', required: false },
    { key: 'vehicleModel', label: 'Vehicle Model', required: false },
    { key: 'licensePlate', label: 'License Plate', required: false },
    { key: 'status', label: 'Status', required: false },
    { key: 'emergencyContactName', label: 'Emergency Contact Name', required: false },
    { key: 'emergencyContactPhone', label: 'Emergency Contact Phone', required: false },
    { key: 'areasCovered', label: 'Areas Covered', required: false }
  ];

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      // Reset states
      setImportData([]);
      setMappedFields({});
      setValidationErrors([]);
      setImportSuccess(false);
      
      // Parse the file
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        Papa.parse(selectedFile, {
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setImportData(results.data);
              // Auto map fields if headers are present
              if (hasHeaders && results.data.length > 1) {
                const headers = results.data[0];
                const autoMappedFields = {};
                
                headers.forEach((header, index) => {
                  // Simple auto-mapping based on header names
                  const field = availableFields.find(f => 
                    f.label.toLowerCase() === header.toLowerCase() ||
                    f.key.toLowerCase() === header.toLowerCase()
                  );
                  
                  if (field) {
                    autoMappedFields[index] = field.key;
                  }
                });
                
                setMappedFields(autoMappedFields);
              }
            }
          },
          header: false,
          skipEmptyLines: true
        });
      } else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 selectedFile.type === 'application/vnd.ms-excel' ||
                 selectedFile.name.endsWith('.xlsx') || 
                 selectedFile.name.endsWith('.xls')) {
        // For Excel files we would use a library like SheetJS/xlsx
        // This is a placeholder for Excel file parsing
        alert('Excel file format detected. In a production environment, this would use SheetJS to parse the Excel file.');
        
        // Mock data for demonstration
        const mockData = [
          ['Name', 'Email', 'Phone', 'License Number', 'Vehicle Type'],
          ['John Doe', 'john.doe@example.com', '(555) 123-4567', 'DL123456', 'Delivery Van'],
          ['Jane Smith', 'jane.smith@example.com', '(555) 987-6543', 'DL654321', 'Cargo Truck']
        ];
        
        setImportData(mockData);
        
        // Auto map fields if headers are present
        if (hasHeaders && mockData.length > 1) {
          const headers = mockData[0];
          const autoMappedFields = {};
          
          headers.forEach((header, index) => {
            // Simple auto-mapping based on header names
            const field = availableFields.find(f => 
              f.label.toLowerCase().includes(header.toLowerCase()) ||
              header.toLowerCase().includes(f.key.toLowerCase())
            );
            
            if (field) {
              autoMappedFields[index] = field.key;
            }
          });
          
          setMappedFields(autoMappedFields);
        }
      } else {
        alert('Please select a CSV or Excel file.');
        setFile(null);
      }
    }
  };

  // Handle Google Sheet URL input
  const handleGoogleSheetImport = () => {
    if (!googleSheetUrl) return;
    
    setIsImporting(true);
    
    // In a real application, this would call an API to fetch the Google Sheet data
    // using the Google Sheets API and OAuth authentication
    
    // For this example, we'll simulate the process with mock data
    setTimeout(() => {
      const mockSheetData = [
        ['Name', 'Email', 'Phone', 'License Number', 'Vehicle Type'],
        ['John Doe', 'john.doe@example.com', '(555) 123-4567', 'DL123456', 'Delivery Van'],
        ['Jane Smith', 'jane.smith@example.com', '(555) 987-6543', 'DL654321', 'Cargo Truck'],
        ['Robert Brown', 'robert.brown@example.com', '(555) 456-7890', 'DL789012', 'Compact Car'],
        ['Sarah Williams', 'sarah.williams@example.com', '(555) 789-0123', 'DL345678', 'Delivery Van']
      ];
      
      setImportData(mockSheetData);
      
      // Auto map fields if headers are present
      if (hasHeaders && mockSheetData.length > 1) {
        const headers = mockSheetData[0];
        const autoMappedFields = {};
        
        headers.forEach((header, index) => {
          // Simple auto-mapping based on header names
          const field = availableFields.find(f => 
            f.label.toLowerCase().includes(header.toLowerCase()) ||
            header.toLowerCase().includes(f.key.toLowerCase())
          );
          
          if (field) {
            autoMappedFields[index] = field.key;
          }
        });
        
        setMappedFields(autoMappedFields);
      }
      
      setIsImporting(false);
    }, 2000);
  };

  // Handle field mapping
  const handleFieldMapping = (columnIndex, fieldKey) => {
    setMappedFields({
      ...mappedFields,
      [columnIndex]: fieldKey
    });
  };

  // Validate the data
  const validateData = () => {
    setIsValidating(true);
    setValidationErrors([]);
    
    const errors = [];
    
    // Skip header row if hasHeaders is true
    const startRow = hasHeaders ? 1 : 0;
    
    // Check for required fields
    const requiredFields = availableFields.filter(f => f.required).map(f => f.key);
    const mappedRequiredFields = Object.values(mappedFields).filter(field => requiredFields.includes(field));
    
    if (mappedRequiredFields.length < requiredFields.length) {
      errors.push({
        type: 'mapping',
        message: 'Not all required fields are mapped. Please map all required fields.'
      });
    }
    
    // Validate each row of data
    for (let i = startRow; i < importData.length; i++) {
      const row = importData[i];
      const rowNumber = i + 1;
      
      // Check each mapped field in the row
      Object.entries(mappedFields).forEach(([columnIndex, fieldKey]) => {
        const value = row[columnIndex];
        const field = availableFields.find(f => f.key === fieldKey);
        
        // Skip if field not found
        if (!field) return;
        
        // Check if required field is empty
        if (field.required && (!value || value.trim() === '')) {
          errors.push({
            row: rowNumber,
            field: field.label,
            message: `Required field '${field.label}' is empty in row ${rowNumber}.`
          });
        }
        
        // Validate email format
        if (fieldKey === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({
              row: rowNumber,
              field: field.label,
              message: `Invalid email format in row ${rowNumber}: '${value}'.`
            });
          }
        }
        
        // Validate phone format
        if (fieldKey === 'phone' && value) {
          const phoneRegex = /^[(]?\d{3}[)]?[-\s]?\d{3}[-\s]?\d{4}$/;
          if (!phoneRegex.test(value)) {
            errors.push({
              row: rowNumber,
              field: field.label,
              message: `Invalid phone format in row ${rowNumber}: '${value}'. Expected format: (XXX) XXX-XXXX or XXX-XXX-XXXX.`
            });
          }
        }
        
        // Validate license expiry date
        if (fieldKey === 'licenseExpiry' && value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push({
              row: rowNumber,
              field: field.label,
              message: `Invalid date format in row ${rowNumber}: '${value}'. Expected format: YYYY-MM-DD.`
            });
          }
        }
      });
    }
    
    setValidationErrors(errors);
    setIsValidating(false);
    
    // If no errors, move to next step
    if (errors.length === 0) {
      setImportStep(3);
    }
  };

  // Import data to system
  const importDrivers = () => {
    setIsImporting(true);
    
    // In a production environment, this would be an API call to save the data
    // For this example, we'll simulate the process
    setTimeout(() => {
      console.log('Importing drivers...');
      console.log('Mapped fields:', mappedFields);
      
      // Process the data
      const startRow = hasHeaders ? 1 : 0;
      const processedData = [];
      
      for (let i = startRow; i < importData.length; i++) {
        const row = importData[i];
        const driver = {};
        
        // Map the fields
        Object.entries(mappedFields).forEach(([columnIndex, fieldKey]) => {
          driver[fieldKey] = row[columnIndex];
        });
        
        // Add driver to processed data
        processedData.push(driver);
      }
      
      console.log('Processed data:', processedData);
      
      // Success!
      setImportSuccess(true);
      setIsImporting(false);
    }, 2000);
  };

  // Reset the process
  const resetImport = () => {
    setFile(null);
    setGoogleSheetUrl('');
    setImportData([]);
    setMappedFields({});
    setValidationErrors([]);
    setImportSuccess(false);
    setImportStep(1);
  };

  // Render preview table
  const renderPreviewTable = () => {
    if (importData.length === 0) return null;
    
    const startRow = hasHeaders ? 1 : 0;
    const previewData = hasHeaders ? importData.slice(0, 6) : importData.slice(0, 5);
    const headers = hasHeaders ? previewData[0] : Array(previewData[0].length).fill('').map((_, i) => `Column ${i + 1}`);
    
    return (
      <div className="table-responsive">
        <Table bordered hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>#</th>
              {headers.map((header, i) => (
                <th key={i}>
                  {header}
                  <Form.Select 
                    size="sm" 
                    className="mt-2"
                    value={mappedFields[i] || ''}
                    onChange={(e) => handleFieldMapping(i, e.target.value)}
                  >
                    <option value="">-- Map Field --</option>
                    {availableFields.map(field => (
                      <option 
                        key={field.key} 
                        value={field.key}
                        disabled={Object.values(mappedFields).includes(field.key) && mappedFields[i] !== field.key}
                      >
                        {field.label} {field.required ? '*' : ''}
                      </option>
                    ))}
                  </Form.Select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.slice(startRow).map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{startRow + rowIndex + 1}</td>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // Render validation errors
  const renderValidationErrors = () => {
    if (validationErrors.length === 0) return null;
    
    return (
      <div className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Validation Errors</Alert.Heading>
          <p>Please fix the following errors before proceeding:</p>
          <ListGroup>
            {validationErrors.map((error, index) => (
              <ListGroup.Item key={index} className="bg-transparent border-0">
                <FaTimesCircle className="text-danger me-2" />
                {error.message}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Alert>
      </div>
    );
  };

  // Render confirmation table
  const renderConfirmationTable = () => {
    if (importData.length === 0) return null;
    
    const startRow = hasHeaders ? 1 : 0;
    const totalRows = importData.length - startRow;
    
    // Count mapped required and optional fields
    const requiredFields = availableFields.filter(f => f.required);
    const optionalFields = availableFields.filter(f => !f.required);
    const mappedRequiredFieldsCount = requiredFields.filter(f => 
      Object.values(mappedFields).includes(f.key)
    ).length;
    const mappedOptionalFieldsCount = optionalFields.filter(f => 
      Object.values(mappedFields).includes(f.key)
    ).length;
    
    return (
      <Card className="mb-4">
        <Card.Body>
          <h5>Import Summary</h5>
          <Row>
            <Col md={4}>
              <div className="mb-3">
                <div className="text-muted">Total Drivers</div>
                <h3>{totalRows}</h3>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <div className="text-muted">Required Fields</div>
                <h3>
                  {mappedRequiredFieldsCount} / {requiredFields.length}
                  <span className="ms-2">
                    {mappedRequiredFieldsCount === requiredFields.length ? 
                      <Badge bg="success">All Mapped</Badge> : 
                      <Badge bg="danger">Incomplete</Badge>}
                  </span>
                </h3>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <div className="text-muted">Optional Fields</div>
                <h3>
                  {mappedOptionalFieldsCount} / {optionalFields.length}
                  <span className="ms-2">
                    <Badge bg="info">{Math.round((mappedOptionalFieldsCount / optionalFields.length) * 100)}%</Badge>
                  </span>
                </h3>
              </div>
            </Col>
          </Row>
          
          <h5 className="mt-4">Field Mapping</h5>
          <Table bordered size="sm">
            <thead className="bg-light">
              <tr>
                <th>Field Name</th>
                <th>Source Column</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {availableFields.filter(f => f.required).map(field => {
                const isMapped = Object.values(mappedFields).includes(field.key);
                const sourceColumn = isMapped ? 
                  Object.entries(mappedFields).find(([_, value]) => value === field.key)[0] : null;
                const sourceHeader = hasHeaders && sourceColumn ? importData[0][sourceColumn] : null;
                
                return (
                  <tr key={field.key}>
                    <td>
                      <span className="fw-bold">{field.label}</span>
                      <Badge bg="danger" className="ms-2">Required</Badge>
                    </td>
                    <td>
                      {isMapped ? (
                        sourceHeader ? sourceHeader : `Column ${parseInt(sourceColumn) + 1}`
                      ) : 'Not Mapped'}
                    </td>
                    <td>
                      {isMapped ? (
                        <span className="text-success">
                          <FaCheckCircle className="me-1" /> Mapped
                        </span>
                      ) : (
                        <span className="text-danger">
                          <FaTimesCircle className="me-1" /> Not Mapped
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {availableFields.filter(f => !f.required).map(field => {
                const isMapped = Object.values(mappedFields).includes(field.key);
                const sourceColumn = isMapped ? 
                  Object.entries(mappedFields).find(([_, value]) => value === field.key)[0] : null;
                const sourceHeader = hasHeaders && sourceColumn ? importData[0][sourceColumn] : null;
                
                return (
                  <tr key={field.key}>
                    <td>
                      <span>{field.label}</span>
                      <Badge bg="secondary" className="ms-2">Optional</Badge>
                    </td>
                    <td>
                      {isMapped ? (
                        sourceHeader ? sourceHeader : `Column ${parseInt(sourceColumn) + 1}`
                      ) : 'Not Mapped'}
                    </td>
                    <td>
                      {isMapped ? (
                        <span className="text-success">
                          <FaCheckCircle className="me-1" /> Mapped
                        </span>
                      ) : (
                        <span className="text-muted">
                          <FaTimesCircle className="me-1" /> Not Mapped
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          
          <div className="mt-4 d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={() => setImportStep(2)}
            >
              Back to Mapping
            </Button>
            <Button 
              variant="primary" 
              onClick={importDrivers}
              disabled={isImporting || mappedRequiredFieldsCount < requiredFields.length}
            >
              {isImporting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Importing...
                </>
              ) : (
                <>Import {totalRows} Drivers</>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  // Render success message
  const renderSuccessMessage = () => {
    if (!importSuccess) return null;
    
    const startRow = hasHeaders ? 1 : 0;
    const totalRows = importData.length - startRow;
    
    return (
      <Alert variant="success" className="mb-4">
        <Alert.Heading>Import Successful!</Alert.Heading>
        <p>Successfully imported {totalRows} drivers into the system.</p>
        <hr />
        <div className="d-flex justify-content-between">
          <Button 
            variant="outline-success" 
            onClick={resetImport}
          >
            Import More Drivers
          </Button>
          <Button 
            variant="success" 
            onClick={() => navigate('/drivers')}
          >
            Go to Drivers List
          </Button>
        </div>
      </Alert>
    );
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button 
            variant="outline-secondary" 
            className="me-3"
            onClick={() => navigate('/drivers')}
          >
            <FaArrowLeft /> <span className="d-none d-md-inline ms-1">Back to Drivers</span>
          </Button>
          <h1 className="mb-0">Import Drivers</h1>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="mb-4">
            <ProgressBar 
              className="mb-3" 
              now={(importStep / 4) * 100} 
              style={{ height: '8px' }}
            />
            <div className="d-flex justify-content-between">
              <div className={`text-center ${importStep >= 1 ? 'text-primary' : ''}`}>
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${importStep >= 1 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>1</div>
                <div>Upload</div>
              </div>
              <div className={`text-center ${importStep >= 2 ? 'text-primary' : ''}`}>
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${importStep >= 2 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>2</div>
                <div>Map Fields</div>
              </div>
              <div className={`text-center ${importStep >= 3 ? 'text-primary' : ''}`}>
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${importStep >= 3 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>3</div>
                <div>Confirm</div>
              </div>
              <div className={`text-center ${importStep >= 4 ? 'text-primary' : ''}`}>
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${importStep >= 4 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>4</div>
                <div>Complete</div>
              </div>
            </div>
          </div>
          
          {importSuccess ? (
            renderSuccessMessage()
          ) : (
            <>
              {/* Step 1: Upload File or Connect to Google Sheets */}
              {importStep === 1 && (
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                  <Row className="mb-4">
                    <Col md={12}>
                      <Nav variant="pills" className="mb-3">
                        <Nav.Item>
                          <Nav.Link eventKey="file">
                            <FaUpload className="me-2" /> Upload File
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="google">
                            <FaGoogle className="me-2" /> Google Sheets
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      
                      <Tab.Content>
                        <Tab.Pane eventKey="file">
                          <Card className="border">
                            <Card.Body className="text-center p-5">
                              <div className="mb-4">
                                <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                  <FaUpload size={32} className="text-primary" />
                                </div>
                                <h4>Upload Driver Data</h4>
                                <p className="text-muted">Upload a CSV or Excel file containing driver information</p>
                              </div>
                              
                              <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control 
                                  type="file" 
                                  accept=".csv,.xlsx,.xls" 
                                  onChange={handleFileChange}
                                  className="d-none"
                                  id="fileUpload"
                                />
                                <div className="d-flex justify-content-center">
                                  <Button 
                                    variant="outline-primary" 
                                    className="me-2"
                                    onClick={() => document.getElementById('fileUpload').click()}
                                  >
                                    <FaFileCsv className="me-2" /> Select CSV File
                                  </Button>
                                  <Button 
                                    variant="outline-success"
                                    onClick={() => document.getElementById('fileUpload').click()}
                                  >
                                    <FaFileExcel className="me-2" /> Select Excel File
                                  </Button>
                                </div>
                              </Form.Group>
                              
                              {file && (
                                <Alert variant="info" className="d-flex align-items-center">
                                  <div className="me-3">
                                    {file.name.endsWith('.csv') ? (
                                      <FaFileCsv size={24} />
                                    ) : (
                                      <FaFileExcel size={24} />
                                    )}
                                  </div>
                                  <div className="flex-grow-1">
                                    <div><strong>{file.name}</strong></div>
                                    <div className="small text-muted">{(file.size / 1024).toFixed(2)} KB</div>
                                  </div>
                                </Alert>
                              )}
                              
                              <Form.Check 
                                type="checkbox"
                                id="has-headers"
                                label="File contains header row"
                                checked={hasHeaders}
                                onChange={(e) => setHasHeaders(e.target.checked)}
                                className="mt-3 mb-4"
                              />
                              
                              <Button 
                                variant="primary" 
                                disabled={!file}
                                onClick={() => setImportStep(2)}
                                className="px-4"
                              >
                                Continue to Field Mapping
                              </Button>
                            </Card.Body>
                          </Card>
                        </Tab.Pane>
                        
                        <Tab.Pane eventKey="google">
                          <Card className="border">
                            <Card.Body className="text-center p-5">
                              <div className="mb-4">
                                <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                  <FaGoogle size={32} className="text-primary" />
                                </div>
                                <h4>Import from Google Sheets</h4>
                                <p className="text-muted">Connect to a Google Sheet containing driver information</p>
                              </div>
                              
                              <Form.Group className="mb-4">
                                <Form.Label>Google Sheet URL</Form.Label>
                                <InputGroup>
                                  <Form.Control 
                                    type="text" 
                                    placeholder="Paste Google Sheet URL here..." 
                                    value={googleSheetUrl}
                                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                                  />
                                  <Button 
                                    variant="primary" 
                                    onClick={handleGoogleSheetImport}
                                    disabled={!googleSheetUrl || isImporting}
                                  >
                                    {isImporting ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Connecting...
                                      </>
                                    ) : (
                                      <>Connect</>
                                    )}
                                  </Button>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                  Make sure the Google Sheet is publicly accessible or shared with the appropriate permissions.
                                </Form.Text>
                              </Form.Group>
                              
                              <Form.Check 
                                type="checkbox"
                                id="google-has-headers"
                                label="Sheet contains header row"
                                checked={hasHeaders}
                                onChange={(e) => setHasHeaders(e.target.checked)}
                                className="mb-4"
                              />
                              
                              {importData.length > 0 && (
                                <Button 
                                  variant="primary" 
                                  onClick={() => setImportStep(2)}
                                  className="px-4"
                                >
                                  Continue to Field Mapping
                                </Button>
                              )}
                            </Card.Body>
                          </Card>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                  
                  <div className="mt-4">
                    <h5>Sample Template</h5>
                    <p>
                      You can download our sample template to see the expected format for driver imports.
                    </p>
                    <div>
                      <Button variant="outline-primary" className="me-2">
                        <FaFileCsv className="me-2" /> Download CSV Template
                      </Button>
                      <Button variant="outline-success">
                        <FaFileExcel className="me-2" /> Download Excel Template
                      </Button>
                    </div>
                  </div>
                </Tab.Container>
              )}
              
              {/* Step 2: Map Fields */}
              {importStep === 2 && (
                <>
                  <div className="mb-4">
                    <h5>Map Data Fields</h5>
                    <p className="text-muted">
                      Map the columns from your file to the driver fields in our system. Required fields are marked with an asterisk (*).
                    </p>
                  </div>
                  
                  {renderPreviewTable()}
                  
                  {renderValidationErrors()}
                  
                  <div className="mt-4 d-flex justify-content-between">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setImportStep(1)}
                    >
                      Back
                    </Button>
                    <div>
                      <Button 
                        variant="outline-primary" 
                        onClick={validateData}
                        className="me-2"
                        disabled={isValidating || Object.keys(mappedFields).length === 0}
                      >
                        {isValidating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Validating...
                          </>
                        ) : (
                          <>Validate Data</>
                        )}
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => setImportStep(3)}
                        disabled={
                          validationErrors.length > 0 || 
                          Object.keys(mappedFields).length === 0 ||
                          availableFields.filter(f => f.required).some(f => !Object.values(mappedFields).includes(f.key))
                        }
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              {/* Step 3: Confirm Import */}
              {importStep === 3 && (
                <>
                  <div className="mb-4">
                    <h5>Confirm Import</h5>
                    <p className="text-muted">
                      Review the information below and confirm to import the drivers into the system.
                    </p>
                  </div>
                  
                  {renderConfirmationTable()}
                </>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DriverImport;