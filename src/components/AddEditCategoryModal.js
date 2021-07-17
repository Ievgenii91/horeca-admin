import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import EditCategory from './EditCategory';

function ADdEditCategoryModal({ data, edit, visible, onConfirm, onCancel }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!!visible);
  }, [visible]);

  const hide = () => {
    setShow(false);
    onCancel();
  };

  return (
    <Modal show={show} onHide={hide} size="xl">
      <Modal.Header>
        <Modal.Title>{edit ? 'Редагування категорії' : 'Додати категорію'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditCategory
          data={data}
          submit={onConfirm}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="category-form" variant="primary" className="mr-2">
          Зберегти
        </Button>
        <Button variant="secondary" onClick={hide}>
          Закрити
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ADdEditCategoryModal.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ADdEditCategoryModal;
