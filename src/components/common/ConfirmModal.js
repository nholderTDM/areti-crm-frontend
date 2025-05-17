import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  confirmButtonVariant = 'primary',
  cancelButtonText = 'Cancel'
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelButtonText}
        </Button>
        <Button variant={confirmButtonVariant} onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;