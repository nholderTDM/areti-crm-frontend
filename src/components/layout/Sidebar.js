import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', icon: '🏠', title: 'Overview' },
  { path: '/tasks', icon: '✅', title: 'Tasks' },
  { path: '/leads', icon: '📞', title: 'Leads' },
  { path: '/lead-generator', icon: '🔍', title: 'Lead Generator' },
  { path: '/contacts', icon: '👥', title: 'Contacts' },
  { path: '/companies', icon: '🏢', title: 'Companies' },
  { path: '/routes', icon: '🗺️', title: 'Routes' },
  { path: '/drivers', icon: '🚗', title: 'Drivers' },
  { path: '/deliveries', icon: '🚚', title: 'Deliveries' },
  { path: '/financial', icon: '💰', title: 'Financial' },
  { path: '/reporting', icon: '📈', title: 'Reports' },
  { path: '/performance', icon: '📊', title: 'Performance' },
  { path: '/settings', icon: '⚙️', title: 'Settings' }
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  return (
    <div className={`sidebar bg-dark text-white ${isOpen ? 'open' : 'closed'}`} style={{ width: isOpen ? '250px' : '70px', height: '100vh' }}>
      <div className="sidebar-header p-3 text-center border-bottom">
        <h4 className="m-0">{isOpen ? 'Areti CRM' : 'A'}</h4>
      </div>
      
      <Nav className="flex-column mt-2">
        {menuItems.map((item, index) => (
          <Nav.Item key={index}>
            <Nav.Link 
              as={Link} 
              to={item.path}
              className={`text-white py-3 ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span style={{ marginRight: '10px' }}>{item.icon}</span>
              {isOpen && <span>{item.title}</span>}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;