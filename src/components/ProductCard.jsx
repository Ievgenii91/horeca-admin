import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { FaBox, FaBoxOpen, FaEdit, FaTrash } from 'react-icons/fa';
import EditProduct from './EditProduct';

export default function ProductCard(props) {
  const {
    name,
    price,
    description,
    id,
    available,
    editMode,
    crossSales,
    usedForCrossSales,
    availableCrossSales,
    updateClientProductAvailability,
    toggleEditMode,
    removeClientProduct,
  } = props;
  const hasCrossSales = !!(crossSales && crossSales.length);
  return (
    <div className="card w-20 m-2 shadow-sm float-left">
      {editMode ? (
        <EditProduct {...props} availableCrossSales={availableCrossSales} />
      ) : (
        <div className="card-body p-2 pb-0">
          <h5 className="card-title">
            {name} {!available && <Badge variant="warning">Закінчився</Badge>}
            {usedForCrossSales && <Badge variant="success">Додаток</Badge>}
            {hasCrossSales && <Badge variant="info">Є кросейли</Badge>}
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">Ціна: {price} гривень</h6>
          <p className="card-text">{description}</p>
          <div className={'row'}>
            <div className={'col'}>
              <Button
                variant="secondary"
                className={'w-100'}
                onClick={(e) => {
                  e.preventDefault();
                  toggleEditMode(id);
                }}
              >
                <FaEdit size={24} />
              </Button>
            </div>
            <div className={'col'}>
              <Button
                variant="warning"
                className={'w-100'}
                onClick={(e) => {
                  e.preventDefault();
                  updateClientProductAvailability({ id, available: !available });
                }}
              >
                {available ? <FaBox size={24} /> : <FaBoxOpen size={24} />}
              </Button>
            </div>
            <div className={'col'}>
              <Button
                variant="danger"
                className={'w-100'}
                onClick={(e) => {
                  e.preventDefault();
                  removeClientProduct(id);
                }}
              >
                <FaTrash size={24} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
