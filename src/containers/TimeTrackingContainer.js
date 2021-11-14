import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import http from '../services/http';
import { apis } from '../constants/api-routes';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';

function TimeTrackingContainer() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await http.get(apis.employees);
        setEmployees(data);
      } catch (e) {
        setError(e);
      }
    }
    fetchData();
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const edit = (v) => {
    setSelectedEmployee(v);
    setShow(true);
  };

  const save = async () => {
    try {
      if (selectedEmployee._id) {
        await http.patch(apis.employees + '/' + selectedEmployee._id, selectedEmployee);
      } else {
        await http.post(apis.employees, selectedEmployee);
      }
      const { data } = await http.get(apis.employees);
      setEmployees(data);
      handleClose();
      setSelectedEmployee(null);
    } catch (e) {}
  };

  const remove = async ({ _id }) => {
    try {
      await http.delete(apis.employees + '/' + _id);
      const { data } = await http.get(apis.employees);
      setEmployees(data);
    } catch (e) {}
  };

  const setEmployee = (data, prop) => {
    setSelectedEmployee((v) => {
      return {
        ...v,
        [prop]: data,
      };
    });
  };

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
                  name: '',
                  password: '',
                  ratePerHour: '',
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
                <th>Дата</th>
                <th>Стартував</th>
                <th>Ставка за годину</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((v) => {
                return (
                  <tr key={v.name}>
                    <td>{v.name}</td>
                    <td>{v.date}</td>
                    <td>{v.started}</td>
                    <td>{v.ratePerHour}</td>
                    <td>
                      <FaTrash
                        size={24}
                        className="text-info"
                        onClick={() => {
                          remove(v);
                        }}
                      />
                      <FaEdit
                        size={24}
                        onClick={() => {
                          edit(v);
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
          <Modal.Title>Редагування працівника</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Control
                  placeholder="Ім'я"
                  onChange={(e) => setEmployee(e.target.value, 'name')}
                  defaultValue={selectedEmployee?.name}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  placeholder="Ставка за годину"
                  type="number"
                  onChange={(e) => setEmployee(e.target.value, 'ratePerHour')}
                  defaultValue={selectedEmployee?.ratePerHour}
                />
              </Form.Group>
              <Form.Group className="mb-3">
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

TimeTrackingContainer.defaultProps = {
  employees: [],
};

export default TimeTrackingContainer;
