// frontend/src/components/common/PageNotFound.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import BackButton from '../common/BackButton';

const PageNotFound = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5 text-center">
              <h1 className="display-1 fw-bold text-danger">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              <p className="mb-4">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
              </p>
              <Button as={Link} to="/dashboard" variant="primary">
                <FaHome className="me-2" /> Return to Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PageNotFound;