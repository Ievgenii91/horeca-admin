import React from 'react';

const SmartBody = ({ rows, cols }) => (
  <tbody>
    {rows.map((data) => (
      <tr key={data._id}>
        {cols.map((col, index) => {
          switch (col.type) {
            case 'action':
              return (
                <td key={index} className="text-info p-1 pr-3 pl-3">
                  {col.render(data)}
                </td>
              );
            case 'link':
              return (
                <td key={index}>
                  <a href={data.href}>{data[col.prop]}</a>
                </td>
              );
            default:
              return <td key={index}>{data[col.prop]}</td>;
          }
        })}
      </tr>
    ))}
  </tbody>
);

export default SmartBody;
