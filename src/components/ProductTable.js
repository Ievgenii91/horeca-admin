import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import ProductTableRows from './ProductTableRows';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../styles/table.css';

export default function ProductTable({ products, categories, showEditModal, removeItem, sort }) {
  const [nameSortedAsc, setNameSortedAsc] = useState(false);
  const [priceSortedAsc, setPriceSortedAsc] = useState(false);

  const changeSortName = () => {
    sort('name', nameSortedAsc);
    setNameSortedAsc(!nameSortedAsc);
  };

  const changeSortPrice = () => {
    sort('price', priceSortedAsc);
    setPriceSortedAsc(!priceSortedAsc);
  };

  return (
    <div className="row">
      {!!products.length && (
        <Table className="table-list">
          <thead>
            <tr>
              <th>
                Назва{' '}
                {nameSortedAsc ? <FaAngleDown onClick={changeSortName} /> : <FaAngleUp onClick={changeSortName} />}
              </th>
              <th>Fancy назва</th>
              <th>фото?</th>
              <th>
                Ціна ₴{' '}
                {priceSortedAsc ? <FaAngleDown onClick={changeSortPrice} /> : <FaAngleUp onClick={changeSortPrice} />}
              </th>
              <th>Опис</th>
              <th className="text-center">Наявність/Бар</th>
              <th>Категорія</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((v) => v.visible)
              .map((v, index) => (
                <ProductTableRows
                  categories={categories}
                  key={'ts_' + index}
                  {...v}
                  showEditModal={showEditModal}
                  removeClientProduct={removeItem}
                />
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
