import PropTypes from 'prop-types';
import React, { useState, useCallback, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup'
import { useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
function EditCategory(props) {
  const {
    data: {
      name,
      description,
      children,
    },
    submit,
  } = props;

  const [sub, setSub] = useState('');
  const [subCategories, setSubcategories] = useState([]);
  const hasChildren = !!subCategories.length || !!children.length;

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
  } = useForm({
    defaultValues: {
      name,
      description,
      children,
    },
  });

  useEffect(() => {
    setSubcategories([...children])
  }, [children])

  const hasError = (field) => {
    return touchedFields[field] && errors[field];
  };

  const add = useCallback(() => {
    setSubcategories(c => {
      const val = [...c, sub];
      setValue('children', val);
      setSub('');
      return val
    })
  }, [sub, setValue]);

  const remove = (v) => {
    setSubcategories(c => {
      c.splice(c.findIndex(val => val === v), 1);
      const newValue = [...c];
      setValue('children', newValue);
      return newValue;
    })
  }

  return (
    <Form noValidate onSubmit={handleSubmit(submit)} id="category-form">
      <div className="row">
        <div className="col-6">
          <Form.Group className="mb-3">
            <Form.Control
              {...register('name', { required: true })}
              placeholder="Назва продукту"
              isInvalid={hasError('name')}
            />
            <Form.Control.Feedback type="invalid">Назва обов'язкове поле</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              {...register('description')}
              placeholder="Опис"
              isInvalid={hasError('description')}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              placeholder="Підкатегорія"
              value={sub}
              onChange={({ target }) => {
                setSub(target.value);
              }}
            />
          </Form.Group>
          <p>
            <Button variant="primary" size="sm" onClick={add}>
              Додати
            </Button>
          </p>
          <ListGroup>
            {
              hasChildren && subCategories.map((v)=> {
                return <ListGroup.Item key={v}>{v} <FaTrash size={12} onClick={() => remove(v)} /></ListGroup.Item>
              })
            }
          </ListGroup>
    
        </div>
      </div>
    </Form>
  );
}

EditCategory.propTypes = {
  submit: PropTypes.func,
};

export default EditCategory;
