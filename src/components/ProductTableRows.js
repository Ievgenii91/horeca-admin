import React from 'react';
import { FaTrash, FaRegCheckCircle, FaRegTimesCircle, FaFunnelDollar, FaHotdog, FaRegDizzy } from 'react-icons/fa';

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
    fancyName,
    images,
    categories,
  } = props;
  const hasImage = !!(images && images.length);
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
      <td className="p-1 pr-3 pl-3">{fancyName}</td>
      <td className="p-1 pr-3 pl-3">
        {hasImage && <FaRegCheckCircle className="text-success" />}
        {!hasImage && <FaRegDizzy className="text-danger" />}{' '}
      </td>
      <td className="p-1 pr-3 pl-3">{price}</td>
      <td className="p-1 pr-3 pl-3">{description}</td>
      <td className="p-1 pr-3 pl-3 text-center">
        {available ? <FaRegCheckCircle className="text-success" /> : <FaRegTimesCircle className="text-danger" />}
        <span className="ml-4">
          {type === 'bar' ? <FaFunnelDollar className="text-warning" /> : <FaHotdog className="text-info" />}
        </span>
      </td>
      <td className="p-1 pr-3 pl-3">{categories.find((v) => v.entityId === category)?.name}</td>
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
