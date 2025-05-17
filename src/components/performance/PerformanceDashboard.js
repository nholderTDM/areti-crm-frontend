import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, ProgressBar, Nav, Tab, Dropdown, Alert } from 'react-bootstrap';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { 
  FaDownload, FaCalendarAlt, FaFilter, FaChartLine, FaChartBar, FaChartPie, 
  FaTruck, FaUser, FaMoneyBillAlt, FaMapMarkerAlt, FaClock, FaExclamationTriangle,
  FaCheckCircle, FaStar, FaRoute, FaRoad
} from 'react-icons/fa';
import BackButton from '../common/BackButton';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const PerformanceDashboard = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');
  
  // Load performance data
  useEffect(() => {
    setIsLoading(true);
    
    // Mock data fetch - in a real app this would be an API call
    setTimeout(() => {
      const mockData = generateMockData();
      setPerformanceData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeframe]);
  
  // Generate mock performance data
  const generateMockData = () => {
    // Mock data for different timeframes
    const timeframeMaps = {
      weekly: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        deliveryCount: [32, 29, 35, 38, 41, 27, 18],
        onTimeRate: [94.2, 95.3, 93.1, 96.5, 97.2, 94.8, 95.9],
        revenue: [3200, 2900, 3500, 3800, 4100, 2700, 1800],
        cost: [2050, 1850, 2250, 2400, 2600, 1700, 1150]
      },
      monthly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        deliveryCount: [220, 245, 235, 250],
        onTimeRate: [94.5, 95.2, 96.3, 95.8],
        revenue: [22000, 24500, 23500, 25000],
        cost: [14000, 15600, 15000, 16000]
      },
      quarterly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        deliveryCount: [720, 680, 750, 790, 810, 840, 820, 860, 880, 900, 920, 950],
        onTimeRate: [94.2, 94.8, 95.1, 95.5, 96.0, 96.2, 95.8, 96.4, 96.7, 96.9, 97.1, 97.3],
        revenue: [72000, 68000, 75000, 79000, 81000, 84000, 82000, 86000, 88000, 90000, 92000, 95000],
        cost: [46000, 43500, 48000, 50500, 51800, 53600, 52500, 55000, 56200, 57500, 58800, 60700]
      }
    };
    
    // KPI and summary data
    const kpiData = {
      deliveryAccuracy: { value: 98.2, target: 95, previous: 97.5 },
      customerSatisfaction: { value: 4.7, target: 4.5, previous: 4.6 },
      onTimeDelivery: { value: 94.8, target: 95, previous: 93.2 },
      routeEfficiency: { value: 88.5, target: 90, previous: 86.3 },
      fuelEfficiency: { value: 92.1, target: 90, previous: 91.2 },
      costPerDelivery: { value: 23.5, target: 25, previous: 24.2 },
      averageDeliveryTime: { value: 37, target: 40, previous: 39 },
      deliverySuccessRate: { value: 99.3, target: 98, previous: 99.1 }
    };
    
    // Driver performance data
    const driverPerformance = [
      { name: 'Jane Smith', deliveries: 203, rating: 4.9, onTime: 98.5, efficiency: 94.2 },
      { name: 'John Doe', deliveries: 187, rating: 4.8, onTime: 97.8, efficiency: 92.7 },
      { name: 'Sarah Williams', deliveries: 165, rating: 4.7, onTime: 96.4, efficiency: 91.5 },
      { name: 'Mike Johnson', deliveries: 142, rating: 4.6, onTime: 95.2, efficiency: 90.8 },
      { name: 'David Wilson', deliveries: 178, rating: 4.5, onTime: 94.7, efficiency: 89.3 }
    ];
    
    // Regional performance data
    const regionalPerformance = [
      { region: 'North Zone', deliveries: 450, onTime: 96.2, satisfaction: 4.7, cost: 10350 },
      { region: 'South Zone', deliveries: 380, onTime: 95.7, satisfaction: 4.6, cost: 8740 },
      { region: 'East Zone', deliveries: 320, onTime: 94.5, satisfaction: 4.5, cost: 7360 },
      { region: 'West Zone', deliveries: 410, onTime: 96.8, satisfaction: 4.8, cost: 9430 },
      { region: 'Central Zone', deliveries: 520, onTime: 97.2, satisfaction: 4.9, cost: 11960 }
    ];
    
    // Customer satisfaction breakdown
    const satisfactionBreakdown = {
      labels: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
      data: [65, 25, 7, 2, 1]
    };
    
    // Delivery issue types
    const issueTypes = {
      labels: ['Late Delivery', 'Damaged Package', 'Incorrect Item', 'Driver Behavior', 'Other'],
      data: [45, 25, 15, 10, 5]
    };
    
    // Delivery time distribution
    const timeDistribution = {
      labels: ['< 30 mins', '30-45 mins', '45-60 mins', '60-90 mins', '> 90 mins'],
      data: [35, 42, 15, 6, 2]
    };
    
    // Return the mock data
    return {
      timeframeData: timeframeMaps[timeframe],
      kpis: kpiData,
      driverPerformance,
      regionalPerformance,
      satisfactionBreakdown,
      issueTypes,
      timeDistribution
    };
  };

  if (isLoading || !performanceData) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading performance data...</p>
        </div>
      </Container>
    );
  }

  // Prepare data for charts
  const deliveryTrendData = {
    labels: performanceData.timeframeData.labels,
    datasets: [
      {
        label: 'Delivery Count',
        data: performanceData.timeframeData.deliveryCount,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'On-Time Rate (%)',
        data: performanceData.timeframeData.onTimeRate,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
  
  const financialTrendData = {
    labels: performanceData.timeframeData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: performanceData.timeframeData.revenue,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Cost',
        data: performanceData.timeframeData.cost,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
  
  const satisfactionChartData = {
    labels: performanceData.satisfactionBreakdown.labels,
    datasets: [
      {
        data: performanceData.satisfactionBreakdown.data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const issueTypesChartData = {
    labels: performanceData.issueTypes.labels,
    datasets: [
      {
        data: performanceData.issueTypes.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const timeDistributionChartData = {
    labels: performanceData.timeDistribution.labels,
    datasets: [
      {
        label: 'Delivery Time Distribution',
        data: performanceData.timeDistribution.data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Delivery efficiency radar data for top drivers
  const driverEfficiencyData = {
    labels: ['On-Time Rate', 'Customer Rating', 'Route Efficiency', 'Fuel Efficiency', 'Cost Efficiency'],
    datasets: performanceData.driverPerformance.slice(0, 3).map((driver, index) => ({
      label: driver.name,
      data: [
        driver.onTime, 
        driver.rating * 20, // Scale rating from 0-5 to 0-100
        driver.efficiency,
        Math.random() * 10 + 85, // Random between 85-95
        Math.random() * 10 + 85  // Random between 85-95
      ],
      backgroundColor: `rgba(${index === 0 ? '75, 192, 192' : index === 1 ? '54, 162, 235' : '153, 102, 255'}, 0.2)`,
      borderColor: `rgba(${index === 0 ? '75, 192, 192' : index === 1 ? '54, 162, 235' : '153, 102, 255'}, 1)`,
      borderWidth: 2
    }))
  };
  
  // Regional performance comparison
  const regionalComparisonData = {
    labels: performanceData.regionalPerformance.map(r => r.region),
    datasets: [
      {
        label: 'Deliveries Completed',
        data: performanceData.regionalPerformance.map(r => r.deliveries),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'On-Time Rate (%)',
        data: performanceData.regionalPerformance.map(r => r.onTime),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Helper function to render KPI card
  const renderKpiCard = (title, kpi, format, icon) => {
    const percentChange = ((kpi.value - kpi.previous) / kpi.previous) * 100;
    const isPositive = 
      (title === 'Cost Per Delivery' || title === 'Average Delivery Time') 
        ? percentChange < 0 
        : percentChange > 0;
    
    // Determine progress color based on target
    let progressVariant = 'primary';
    
    if (title === 'Cost Per Delivery' || title === 'Average Delivery Time') {
      // For these metrics, lower is better
      if (kpi.value <= kpi.target) {
        progressVariant = 'success';
      } else if (kpi.value <= kpi.target * 1.1) {
        progressVariant = 'warning';
      } else {
        progressVariant = 'danger';
      }
    } else {
      // For these metrics, higher is better
      if (kpi.value >= kpi.target) {
        progressVariant = 'success';
      } else if (kpi.value >= kpi.target * 0.9) {
        progressVariant = 'warning';
      } else {
        progressVariant = 'danger';
      }
    }

    return (
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              {icon}
              <h6 className="mb-0 ms-2">{title}</h6>
            </div>
            <span className={`badge bg-${isPositive ? 'success' : 'danger'}`}>
              {isPositive ? '+' : ''}{Math.abs(percentChange).toFixed(1)}%
            </span>
          </div>
          <h3 className="mb-1">
            {format === 'percent' ? `${kpi.value}%` : 
             format === 'rating' ? kpi.value : 
             format === 'time' ? `${kpi.value} min` : 
             format === 'money' ? `$${kpi.value}` : kpi.value}
          </h3>
          <div className="text-muted mb-3">
            Target: {format === 'percent' ? `${kpi.target}%` : 
                    format === 'rating' ? kpi.target : 
                    format === 'time' ? `${kpi.target} min` : 
                    format === 'money' ? `$${kpi.target}` : kpi.target}
          </div>
          <ProgressBar 
            variant={progressVariant} 
            now={format === 'rating' ? (kpi.value/5)*100 : 
                 title === 'Cost Per Delivery' || title === 'Average Delivery Time' ? 
                 (kpi.target/kpi.value)*100 : 
                 (kpi.value/kpi.target)*100} 
            max={100} 
          />
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Performance Dashboard</h1>
        <div className="d-flex">
          <Form.Select 
            className="me-2"
            style={{ width: 'auto' }} 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="weekly">Weekly View</option>
            <option value="monthly">Monthly View</option>
            <option value="quarterly">Quarterly View</option>
          </Form.Select>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-export">
              <FaDownload className="me-1" /> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/export-pdf">Export as PDF</Dropdown.Item>
              <Dropdown.Item href="#/export-csv">Export as CSV</Dropdown.Item>
              <Dropdown.Item href="#/export-excel">Export as Excel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="overview">
              <FaChartLine className="me-1" /> Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="drivers">
              <FaUser className="me-1" /> Driver Performance
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="regional">
              <FaMapMarkerAlt className="me-1" /> Regional Analysis
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="customer">
              <FaStar className="me-1" /> Customer Satisfaction
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="financial">
              <FaMoneyBillAlt className="me-1" /> Financial Metrics
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Overview Tab */}
          <Tab.Pane eventKey="overview">
            {/* KPI Cards */}
            <Row className="mb-4">
              <Col md={3}>
                {renderKpiCard('On-Time Delivery', performanceData.kpis.onTimeDelivery, 'percent', <FaClock className="text-primary" />)}
              </Col>
              <Col md={3}>
                {renderKpiCard('Customer Satisfaction', performanceData.kpis.customerSatisfaction, 'rating', <FaStar className="text-warning" />)}
              </Col>
              <Col md={3}>
                {renderKpiCard('Delivery Accuracy', performanceData.kpis.deliveryAccuracy, 'percent', <FaCheckCircle className="text-success" />)}
              </Col>
              <Col md={3}>
                {renderKpiCard('Route Efficiency', performanceData.kpis.routeEfficiency, 'percent', <FaRoute className="text-info" />)}
              </Col>
            </Row>

            {/* Main Charts */}
            <Row className="mb-4">
              <Col md={8}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Delivery Performance Trend</h5>
                    <div>
                      <Button variant="outline-secondary" size="sm" className="me-2">
                        <FaChartLine className="me-1" /> Line
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FaChartBar className="me-1" /> Bar
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '350px' }}>
                      <Line 
                        data={deliveryTrendData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              type: 'linear',
                              display: true,
                              position: 'left',
                              title: {
                                display: true,
                                text: 'Delivery Count'
                              }
                            },
                            y1: {
                              type: 'linear',
                              display: true,
                              position: 'right',
                              title: {
                                display: true,
                                text: 'On-Time Rate (%)'
                              },
                              min: 80,
                              max: 100,
                              grid: {
                                drawOnChartArea: false
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Issue Types</h5>
                    <Button variant="outline-secondary" size="sm">
                      <FaFilter className="me-1" /> Filter
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '350px' }}>
                      <Doughnut 
                        data={issueTypesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Top Performers */}
            <Row>
              <Col md={12}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Top Performing Drivers</h5>
                    <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('drivers')}>
                      View All Drivers
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Table hover responsive className="align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th>Name</th>
                          <th>Deliveries Completed</th>
                          <th>Customer Rating</th>
                          <th>On-Time Percentage</th>
                          <th>Efficiency Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceData.driverPerformance.slice(0, 3).map((driver, index) => (
                          <tr key={index}>
                            <td>{driver.name}</td>
                            <td>{driver.deliveries}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-2">{driver.rating.toFixed(1)}</div>
                                <div>
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.floor(driver.rating) ? "text-warning" : "text-muted"}>★</span>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td>{driver.onTime.toFixed(1)}%</td>
                            <td>
                              <ProgressBar 
                                variant="success" 
                                now={driver.efficiency} 
                                label={`${driver.efficiency.toFixed(1)}%`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Driver Performance Tab */}
          <Tab.Pane eventKey="drivers">
            <Alert variant="info" className="mb-4">
              <div className="d-flex">
                <FaExclamationTriangle className="me-2 mt-1" />
                <div>
                  <strong>Driver Performance Overview</strong>
                  <p className="mb-0">This section provides detailed performance metrics for all drivers. Use the filters to customize your view.</p>
                </div>
              </div>
            </Alert>

            <Row className="mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Driver Efficiency Radar</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '350px' }}>
                      <Radar 
                        data={driverEfficiencyData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            r: {
                              min: 70,
                              max: 100,
                              ticks: {
                                stepSize: 10
                              }
                            }
                          },
                          elements: {
                            line: {
                              borderWidth: 3
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Driver Performance Matrix</h5>
                    <Form.Select style={{ width: 'auto' }}>
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>Year to Date</option>
                      <option>Custom Range</option>
                    </Form.Select>
                  </Card.Header>
                  <Card.Body>
                    <Table hover responsive className="align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th>Driver</th>
                          <th>Deliveries</th>
                          <th>On-Time Rate</th>
                          <th>Avg. Time</th>
                          <th>Customer Rating</th>
                          <th>Efficiency</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceData.driverPerformance.map((driver, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{driver.name}</strong>
                            </td>
                            <td>{driver.deliveries}</td>
                            <td>
                              <span className={`${driver.onTime >= 95 ? 'text-success' : driver.onTime >= 90 ? 'text-warning' : 'text-danger'}`}>
                                {driver.onTime.toFixed(1)}%
                              </span>
                            </td>
                            <td>{Math.floor(Math.random() * 10) + 35} min</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-2">{driver.rating.toFixed(1)}</div>
                                <div>
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.floor(driver.rating) ? "text-warning" : "text-muted"}>★</span>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td>{driver.efficiency.toFixed(1)}%</td>
                            <td>
                              <ProgressBar 
                                variant={
                                  (driver.onTime + driver.efficiency) / 2 >= 95 ? "success" : 
                                  (driver.onTime + driver.efficiency) / 2 >= 90 ? "info" : "warning"
                                } 
                                now={(driver.onTime + driver.efficiency) / 2} 
                                label={`${((driver.onTime + driver.efficiency) / 2).toFixed(1)}%`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Delivery Time Distribution</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '250px' }}>
                      <Bar 
                        data={timeDistributionChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Improvement Opportunities</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <h6>Route Optimization</h6>
                      <p className="text-muted small">Drivers could reduce delivery time by 15% with improved route planning.</p>
                      <ProgressBar variant="info" now={85} label="85% Optimized" />
                    </div>
                    <div className="mb-3">
                      <h6>Customer Communication</h6>
                      <p className="text-muted small">Better communication during delivery can improve customer ratings.</p>
                      <ProgressBar variant="info" now={70} label="70% Effective" />
                    </div>
                    <div>
                      <h6>Package Handling</h6>
                      <p className="text-muted small">Additional training can reduce package damage rates.</p>
                      <ProgressBar variant="info" now={90} label="90% Effective" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Regional Analysis Tab */}
          <Tab.Pane eventKey="regional">
            <Alert variant="info" className="mb-4">
              <div className="d-flex">
                <FaMapMarkerAlt className="me-2 mt-1" />
                <div>
                  <strong>Regional Performance Analysis</strong>
                  <p className="mb-0">Compare delivery metrics across different service regions to identify patterns and opportunities.</p>
                </div>
              </div>
            </Alert>

            <Row className="mb-4">
              <Col md={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Regional Comparison</h5>
                    <div>
                      <Form.Select style={{ width: 'auto' }} className="d-inline-block me-2">
                        <option>All Regions</option>
                        <option>North Zone</option>
                        <option>South Zone</option>
                        <option>East Zone</option>
                        <option>West Zone</option>
                        <option>Central Zone</option>
                      </Form.Select>
                      <Form.Select 
                        style={{ width: 'auto' }} 
                        className="d-inline-block"
                        value={comparisonPeriod}
                        onChange={(e) => setComparisonPeriod(e.target.value)}
                      >
                        <option value="previous">vs Previous Period</option>
                        <option value="year">vs Same Period Last Year</option>
                        <option value="target">vs Target</option>
                      </Form.Select>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '400px' }}>
                      <Bar 
                        data={regionalComparisonData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            x: {
                              grid: {
                                display: false
                              }
                            },
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Deliveries'
                              }
                            },
                            y1: {
                              position: 'right',
                              beginAtZero: true,
                              min: 90,
                              max: 100,
                              title: {
                                display: true,
                                text: 'On-Time Rate (%)'
                              },
                              grid: {
                                drawOnChartArea: false
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Row>
              <Col md={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Regional Performance Metrics</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table hover responsive className="align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th>Region</th>
                          <th>Deliveries</th>
                          <th>On-Time Rate</th>
                          <th>Avg. Delivery Time</th>
                          <th>Customer Satisfaction</th>
                          <th>Cost Efficiency</th>
                          <th>Performance Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceData.regionalPerformance.map((region, index) => {
                          // Calculate performance score - weighted average of metrics
                          const perfScore = (
                            (region.onTime * 0.4) + 
                            (region.satisfaction * 20 * 0.4) + 
                            ((1 - (region.cost / (region.deliveries * 25))) * 100 * 0.2)
                          ).toFixed(1);
                          
                          return (
                            <tr key={index}>
                              <td><strong>{region.region}</strong></td>
                              <td>{region.deliveries}</td>
                              <td>
                                <span className={`${region.onTime >= 95 ? 'text-success' : 'text-warning'}`}>
                                  {region.onTime.toFixed(1)}%
                                </span>
                              </td>
                              <td>{Math.floor(25 + Math.random() * 15)} min</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-2">{region.satisfaction.toFixed(1)}</div>
                                  <div>
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className={i < Math.floor(region.satisfaction) ? "text-warning" : "text-muted"}>★</span>
                                    ))}
                                  </div>
                                </div>
                              </td>
                              <td>${(region.cost / region.deliveries).toFixed(2)}/delivery</td>
                              <td>
                                <ProgressBar 
                                  variant={
                                    perfScore >= 95 ? "success" : 
                                    perfScore >= 90 ? "info" : 
                                    perfScore >= 85 ? "warning" : "danger"
                                  } 
                                  now={perfScore} 
                                  label={`${perfScore}%`}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Customer Satisfaction Tab */}
          <Tab.Pane eventKey="customer">
            <Alert variant="info" className="mb-4">
              <div className="d-flex">
                <FaStar className="me-2 mt-1" />
                <div>
                  <strong>Customer Satisfaction Analysis</strong>
                  <p className="mb-0">Detailed breakdown of customer feedback, ratings, and satisfaction metrics.</p>
                </div>
              </div>
            </Alert>

            <Row className="mb-4">
              <Col md={4}>
                {renderKpiCard('Customer Satisfaction', performanceData.kpis.customerSatisfaction, 'rating', <FaStar className="text-warning" />)}
              </Col>
              <Col md={4}>
                {renderKpiCard('Delivery Success Rate', performanceData.kpis.deliverySuccessRate, 'percent', <FaCheckCircle className="text-success" />)}
              </Col>
              <Col md={4}>
                {renderKpiCard('Average Delivery Time', performanceData.kpis.averageDeliveryTime, 'time', <FaClock className="text-info" />)}
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Customer Rating Distribution</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '350px' }}>
                      <Doughnut 
                        data={satisfactionChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Delivery Issue Breakdown</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '350px' }}>
                      <Doughnut 
                        data={issueTypesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Recent Customer Feedback</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table hover responsive>
                      <thead className="bg-light">
                        <tr>
                          <th>Customer</th>
                          <th>Delivery Date</th>
                          <th>Rating</th>
                          <th>Comments</th>
                          <th>Driver</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>ABC Corporation</td>
                          <td>May 1, 2025</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">5.0</div>
                              <div>★★★★★</div>
                            </div>
                          </td>
                          <td>"Excellent service, driver was very professional and delivery was on time."</td>
                          <td>Jane Smith</td>
                        </tr>
                        <tr>
                          <td>XYZ Inc.</td>
                          <td>April 30, 2025</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">4.0</div>
                              <div>★★★★☆</div>
                            </div>
                          </td>
                          <td>"Good service, but delivery was a bit later than the scheduled window."</td>
                          <td>John Doe</td>
                        </tr>
                        <tr>
                          <td>Acme LLC</td>
                          <td>April 29, 2025</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">5.0</div>
                              <div>★★★★★</div>
                            </div>
                          </td>
                          <td>"Very satisfied with the service. Driver helped unload the packages."</td>
                          <td>Sarah Williams</td>
                        </tr>
                        <tr>
                          <td>Global Tech</td>
                          <td>April 28, 2025</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">3.0</div>
                              <div>★★★☆☆</div>
                            </div>
                          </td>
                          <td>"Delivery was late and one package was slightly damaged."</td>
                          <td>Mike Johnson</td>
                        </tr>
                        <tr>
                          <td>Metro Corp</td>
                          <td>April 28, 2025</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">5.0</div>
                              <div>★★★★★</div>
                            </div>
                          </td>
                          <td>"Excellent service as always. Very reliable company."</td>
                          <td>David Wilson</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Financial Metrics Tab */}
          <Tab.Pane eventKey="financial">
            <Alert variant="info" className="mb-4">
              <div className="d-flex">
                <FaMoneyBillAlt className="me-2 mt-1" />
                <div>
                  <strong>Financial Performance Metrics</strong>
                  <p className="mb-0">Analyze revenue, costs, and profitability metrics for delivery operations.</p>
                </div>
              </div>
            </Alert>

            <Row className="mb-4">
              <Col md={4}>
                {renderKpiCard('Cost Per Delivery', performanceData.kpis.costPerDelivery, 'money', <FaMoneyBillAlt className="text-danger" />)}
              </Col>
              <Col md={4}>
                {renderKpiCard('Fuel Efficiency', performanceData.kpis.fuelEfficiency, 'percent', <FaRoad className="text-primary" />)}
              </Col>
              <Col md={4}>
                {renderKpiCard('Route Efficiency', performanceData.kpis.routeEfficiency, 'percent', <FaRoute className="text-info" />)}
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Revenue vs. Cost Trend</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '400px' }}>
                      <Bar 
                        data={financialTrendData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top'
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  let label = context.dataset.label || '';
                                  if (label) {
                                    label += ': ';
                                  }
                                  if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                  }
                                  return label;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Cost Breakdown Analysis</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={7}>
                        <Table hover responsive>
                          <thead className="bg-light">
                            <tr>
                              <th>Cost Category</th>
                              <th>Amount</th>
                              <th>% of Total</th>
                              <th>Per Delivery</th>
                              <th>vs Previous</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Driver Wages</td>
                              <td>$35,250</td>
                              <td>45.2%</td>
                              <td>$14.10</td>
                              <td className="text-success">-2.1%</td>
                            </tr>
                            <tr>
                              <td>Fuel</td>
                              <td>$18,750</td>
                              <td>24.0%</td>
                              <td>$7.50</td>
                              <td className="text-danger">+3.5%</td>
                            </tr>
                            <tr>
                              <td>Vehicle Maintenance</td>
                              <td>$8,325</td>
                              <td>10.7%</td>
                              <td>$3.33</td>
                              <td className="text-success">-1.2%</td>
                            </tr>
                            <tr>
                              <td>Insurance</td>
                              <td>$6,250</td>
                              <td>8.0%</td>
                              <td>$2.50</td>
                              <td className="text-muted">0.0%</td>
                            </tr>
                            <tr>
                              <td>Administrative</td>
                              <td>$9,425</td>
                              <td>12.1%</td>
                              <td>$3.77</td>
                              <td className="text-success">-0.8%</td>
                            </tr>
                          </tbody>
                          <tfoot className="bg-light">
                            <tr>
                              <th>Total Costs</th>
                              <th>$78,000</th>
                              <th>100%</th>
                              <th>$31.20</th>
                              <th className="text-success">-0.5%</th>
                            </tr>
                          </tfoot>
                        </Table>
                      </Col>
                      <Col md={5}>
                        <div style={{ height: '300px' }}>
                          <Doughnut 
                            data={{
                              labels: ['Driver Wages', 'Fuel', 'Vehicle Maintenance', 'Insurance', 'Administrative'],
                              datasets: [{
                                data: [45.2, 24.0, 10.7, 8.0, 12.1],
                                backgroundColor: [
                                  'rgba(75, 192, 192, 0.6)',
                                  'rgba(255, 99, 132, 0.6)',
                                  'rgba(255, 206, 86, 0.6)',
                                  'rgba(153, 102, 255, 0.6)',
                                  'rgba(54, 162, 235, 0.6)'
                                ]
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'right'
                                }
                              }
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default PerformanceDashboard;