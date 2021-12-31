import React, { memo, useCallback, useState, useEffect } from 'react';
import SmartHeader from './SmartHeader';
import SmartBody from './SmartBody';
import Table from 'react-bootstrap/Table';

const SmartTable = ({ data = [], metadata }) => {
  const [rows, setRows] = useState(() => data);
  const [cols, setCols] = useState(() => metadata);

  useEffect(() => {
    setRows(data);
  }, [data]);

  useEffect(() => {
    setCols(metadata);
  }, [metadata]);

  const onSort = useCallback((name, direction) => {
    setRows((data) =>
      data.sort((a, b) => {
        if (a[name] > b[name]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[name] < b[name]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      }),
    );
    setCols((meta) => {
      return meta.map((v) => {
        if (v.prop === name) {
          return {
            ...v,
            sorted: direction === 'asc' ? 'desc' : 'asc',
          };
        }
        return v;
      });
    });
  }, []);

  const onFilter = useCallback(
    (prop, value) => setRows(data.filter((v) => v[prop]?.toLowerCase().includes(value?.toLowerCase()))),
    [data],
  );

  return (
    <Table className="table-list">
      <SmartHeader cols={cols} onSort={onSort} onFilter={onFilter} />
      <SmartBody cols={cols} rows={rows} />
    </Table>
  );
};

export default memo(SmartTable);
