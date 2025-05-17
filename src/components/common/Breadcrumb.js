// src/components/common/Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb as BootstrapBreadcrumb } from 'react-bootstrap';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Maps route segments to human-readable names
  const getPathName = (path) => {
    const routeMapping = {
      'dashboard': 'Dashboard',
      'leads': 'Leads',
      'contacts': 'Contacts',
      'companies': 'Companies',
      'deliveries': 'Deliveries',
      'financial': 'Financial',
      'drivers': 'Drivers',
      'performance': 'Performance',
      'reporting': 'Reporting',
      'settings': 'Settings',
      'new': 'New',
      'edit': 'Edit',
      'import': 'Import',
      'script': 'Script Navigator',
      'lead-generator': 'Lead Generator',
      'track': 'Tracking',
      'transactions': 'Transactions',
      'budget': 'Budget',
      'reports': 'Reports',
      'invoices': 'Invoices',
      'expenses': 'Expenses',
      'accounts': 'Accounts',
      'schedule': 'Schedule',
    };
    
    // For IDs in the path (usually numeric or alphanumeric)
    if (path.match(/^\d+$/)) {
      return 'Details';
    }
    
    return routeMapping[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <BootstrapBreadcrumb className="bg-light py-2 px-3 rounded mb-4">
      <BootstrapBreadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
        Home
      </BootstrapBreadcrumb.Item>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        
        return last ? (
          <BootstrapBreadcrumb.Item active key={to}>
            {getPathName(value)}
          </BootstrapBreadcrumb.Item>
        ) : (
          <BootstrapBreadcrumb.Item linkAs={Link} linkProps={{ to }} key={to}>
            {getPathName(value)}
          </BootstrapBreadcrumb.Item>
        );
      })}
    </BootstrapBreadcrumb>
  );
};

export default Breadcrumb;