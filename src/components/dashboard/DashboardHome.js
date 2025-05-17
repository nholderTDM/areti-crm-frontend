// src/components/dashboard/DashboardHome.js - Full version
import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Table, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaUserPlus, FaTruck, FaCheckCircle, FaClock, FaUsers, FaBuilding, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import RecentActivity from '../common/RecentActivity';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardHome = () => {
  console.log('DashboardHome is rendering!');
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    leadStats: {
      total: 86,
      new: 12,
      contacted: 24,
      qualified: 18,
      proposal: 15,
      won: 10,
      lost: 7,
    },
    deliveryStats: {
      total: 152,
      completed: 125,
      inProgress: 15,
      scheduled: 12,
    },
    recentLeads: [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        company: 'ABC Corp',
        status: 'new',
        createdAt: new Date('2025-04-28'),
      },
      {
        _id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'XYZ Inc',
        status: 'contacted',
        createdAt: new Date('2025-04-27'),
      },
      {
        _id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        company: 'Acme LLC',
        status: 'qualified',
        createdAt: new Date('2025-04-26'),
      },
    ],
    upcomingDeliveries: [
      {
        _id: '1',
        deliveryId: 'DEL-1001',
        customer: { name: 'ABC Corp' },
        scheduledDate: new Date('2025-05-15'),
        status: 'scheduled',
      },
      {
        _id: '2',
        deliveryId: 'DEL-1002',
        customer: { name: 'XYZ Inc' },
        scheduledDate: new Date('2025-05-16'),
        status: 'scheduled',
      },
      {
        _id: '3',
        deliveryId: 'DEL-1003',
        customer: { name: 'Acme LLC' },
        scheduledDate: new Date('2025-05-17'),
        status: 'scheduled',
      },
    ],
    tasks: [
      { _id: '1', title: 'Follow up with client', dueDate: new Date('2025-05-14'), priority: 'high' },
      { _id: '2', title: 'Prepare proposal', dueDate: new Date('2025-05-15'), priority: 'medium' },
      { _id: '3', title: 'Send invoice', dueDate: new Date('2025-05-16'), priority: 'low' }
    ],
    drivers: [
      { _id: '1', name: 'David Miller', status: 'Active', deliveries: 8 },
      { _id: '2', name: 'Sarah Wilson', status: 'En Route', deliveries: 5 },
      { _id: '3', name: 'James Thompson', status: 'Break', deliveries: 6 }
    ],
    routes: [
      { _id: '1', name: 'Downtown Route', deliveries: 12, status: 'Active' },
      { _id: '2', name: 'North Zone', deliveries: 8, status: 'Scheduled' },
      { _id: '3', name: 'South Metro', deliveries: 10, status: 'Complete' }
    ]
  });

  useEffect(() => {
    console.log('DashboardHome component mounted');
    // Simulate data loading and stop loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('DashboardHome: Loading complete');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  console.log('DashboardHome rendering, isLoading:', isLoading);
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  // Chart data for Lead Funnel
  const leadChartData = {
    labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'],
    datasets: [
      {
        label: 'Lead Status',
        data: [
          dashboardData.leadStats.new,
          dashboardData.leadStats.contacted,
          dashboardData.leadStats.qualified,
          dashboardData.leadStats.proposal,
          dashboardData.leadStats.won,
          dashboardData.leadStats.lost,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(39, 174, 96, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for Delivery Status
  const deliveryChartData = {
    labels: ['Completed', 'In Progress', 'Scheduled'],
    datasets: [
      {
        label: 'Delivery Status',
        data: [
          dashboardData.deliveryStats.completed,
          dashboardData.deliveryStats.inProgress,
          dashboardData.deliveryStats.scheduled,
        ],
        backgroundColor: [
          'rgba(39, 174, 96, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      
      {/* KPI Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-primary bg-opacity-10 rounded p-3 me-3">
                <FaUserPlus className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Leads</h6>
                <h3 className="mb-0">{dashboardData.leadStats.total}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-success bg-opacity-10 rounded p-3 me-3">
                <FaCheckCircle className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Qualified Leads</h6>
                <h3 className="mb-0">{dashboardData.leadStats.qualified}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-info bg-opacity-10 rounded p-3 me-3">
                <FaTruck className="text-info" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Deliveries</h6>
                <h3 className="mb-0">{dashboardData.deliveryStats.total}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-wrapper bg-warning bg-opacity-10 rounded p-3 me-3">
                <FaClock className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Pending Deliveries</h6>
                <h3 className="mb-0">{dashboardData.deliveryStats.scheduled}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Charts Row */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="mb-0">Lead Pipeline</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Doughnut 
                  data={leadChartData} 
                  options={{ 
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
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="mb-0">Delivery Status</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Doughnut 
                  data={deliveryChartData} 
                  options={{ 
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
      
      {/* Tables Row */}
      <Row>
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Leads</h5>
              <Button as={Link} to="/leads" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.firstName} {lead.lastName}</td>
                      <td>{lead.company}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Deliveries</h5>
              <Button as={Link} to="/deliveries" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.upcomingDeliveries.map((delivery) => (
                    <tr key={delivery._id}>
                      <td>{delivery.deliveryId}</td>
                      <td>{delivery.customer.name}</td>
                      <td>{formatDate(delivery.scheduledDate)}</td>
                      <td>
                        <span className={`badge bg-${getDeliveryStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Rows for Tasks and Drivers */}
      <Row>
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Tasks</h5>
              <Button as={Link} to="/tasks" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Task</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.tasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{formatDate(task.dueDate)}</td>
                      <td>
                        <span className={`badge bg-${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Active Drivers</h5>
              <Button as={Link} to="/drivers" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Deliveries</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.drivers.map((driver) => (
                    <tr key={driver._id}>
                      <td>{driver.name}</td>
                      <td>
                        <span className={`badge bg-${getDriverStatusColor(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td>{driver.deliveries}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Routes Row */}
      <Row>
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Current Routes</h5>
              <Button as={Link} to="/routes" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Route Name</th>
                    <th>Deliveries</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.routes.map((route) => (
                    <tr key={route._id}>
                      <td>{route.name}</td>
                      <td>{route.deliveries}</td>
                      <td>
                        <span className={`badge bg-${getRouteStatusColor(route.status)}`}>
                          {route.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <RecentActivity />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Helper function to get status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'new':
      return 'primary';
    case 'contacted':
      return 'info';
    case 'qualified':
      return 'warning';
    case 'proposal':
      return 'secondary';
    case 'closed-won':
    case 'won':
      return 'success';
    case 'closed-lost':
    case 'lost':
      return 'danger';
    default:
      return 'light';
  }
};

// Helper function to get delivery status colors
const getDeliveryStatusColor = (status) => {
  switch (status) {
    case 'scheduled':
      return 'warning';
    case 'in-progress':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'delayed':
      return 'secondary';
    default:
      return 'light';
  }
};

// Helper function to get priority colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'secondary';
  }
};

// Helper function to get driver status colors
const getDriverStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'En Route':
      return 'primary';
    case 'Break':
      return 'warning';
    case 'Off Duty':
      return 'secondary';
    default:
      return 'light';
  }
};

// Helper function to get route status colors
const getRouteStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Scheduled':
      return 'primary';
    case 'Complete':
      return 'secondary';
    case 'Delayed':
      return 'warning';
    default:
      return 'light';
  }
};

// Helper function to format dates
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

export default DashboardHome;