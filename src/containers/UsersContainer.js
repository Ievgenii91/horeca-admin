import React, { useState, useEffect, useCallback } from 'react';
import Table from 'react-bootstrap/Table';
import http from '../services/http';
import { apis } from '../constants/api-routes';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaTrash } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import { useGetToken } from '../hooks/get-token';
import { useSelector } from 'react-redux';
import { getClientId } from '../stores/client/clientSelectors';

function UsersContainer() {
  let token = useGetToken();
  const clientId = useSelector(getClientId);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await http.get(apis.employees, { clientId }, token);
        setEmployees(data);
      } catch (e) {
        setError(e);
      }
    }
    fetchData();
  }, [token, clientId]);

  const handleClose = () => {
    setShow(false);
  };

  const edit = (v) => {
    setSelectedEmployee(v);
    setShow(true);
  };

  const save = useCallback(async () => {
    try {
      if (selectedEmployee._id) {
        await http.patch(apis.employees + '/' + selectedEmployee._id, selectedEmployee, token);
      } else {
        await http.post(apis.employees, selectedEmployee, token);
      }
      const { data } = await http.get(apis.employees, { clientId }, token);
      setEmployees(data);
      handleClose();
      setSelectedEmployee(null);
    } catch (e) {}
  }, [token, selectedEmployee, clientId]);

  const remove = useCallback(
    async ({ _id }) => {
      try {
        await http.delete(apis.employees + '/' + _id, token);
        const { data } = await http.get(apis.employees, { clientId }, token);
        setEmployees(data);
      } catch (e) {}
    },
    [token, clientId],
  );

  const setEmployee = useCallback((data, prop) => {
    setSelectedEmployee((v) => {
      return {
        ...v,
        [prop]: data,
      };
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h4>Таймтрекінг</h4>
          <div className="row m-2">
            <Button
              variant="primary"
              onClick={() => {
                setSelectedEmployee({
                  clientId,
                  name: '',
                  password: '',
                  ratePerHour: '',
                  position: '',
                  prevRates: null,
                });
                setShow(true);
              }}
            >
              Додати працівника
            </Button>
          </div>

          <Table className="table-list">
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>На зміні з</th>
                <th>Ставка за годину</th>
                <th>Посада</th>
                <th>Пароль</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((v) => {
                return (
                  <tr key={v.name}>
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
                    <td>
                      {v.started
                        ? new Date(v.started).toLocaleDateString() + '  ' + new Date(v.started).toLocaleTimeString()
                        : ''}
                    </td>
                    <td>{v.ratePerHour}</td>
                    <td>{v.position}</td>
                    <td>{v.password}</td>
                    <td>
                      <FaTrash
                        size={16}
                        className="text-info"
                        onClick={() => {
                          remove(v);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{!selectedEmployee?.name ? 'Додати працівника' : 'Редагування працівника'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <Form.Group className="mb-3">
                <Form.Label>ПІБ</Form.Label>
                <Form.Control
                  placeholder="ПІБ"
                  onChange={(e) => setEmployee(e.target.value, 'name')}
                  defaultValue={selectedEmployee?.name}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ставка за годину</Form.Label>
                <Form.Control
                  placeholder="Ставка за годину"
                  type="number"
                  onChange={(e) => setEmployee(e.target.value, 'ratePerHour')}
                  defaultValue={selectedEmployee?.ratePerHour}
                />
                {selectedEmployee?.prevRates?.map((v, index) => (
                  <span key={index}>
                    {v.rate} uah & {v.date}
                  </span>
                ))}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Посада</Form.Label>
                <Form.Control
                  placeholder="Посада"
                  onChange={(e) => setEmployee(e.target.value, 'position')}
                  defaultValue={selectedEmployee?.position}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  placeholder="Пароль"
                  onChange={(e) => setEmployee(e.target.value, 'password')}
                  defaultValue={selectedEmployee?.password}
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Закрити
          </Button>
          <Button variant="primary" onClick={() => save()}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

UsersContainer.defaultProps = {
  employees: [],
};

export default UsersContainer;
