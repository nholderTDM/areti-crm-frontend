import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
      <Button 
        variant="light" 
        className="border-0 me-2" 
        onClick={toggleSidebar}
      >
        ☰
      </Button>
      
      <Navbar.Brand href="/dashboard" className="me-auto">
        Areti Alliance CRM
      </Navbar.Brand>
      
      <Nav className="ms-auto">
        <NavDropdown 
          title={
            <span>
              👤 {currentUser?.firstName || 'User'}
            </span>
          } 
          id="user-dropdown"
        >
          <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};

export default Header;