import React from 'react';
import Button from 'react-bootstrap/Button';
import Timer from './Timer';
import { FaCheck } from 'react-icons/fa';

function calculateTotal(products) {
  let sum = 0;
  products.forEach((p) => {
    if (p.total) {
      sum += p.total || 0;
    } else {
      sum = sum + p.price * p.count;
    }
  });
  return sum;
}

function SortedProductsList({ products }) {
  return (
    <div>
      {products
        .sort((a, b) => {
          return a.type === 'bar' && b.type !== 'bar' ? 1 : -1;
        })
        .map((v, i) => {
          let classStr = v.type === 'bar' ? 'bar-line' : 'food-line';
          return (
            <p className={'p-2 pl-0 m-0 ' + classStr} key={`product-${i}`}>
              {v.count} {v.name}
            </p>
          );
        })}
    </div>
  );
}

export default function Order({ date, id, products, initiator, markAsDone, room, clientId }) {
  return (
    <div className="col-3 col-sm-4 mt-2 p-1">
      <div className="p-2 order-card shadow-sm rounded">
        <h5 className="p-2 mb-0">
          {calculateTotal(products)} грн{' '}
          <span className="float-right">
            <Timer date={date} />
          </span>
        </h5>
        <p className="pr-2 pl-2 m-0 p-0">
          <b>{id}</b>
          {/*<span className={'badge badge-primary'}>{isBot ? 'bot' : '1C'}</span>*/}
        </p>
        <SortedProductsList products={products} />
        <Button variant="primary" className="mt-2 mb-2 w-100" onClick={() => markAsDone(id, room, clientId)}>
          <FaCheck className="mb-1 mr-2" />
          <b>ГОТОВО</b>
        </Button>
      </div>
    </div>
  );
}
