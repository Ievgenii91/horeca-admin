import React, { useEffect, useState, useCallback } from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { useGetToken } from '../hooks/get-token';
import http from '../services/http';
import { getCategories as fetchCategories } from '../stores/client/clientActions';
import { getCategories, getClientId } from '../stores/client/clientSelectors';
import { FaTrash } from 'react-icons/fa';

const remove = async (item) => {
  try {
    await http.delete(`/category/${item._id}`);
  } catch (error) {}
}

function CategoriesContainer({ categories, fetchCategories, clientId }) {
  let token = useGetToken();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (clientId && token) {
      fetchCategories(clientId, token);
    }
  }, [clientId, fetchCategories, token]);

  const addCategory = useCallback(async () => {
    try {
      await http.post('/category', { name, clientId, description });
      setName('');
      setDescription('');
    } catch (error) {}
  }, [name, clientId, description]);

  return (
    <div className="container-fluid">
      <div className="row mt-2">
        <div className="col-2">
          <label>Назва</label>
          <input defaultValue={name} onBlur={(e) => setName(e.target.value)} />
        </div>
        <div className="col-2">
          <label>Опис</label>
          <input defaultValue={description} onBlur={(e) => setDescription(e.target.value)} />
        </div>
        <div className="col-2">
          <button type="text" className="btn btn-sm btn-primary" onClick={addCategory}>
            + Додати
          </button>
        </div>      
      </div>
      <div className="row mt-2">
        <Table>
          <thead>
            <tr>
              <th>Ім'я</th>
              <th>ID</th>
              <th>Видалити</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((v, i) => (
                <tr key={'ljsdf' + i}>
                  <td>{v.name}</td>
                  <td>{v.entityId}</td>
                  <td><FaTrash size={24} onClick={() => remove(v)}/></td>
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
