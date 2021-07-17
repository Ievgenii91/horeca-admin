import PropTypes from 'prop-types';
import React from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';

function EditCategory(props) {
  const {
    data: {
      name,
      description,
    },
    submit,
  } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      name,
      description,
    },
  });

  const hasError = (field) => {
    return touchedFields[field] && errors[field];
  };

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
        </div>
      </div>
    </Form>
  );
}

EditCategory.propTypes = {
  submit: PropTypes.func,
};

export default EditCategory;
