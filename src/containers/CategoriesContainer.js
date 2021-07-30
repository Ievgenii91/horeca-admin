import React, { useEffect, useState, useCallback } from 'react';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useGetToken } from '../hooks/get-token';
import http from '../services/http';
import { getCategories as fetchCategories, updateCategory, deleteCategory } from '../stores/client/clientActions';
import { getCategories, getClientId } from '../stores/client/clientSelectors';
import { FaTrash, FaEdit } from 'react-icons/fa';
import AddEditCategoryModal from '../components/AddEditCategoryModal';
import { apis } from '../constants/api-routes';

function CategoriesContainer() {
  let token = useGetToken();

  const dispatch = useDispatch();
  const categories = useSelector(getCategories);
  const clientId = useSelector(getClientId);

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (clientId && token) {
      dispatch(fetchCategories(clientId, token)); 
    }
  }, [clientId, token, dispatch]);

  // TODO refactor
  const addCategory = useCallback(async () => {
    try {
      await http.post(apis.categories, { name, clientId, description });
      setName('');
      setDescription('');
      dispatch(fetchCategories(clientId, token));
    } catch (error) {}
  }, [name, clientId, description, token, dispatch]);

  const edit = (model) => {
    setSelectedCategory(model);
  };

  const remove = (data) => {
    dispatch(deleteCategory(clientId, data, token));
  };

  return (
    <div className="container-fluid">
       <div className="row">
        <div className="col">
          <h4>Категорії</h4>
        </div>
      </div>
      {!!selectedCategory && (
        <AddEditCategoryModal
          edit={true}
          visible={!!selectedCategory}
          data={selectedCategory}
          onConfirm={(data) => {
            dispatch(updateCategory(clientId, { ...selectedCategory, ...data }, token));
            setSelectedCategory(null);
          }}
          onCancel={() => {
            setSelectedCategory(null);
          }}
        />
      )}

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
        <Table className="table-list">
          <thead>
            <tr>
              <th>Ім'я</th>
              <th>Опис</th>
              <th>Підкатегорії</th>
              <th>ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((v) => (
                <tr key={v.entityId}>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-left"
                      onClick={(e) => {
                        e.preventDefault();
                        edit(v);
                      }}
                    >
                    {v.name}
                  </button>
                  </td>
                  <td>{v.description}</td>
                  <td>{!!v.children.length && v.children.map(v => (<p key={v}>{v}</p>))}</td>
                  <td>{v.entityId}</td>
                  <td className="text-info p-1 pr-3 pl-3">
                    <FaTrash onClick={() => remove(v)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CategoriesContainer;