// src/components/common/PageTitle.js
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BackButton from './BackButton';

const PageTitle = ({ 
  title,
  subtitle,
  backButton = true,
  actionButton = null,
  actionButtonLink = '',
  actionButtonText = 'Add New',
  actionButtonIcon = null
}) => {
  return (
    <Row className="mb-4 align-items-center">
      <Col>
        <div className="d-flex align-items-center">
          {backButton && <BackButton className="me-3" />}
          <div>
            <h1 className="mb-0">{title}</h1>
            {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
          </div>
        </div>
      </Col>
      
      {actionButton && (
        <Col xs="auto">
          <Button
            as={Link}
            to={actionButtonLink}
            variant="primary"
          >
            {actionButtonIcon && <span className="me-1">{actionButtonIcon}</span>}
            {actionButtonText}
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default PageTitle;