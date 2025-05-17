// src/components/layout/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { isLoggedIn } from '../../services/authService';
import { 
  FaTachometerAlt, FaUsers, FaBuilding, FaUserTie, 
  FaTruckMoving, FaChartLine, FaChartBar, FaFileAlt, FaCog, FaBars, 
  FaUserCircle, FaSignOutAlt, FaCheckSquare, FaCarAlt, FaRoute, FaRocket
} from 'react-icons/fa';
import { ensureSessionActive } from '../../utils/tokenRestore';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Authentication check on navigation
  useEffect(() => {
    const { pathname } = location;
    console.log('Dashboard: Current path is', pathname);
    
    // More robust auth checking
    const checkAuthOnNavigation = () => {
      console.log('Dashboard navigation auth check - raw storage state:');
      console.log('token:', !!localStorage.getItem('token'));
      console.log('user:', !!localStorage.getItem('user'));
      console.log('app:auth:', !!localStorage.getItem('app:auth'));
      
      // First try to restore tokens if needed
      const loggedIn = ensureSessionActive();
      console.log('Dashboard navigation check - calculated loggedIn:', loggedIn);
      
      if (!loggedIn) {
        console.log('Dashboard detected auth loss during navigation, redirecting to login');
        navigate('/login');
        return false;
      }
      
      return true;
    };
    
    checkAuthOnNavigation();
    
    return () => {
      console.log('Dashboard component unmounting from path:', pathname);
    };
  }, [location.pathname, navigate]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    console.log("Sidebar toggled to:", !sidebarCollapsed);
    
    // Force a DOM update if needed
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Navigation items for sidebar
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt color="#4285F4" />, color: "#4285F4" }, // Blue
    { path: '/leads', label: 'Leads', icon: <FaUserTie color="#EA4335" />, color: "#EA4335" }, // Red
    { path: '/lead-generator', label: 'Lead Generator', icon: <FaRocket color="#FF7043" />, color: "#FF7043" }, // Deep Orange
    { path: '/tasks', label: 'Tasks', icon: <FaCheckSquare color="#FBBC05" />, color: "#FBBC05" }, // Yellow
    { path: '/contacts', label: 'Contacts', icon: <FaUsers color="#34A853" />, color: "#34A853" }, // Green
    { path: '/companies', label: 'Companies', icon: <FaBuilding color="#8E44AD" />, color: "#8E44AD" }, // Purple
    { path: '/deliveries', label: 'Deliveries', icon: <FaTruckMoving color="#F4511E" />, color: "#F4511E" }, // Orange
    { path: '/drivers', label: 'Drivers', icon: <FaCarAlt color="#42A5F5" />, color: "#42A5F5" }, // Light Blue
    { path: '/routes', label: 'Routes', icon: <FaRoute color="#7CB342" />, color: "#7CB342" }, // Light Green
    { path: '/financial', label: 'Financial', icon: <FaChartLine color="#00ACC1" />, color: "#00ACC1" }, // Cyan
    { path: '/reporting', label: 'Reports', icon: <FaFileAlt color="#9CCC65" />, color: "#9CCC65" }, // Light Green
    { path: '/performance', label: 'Performance', icon: <FaChartBar color="#EC407A" />, color: "#EC407A" }, // Pink
    { path: '/settings', label: 'Settings', icon: <FaCog color="#78909C" />, color: "#78909C" }, // Blue Gray
  ];
  

  return (
    <div className="d-flex" style={{minHeight: "100vh", backgroundColor: "#f8f9fa"}}>
      {/* Sidebar */}
      <div className={`sidebar bg-dark text-white ${sidebarCollapsed ? 'collapsed' : ''}`} 
           style={{width: sidebarCollapsed ? '70px' : '250px', transition: 'width 0.3s ease'}}>
        <div className="sidebar-header p-3 border-bottom border-secondary d-flex align-items-center">
          {!sidebarCollapsed && <h4 className="m-0">Areti CRM</h4>}
          {sidebarCollapsed && <h4 className="m-0 text-center w-100">A</h4>}
        </div>
        <div className="sidebar-content">
          <Nav className="flex-column">
            {navItems.map((item) => (
              <Nav.Item key={item.path}>
                <Nav.Link 
  as={Link} 
  to={item.path} 
  className={`nav-link py-3 ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
  style={{
    borderLeft: location.pathname.startsWith(item.path) ? `3px solid ${item.color}` : '3px solid transparent'
  }}
>
  <span className="icon me-2">{item.icon}</span>
  {!sidebarCollapsed && <span className="label">{item.label}</span>}
</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content flex-grow-1 bg-white">
        {/* Header */}
        <Navbar bg="white" expand="lg" className="border-bottom">
          <Container fluid>
            <Button 
              variant="light" 
              className="border-0 sidebar-toggle"
              onClick={toggleSidebar}
            >
              <FaBars />
            </Button>
            
            <Navbar.Brand as={Link} to="/dashboard">Areti Alliance CRM</Navbar.Brand>
            
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center">
                  <FaUserCircle className="me-2" />
                  <span>
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/settings">My Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
        {/* Page Content */}
        <Container fluid className="p-0">
          <div className="page-content p-3 p-md-4">
            <Outlet />
          </div>
        </Container>
        
        {/* Footer */}
        <footer className="footer mt-auto py-3 bg-light">
          <Container fluid className="text-center">
            <span className="text-muted">© {new Date().getFullYear()} Areti Alliance CRM. All rights reserved.</span>
          </Container>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;