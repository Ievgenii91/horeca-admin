import React from 'react';
import { FaAngleUp, FaAngleDown, FaFilter } from 'react-icons/fa';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import styles from './Table.module.css';

const SmartHeader = ({ cols, onSort, onFilter }) => {
  const onSubmit = (e, prop) => {
    e.preventDefault();
    const data = new FormData(document.querySelector('#' + prop));
    if (typeof onFilter === 'function') {
      onFilter(prop, data.get(prop));
    }
  };

  return (
    <thead>
      <tr>
        {cols.map(({ title, prop, sorted }, index) => (
          <th key={index} className={styles.header}>
            <div className={styles.cell}>
              <span>{title}</span>
              {title && (
                <>
                  <span onClick={() => onSort(prop, sorted === 'asc' ? 'asc' : 'desc')}>
                    {sorted === 'asc' ? <FaAngleDown /> : <FaAngleUp />}
                  </span>
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Popover id={`popover-basic`}>
                        <div className={'p-2'}>
                          <form action="" id={prop} onSubmit={(e) => onSubmit(e, prop)}>
                            <input type="text" name={prop} className="w-100" />
                            <button className={'mt-2 btn btn-sm btn-primary'} type="submit">
                              Фільтрувати
                            </button>
                          </form>
                        </div>
                      </Popover>
                    }
                  >
                    <FaFilter size={12} className={styles.icon} />
                  </OverlayTrigger>
                </>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default SmartHeader;
