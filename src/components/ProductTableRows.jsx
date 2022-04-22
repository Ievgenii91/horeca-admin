import React from 'react';
import { FaTrash, FaRegCheckCircle, FaRegTimesCircle, FaFunnelDollar, FaHotdog, FaRegDizzy } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';

export default function ProductTableRows(props) {
  const {
    name,
    price,
    description,
    id,
    available,
    type,
    category,
    removeClientProduct,
    showEditModal,
    visible,
    images,
    categories,
    tags,
    weight,
    capacity,
    toggleAvailability,
  } = props;
  const hasImage = !!(images && images.length);
  const hasSizes = capacity || weight;
  return (
    <tr>
      <td className="p-1 pr-3 pl-3">
        <button
          type="button"
          className="btn btn-link p-0 text-left"
          onClick={(e) => {
            e.preventDefault();
            showEditModal(id);
          }}
        >
          {name}
        </button>
      </td>
      <td className="p-1 pr-3 pl-3 text-center d-flex align-items-baseline">
        <Form.Group className="mb-3">
          <Form.Check className="check" type="checkbox" onChange={() => toggleAvailability(id)} defaultChecked={available} />
        </Form.Group>
        <span className="ml-4">
          {type === 'bar' ? <FaFunnelDollar className="text-warning" /> : <FaHotdog className="text-info" />}
        </span>
      </td>
      {/* <td className="p-1 pr-3 pl-3">
        {visible ? <FaRegCheckCircle className="text-success" /> : <FaRegTimesCircle className="text-danger" />}
      </td>
      <td className="p-1 pr-3 pl-3">
        {hasImage && <FaRegCheckCircle className="text-success" />}
        {!hasImage && <FaRegDizzy className="text-danger" />}{' '}
      </td> */}
      <td className="p-1 pr-3 pl-3">{price}</td>
      <td className="p-1 pr-3 pl-3">{description}</td>
      <td className="p-1 pr-3 pl-3">{categories.find((v) => v.entityId === category)?.name}</td>
      {/* <td className="p-1 pr-3 pl-3">{tags}</td> */}
      <td className="p-1 pr-3 pl-3">
        {weight || capacity} {hasSizes ? (weight ? 'мг' : 'мл') : ''}
      </td>
      <td className="p-1 pr-3 pl-3">
        <FaTrash
          className="text-info"
          onClick={(e) => {
            removeClientProduct(id);
          }}
        />
      </td>
    </tr>
  );
}
