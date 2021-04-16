import React from 'react';
import { FaTrash, FaRegCheckCircle, FaRegTimesCircle, FaFunnelDollar, FaHotdog } from 'react-icons/fa';

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
  } = props;
  return (
    <tr>
      <td className="p-1 pr-3 pl-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            showEditModal(id);
          }}
        >
          {name}
        </a>
      </td>
      <td className="p-1 pr-3 pl-3">{fancyName}</td>
      <td className="p-1 pr-3 pl-3">{price}</td>
      <td className="p-1 pr-3 pl-3">{description}</td>
      <td className="p-1 pr-3 pl-3 text-center">
        {available ? <FaRegCheckCircle className="text-success" /> : <FaRegTimesCircle className="text-danger" />}
        <span className="ml-4">
          {type === 'bar' ? <FaFunnelDollar className="text-warning" /> : <FaHotdog className="text-info" />}
        </span>
      </td>
      <td className="p-1 pr-3 pl-3">{category}</td>
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
