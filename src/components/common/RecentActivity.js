// src/components/common/RecentActivity.js
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaUser, FaTruck, FaFileAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'lead',
      description: 'New lead created: Michael Johnson',
      time: '10 minutes ago',
      icon: <FaUser className="text-primary" />
    },
    {
      id: 2,
      type: 'delivery',
      description: 'Delivery DEL-1002 marked as completed',
      time: '45 minutes ago',
      icon: <FaTruck className="text-success" />
    },
    {
      id: 3,
      type: 'document',
      description: 'Invoice #INV-2023-05-12 generated',
      time: '2 hours ago',
      icon: <FaFileAlt className="text-info" />
    },
    {
      id: 4,
      type: 'call',
      description: 'Phone call with ABC Corp scheduled',
      time: '3 hours ago',
      icon: <FaPhoneAlt className="text-warning" />
    },
    {
      id: 5,
      type: 'email',
      description: 'Follow-up email sent to Jane Smith',
      time: '5 hours ago',
      icon: <FaEnvelope className="text-secondary" />
    }
  ];

  return (
    <ListGroup variant="flush">
      {activities.map(activity => (
        <ListGroup.Item key={activity.id} className="px-0 py-3 border-bottom">
          <div className="d-flex">
            <div className="me-3">
              <div className="bg-light rounded-circle p-2">
                {activity.icon}
              </div>
            </div>
            <div>
              <p className="mb-1">{activity.description}</p>
              <small className="text-muted">{activity.time}</small>
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RecentActivity;