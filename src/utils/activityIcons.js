import React from 'react';
import { 
  FaUser, 
  FaBuilding, 
  FaCheckCircle, 
  FaPhone, 
  FaEnvelope,
  FaEdit,
  FaPlusCircle,
  FaTrash,
  FaStickyNote,
  FaTruck,
  FaMoneyBillWave,
  FaTasks
} from 'react-icons/fa';

export const getActivityIcon = (type, action) => {
  const getIconByType = () => {
    switch (type) {
      case 'lead':
        return <FaUser className="text-primary" />;
      case 'contact':
        return <FaUser className="text-info" />;
      case 'company':
        return <FaBuilding className="text-secondary" />;
      case 'task':
        return <FaTasks className="text-warning" />;
      case 'delivery':
        return <FaTruck className="text-success" />;
      case 'transaction':
        return <FaMoneyBillWave className="text-danger" />;
      default:
        return <FaEdit className="text-muted" />;
    }
  };

  const getIconByAction = () => {
    switch (action) {
      case 'created':
        return <FaPlusCircle className="text-success" />;
      case 'updated':
        return <FaEdit className="text-primary" />;
      case 'deleted':
        return <FaTrash className="text-danger" />;
      case 'completed':
        return <FaCheckCircle className="text-success" />;
      case 'called':
        return <FaPhone className="text-primary" />;
      case 'emailed':
        return <FaEnvelope className="text-info" />;
      case 'note':
        return <FaStickyNote className="text-warning" />;
      default:
        return <FaEdit className="text-muted" />;
    }
  };

  // Prioritize action icons, fallback to type icons
  if (['created', 'updated', 'deleted', 'completed', 'called', 'emailed', 'note'].includes(action)) {
    return getIconByAction();
  }
  
  return getIconByType();
};