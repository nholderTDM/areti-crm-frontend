import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ProgressBar, Badge, ButtonGroup, Button, Dropdown, Form, Alert, Spinner } from 'react-bootstrap';
import { 
  FaChartLine, FaPhoneAlt, FaCheck, FaClock, FaCalendarAlt, 
  FaExclamationTriangle, FaRoute, FaChartPie, FaArrowDown, 
  FaArrowUp, FaFilter, FaUserAlt, FaListAlt, FaSyncAlt
} from 'react-icons/fa';
import { useMetricsData } from './hooks/useMetricsData';
import ConversationPathChart from './metrics/ConversationPathChart';
import ScriptSectionHeatmap from './metrics/ScriptSectionHeatmap';
import MetricsCard from './metrics/MetricsCard';
import TopPerformersTable from './metrics/TopPerformersTable';
import ObjectionHandlingChart from './metrics/ObjectionHandlingChart';
import TimeFilter from './metrics/TimeFilter';

const LeadScriptNavigatorMetrics = ({ selectedLeadId, scriptNavigatorRef }) => {
  // State for active filter tab
  const [activeTimeFilter, setActiveTimeFilter] = useState('month');
  
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  
  // State for display options
  const [displayOptions, setDisplayOptions] = useState({
    showConversionMetrics: true,
    showPathAnalysis: true,
    showPerformanceMetrics: true,
    showObjectionHandling: true
  });

  // Custom hook to fetch metrics data
  const { 
    data: metricsData, 
    isLoading, 
    error, 
    refresh: refreshData
  } = useMetricsData({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    leadId: selectedLeadId,
    timeframe: activeTimeFilter
  });

  // Handle time filter changes
  const handleTimeFilterChange = (filter) => {
    setActiveTimeFilter(filter);
    
    const today = new Date();
    let startDate = today;
    
    switch(filter) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(today.setDate(today.getDate() - 30));
        break;
      case 'quarter':
        startDate = new Date(today.setDate(today.getDate() - 90));
        break;
      case 'year':
        startDate = new Date(today.setDate(today.getDate() - 365));
        break;
      default:
        startDate = new Date(today.setDate(today.getDate() - 30));
    }
    
    setDateRange({ 
      startDate, 
      endDate: new Date() 
    });
  };

  // Toggle display options
  const toggleDisplayOption = (option) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Refresh data when time filter changes
  useEffect(() => {
    refreshData();
  }, [activeTimeFilter, dateRange]);

  return (
    <div className="lead-script-metrics mb-4">
      {/* Header with filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h5 className="mb-0">Script Performance Dashboard</h5>
            
            <div className="d-flex align-items-center mt-2 mt-md-0">
              {/* Time period filter */}
              <TimeFilter 
                activeFilter={activeTimeFilter}
                onFilterChange={handleTimeFilterChange}
              />
              
              {/* Custom date range selector would go here */}
              
              {/* Display options */}
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm" id="display-options-dropdown">
                  <FaFilter className="me-1" /> Display Options
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  <Dropdown.Item 
                    onClick={() => toggleDisplayOption('showConversionMetrics')}
                    active={displayOptions.showConversionMetrics}
                  >
                    Conversion Metrics
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => toggleDisplayOption('showPathAnalysis')}
                    active={displayOptions.showPathAnalysis}
                  >
                    Conversation Path Analysis
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => toggleDisplayOption('showPerformanceMetrics')}
                    active={displayOptions.showPerformanceMetrics}
                  >
                    Performance Metrics
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => toggleDisplayOption('showObjectionHandling')}
                    active={displayOptions.showObjectionHandling}
                  >
                    Objection Handling
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              {/* Refresh button */}
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="ms-2" 
                onClick={refreshData}
                disabled={isLoading}
              >
                <FaSyncAlt className={isLoading ? "spinner-border spinner-border-sm" : ""} />
              </Button>
            </div>
          </div>
        </Card.Header>
      </Card>
      
      {/* Loading and error states */}
      {isLoading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading metrics data...</p>
        </div>
      )}
      
      {error && (
        <Alert variant="danger">
          <FaExclamationTriangle className="me-2" />
          Error loading metrics data: {error}
        </Alert>
      )}
      
      {!isLoading && !error && metricsData && (
        <>
          {/* KPI Metrics cards */}
          {displayOptions.showConversionMetrics && (
            <Row className="mb-4">
              <Col md={3}>
                <MetricsCard 
                  title="Conversion Rate"
                  value={metricsData.conversionRate || 0}
                  target={25}
                  icon={<FaPhoneAlt />}
                  variant="primary"
                  unit="%"
                  trend={metricsData.conversionTrend || 0}
                  description="Calls resulting in next steps"
                />
              </Col>
              <Col md={3}>
                <MetricsCard 
                  title="Script Adherence"
                  value={metricsData.scriptAdherence || 0}
                  target={95}
                  icon={<FaCheck />}
                  variant="success"
                  unit="%"
                  trend={metricsData.adherenceTrend || 0}
                  description="Following recommended script"
                />
              </Col>
              <Col md={3}>
                <MetricsCard 
                  title="Avg. Call Duration"
                  value={metricsData.avgCallDuration || 0}
                  target={8}
                  icon={<FaClock />}
                  variant="warning"
                  unit="min"
                  trend={metricsData.durationTrend || 0}
                  description="Time spent on each call"
                />
              </Col>
              <Col md={3}>
                <MetricsCard 
                  title="Key Points Covered"
                  value={metricsData.keyPointsCovered || 0}
                  target={90}
                  icon={<FaListAlt />}
                  variant="info"
                  unit="%"
                  trend={metricsData.keyPointsTrend || 0}
                  description="Essential points delivered"
                />
              </Col>
            </Row>
          )}
          
          {/* Conversation path analysis */}
          {displayOptions.showPathAnalysis && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  <FaRoute className="me-2" />
                  Conversation Path Analysis
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={8}>
                    <ConversationPathChart 
                      data={metricsData.conversationPathData || []} 
                    />
                  </Col>
                  <Col lg={4}>
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Common Drop-off Points</h6>
                      </Card.Header>
                      <Card.Body>
                        <ul className="list-group">
                          {(metricsData.dropOffPoints || []).map((point, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              {point.name}
                              <span className="badge bg-danger rounded-pill">{point.count}</span>
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
          
          {/* Performance metrics */}
          {displayOptions.showPerformanceMetrics && (
            <Row className="mb-4">
              <Col lg={8}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">
                      <FaChartLine className="me-2" />
                      Script Section Performance
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <ScriptSectionHeatmap 
                      data={metricsData.scriptSectionData || []} 
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">
                      <FaUserAlt className="me-2" />
                      Top Performers
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <TopPerformersTable 
                      data={metricsData.topPerformers || []}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          
          {/* Objection handling */}
          {displayOptions.showObjectionHandling && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  <FaChartPie className="me-2" />
                  Objection Handling Analysis
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <ObjectionHandlingChart 
                      data={metricsData.objectionHandlingData || []} 
                    />
                  </Col>
                  <Col md={6}>
                    <h6>Most Effective Responses</h6>
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Objection Type</th>
                          <th>Best Response</th>
                          <th>Success Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(metricsData.bestResponses || []).map((response, index) => (
                          <tr key={index}>
                            <td>{response.objectionType}</td>
                            <td>{response.responseTitle}</td>
                            <td>
                              <Badge bg={response.successRate > 70 ? 'success' : 'warning'}>
                                {response.successRate}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default LeadScriptNavigatorMetrics;