import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from 'react';
import MultiSelect from 'react-multi-select-component';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

function EditProduct(props) {
  const {
    product: {
      name,
      description,
      price,
      fancyName,
      category,
      subCategory,
      additionalText,
      available,
      type,
      crossSales,
      usedForCrossSales,
    },
    availableCrossSales,
    submit,
  } = props;

  const {
    register,
    handleSubmit,
    errors,
    control,
    formState: { touched },
  } = useForm();

  const [selectedCrossSales, setSelected] = useState(null);
  const [forCrossSales, setForCrossSales] = useState(null);

  useEffect(() => {
    setForCrossSales(usedForCrossSales);
    setSelected(crossSales ? usedCrossSales() : []);
  }, [usedForCrossSales, crossSales, availableCrossSales]);

  const usedCrossSales = () => {
    return availableCrossSales.filter((v) => crossSales.includes(v.value));
  };

  return (
    <>
      <Form noValidate onSubmit={handleSubmit(submit)} id="product-form">
        <Form.Group className="mb-3">
          <Form.Control
            ref={register({ required: true })}
            placeholder="Назва продукту"
            name="name"
            isInvalid={touched && errors.name}
            defaultValue={name}
          />
          <Form.Control.Feedback type="invalid">Назва обов'язкове поле</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            ref={register({ required: true })}
            placeholder="Ціна у гривнях"
            name="price"
            isInvalid={touched && errors.price}
            defaultValue={price}
          />
          <Form.Control.Feedback type="invalid">Ціна обов'язкове поле</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control ref={register} placeholder="Назва в онлайн меню" name="fancyName" defaultValue={fancyName} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="textarea"
            ref={register}
            placeholder="Опис"
            name="description"
            defaultValue={description}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="textarea"
            ref={register}
            placeholder="Категорія"
            name="category"
            defaultValue={category}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="textarea"
            ref={register}
            placeholder="Підкатегорія"
            name="subCategory"
            defaultValue={subCategory}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="textarea"
            ref={register}
            placeholder="Додатковий текст"
            name="additionalText"
            defaultValue={additionalText}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check ref={register} type="checkbox" label="Бар" name="type" defaultChecked={type === 'bar'} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check ref={register} label="У наявності" name="available" defaultChecked={available} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            ref={register}
            label="Використовується як доп продаж?"
            name="forCrossSales"
            onChange={() => {
              setForCrossSales(!forCrossSales);
            }}
            defaultChecked={forCrossSales || false}
          />
        </Form.Group>

        {!forCrossSales && (
          <Form.Group className="mb-3">
            <Form.Label>Оберіть апсейл</Form.Label>
            <Controller
              control={control}
              name="selectedCrossSales"
              defaultValue={usedCrossSales()}
              render={({ onChange, value }) => (
                <MultiSelect
                  overrideStrings={{
                    'selectSomeItems': 'Обрати...',
                    'allItemsAreSelected': 'Всі дані вибрані.',
                    'selectAll': 'Вибрати все',
                    'search': 'Пошук',
                    'clearSearch': 'Очистити пошук',
                  }}
                  onChange={(data) => {
                    setSelected(data);
                    onChange(data);
                  }}
                  disabled={forCrossSales}
                  options={availableCrossSales}
                  value={value}
                  selectAllLabel={'Вибрати все'}
                  labelledBy={'Виберіть допи'}
                />
              )}
            />
          </Form.Group>
        )}
      </Form>
    </>
  );
}

EditProduct.propTypes = {
  submit: PropTypes.func,
};

export default EditProduct;
