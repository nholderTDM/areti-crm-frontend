import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaLock, FaEnvelope } from 'react-icons/fa';
import { login } from '../../services/authService'; // Adjust the import path as necessary

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { email, password } = formData;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  
  try {
    console.log("Login attempt with:", email);
    const response = await login(email, password);
    console.log('Login successful, response:', response);

    // Debug localStorage content
    console.log('DEBUG: Checking localStorage after login');
    console.log('token:', localStorage.getItem('token'));
    console.log('user:', localStorage.getItem('user'));
    
    // Force the token to be available in multiple formats
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      
      // Ensure app:auth is set
      const authData = { token, user };
      localStorage.setItem('app:auth', JSON.stringify(authData));
    }
    
    // Immediately navigate to dashboard without delay
    console.log('Navigating to dashboard...');
    window.location.href = '/dashboard'; // Force a full page reload to dashboard
  } catch (err) {
    console.error('Login error:', err);
    setError(typeof err === 'string' ? err : 'Invalid credentials. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <div className="text-center mb-4">
            <h1 className="h2">Areti Alliance</h1>
            <p className="text-muted">Dashboard Login</p>
          </div>
          
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h2 className="h4 mb-4 text-center">Sign In</h2>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between">
                    <Form.Label>Password</Form.Label>
                    <Link to="/forgot-password" className="small text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </InputGroup>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2" /> Sign In
                    </>
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Need support? <a href="mailto:support@aretialliance.com">Contact Support</a>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              &copy; {new Date().getFullYear()} Areti Alliance. All rights reserved.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;