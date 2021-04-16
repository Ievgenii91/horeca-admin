import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

export default function ConfirmModal({ visible, message, title, onCancel, onConfirm, okButtonText, cancelButtonText }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!!visible);
  }, [visible]);

  if (!onConfirm) {
    throw new Error('onConfirm not declared');
  }
  return (
    <Modal
      show={show}
      onHide={() => {
        if (typeof onCancel === 'function') {
          setShow(false);
          onCancel();
        }
      }}
    >
      <Modal.Header>
        <Modal.Title>{title || 'Підтвердіть операцію'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || 'Ви дійсно бажаєте виконати дану операцію ?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm} className="mr-2">
          {okButtonText || 'Так'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
            if (typeof onCancel === 'function') {
              onCancel();
            }
          }}
        >
          {cancelButtonText || 'Ні'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
