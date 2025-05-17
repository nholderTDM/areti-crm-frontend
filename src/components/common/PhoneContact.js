// src/components/common/PhoneContact.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPhone, FaComment } from 'react-icons/fa';
import { formatPhoneForDisplay, getCallRedirectUrl, getSmsRedirectUrl } from '../../utils/phoneUtils';

const PhoneContact = ({ 
  phoneNumber, 
  showSms = true, 
  buttonVariant = 'outline-primary'
}) => {
  if (!phoneNumber) return null;
  
  return (
    <div className="d-flex align-items-center">
      <span className="me-2">{formatPhoneForDisplay(phoneNumber)}</span>
      <a href={getCallRedirectUrl(phoneNumber)} className="me-1">
        <Button size="sm" variant={buttonVariant}>
          <FaPhone className="me-1" /> Call
        </Button>
      </a>
      
      {showSms && (
        <a href={getSmsRedirectUrl(phoneNumber)}>
          <Button size="sm" variant={buttonVariant}>
            <FaComment className="me-1" /> Text
          </Button>
        </a>
      )}
    </div>
  );
};

export default PhoneContact;