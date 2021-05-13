import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { useGetToken } from '../hooks/get-token';
import { getCategories as fetchCategories } from '../stores/client/clientActions';
import { getCategories, getClientId } from '../stores/client/clientSelectors';

function CategoriesContainer({ categories, fetchCategories, clientId }) {
  let token = useGetToken();

  useEffect(() => {
    if (clientId && token) {
      fetchCategories(clientId, token);
    }
  }, [clientId, fetchCategories, token]);

  return (
    <div className="container-fluid">
      <div className="row mt-2">
        <Table>
          <thead>
            <tr>
              <th>Ім'я</th>
              <th>ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((v, i) => (
                <tr key={'ljsdf' + i}>
                  <td>{v.name}</td>
                  <td>{v.entityId}</td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default connect(
  (state) => ({
    categories: getCategories(state),
    clientId: getClientId(state),
  }),
  {
    fetchCategories,
  },
)(CategoriesContainer);
