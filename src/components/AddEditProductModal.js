import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import EditProduct from './EditProduct';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function AddEditProductModal({ product, availableCrossSales, edit, visible, onConfirm, onCancel }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!!visible);
  }, [visible]);

  const hide = () => {
    setShow(false);
    onCancel();
  };

  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header>
        <Modal.Title>{edit ? 'Редагування продукту' : 'Додати продукт'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditProduct product={product} availableCrossSales={availableCrossSales} submit={onConfirm} />
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="product-form" variant="primary" className="mr-2">
          Зберегти
        </Button>
        <Button variant="secondary" onClick={hide}>
          Закрити
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AddEditProductModal.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AddEditProductModal;
