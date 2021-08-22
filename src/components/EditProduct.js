import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useController, useForm } from 'react-hook-form';
import MultiSelect from 'react-multi-select-component';
import Select from 'react-select';
import { EnvironmentContext } from '../context';
import { Button } from 'react-bootstrap';
import ReactS3Uploader from 'react-s3-uploader';

function EditProduct(props) {
  const {
    clientId,
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
      slug,
      path,
      images,
    },
    categories = [],
    subCategories = [],
    availableCrossSales,
    submit,
  } = props;

  const [newImages, addImage] = useState([]);
  const hasImages = !!(images && images.length) || newImages.length;

  const usedCrossSales = useCallback(() => {
    return availableCrossSales.filter((v) => (crossSales ?? []).includes(v.value));
  }, [availableCrossSales, crossSales]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      name,
      description,
      price,
      fancyName,
      additionalText,
      slug,
      path,
    },
  });

  const getCategory = useCallback(
    (value) => {
      if (!value) return null;
      const { name: label } = categories.find((v) => v.entityId === value);
      return {
        value,
        label,
      };
    },
    [categories],
  );

  const selectedCategory = useMemo(() => getCategory(category), [getCategory, category]);

  const getSubCategory = useCallback(
    (value) => {
      if (!value) return null;
      const { value: label } = subCategories.find((v) => v.value === value);
      return {
        value,
        label,
      };
    },
    [subCategories],
  );

  const selectedSubCategory = useMemo(() => getSubCategory(subCategory), [getSubCategory, subCategory]);
  const filteredSubCategories = subCategories.filter((v) => selectedCategory && v.parentId === selectedCategory.value);
  const showSubCategories = !!selectedCategory && !!filteredSubCategories.length;

  const { field: select } = useController({
    name: 'category',
    defaultValue: selectedCategory,
    control,
    shouldUnregister: true,
  });
  const { field: selectSub } = useController({
    name: 'subCategory',
    defaultValue: selectedSubCategory,
    control,
    shouldUnregister: true,
  });
  const { field: widget } = useController({
    name: 'images',
    defaultValue: images,
    control,
    shouldUnregister: true,
  });
  const {
    field: { ref, ...input },
  } = useController({
    name: 'selectedCrossSales',
    control,
    shouldUnregister: true,
    defaultValue: usedCrossSales(),
  });

  const removeImages = useCallback(() => {
    widget.onChange([]);
  }, [widget]);

  const changeImage = useCallback(
    (data) => {
      const image = {
        ...data,
        isDefault: !!!images.length,
      };
      widget.onChange([...images, image]);
    },
    [widget, images],
  );

  const onFinishUpload = useCallback(
    ({ signedUrl, filename }) => {
      const [url] = signedUrl.split('?');
      const splittedName = filename.split('_');
      const image = {
        url,
        alt: splittedName[splittedName.length - 1],
      };
      changeImage(image);
      addImage((v) => [...v, image]);
    },
    [changeImage],
  );

  const context = useContext(EnvironmentContext);

  const [forCrossSales, setForCrossSales] = useState(null);

  useEffect(() => {
    setForCrossSales(usedForCrossSales);
  }, [usedForCrossSales, crossSales, availableCrossSales, usedCrossSales]);

  const hasError = (field) => {
    return touchedFields[field] && errors[field];
  };

  return (
    <>
      <Form noValidate onSubmit={handleSubmit(submit)} id="product-form">
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
                {...register('price', { required: true })}
                placeholder="Ціна у гривнях"
                isInvalid={hasError('price')}
              />
              <Form.Control.Feedback type="invalid">Ціна обов'язкове поле</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control {...register('fancyName')} placeholder="Назва в онлайн меню" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="textarea" {...register('description')} placeholder="Опис" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Select
                {...select}
                options={categories.map((v) => ({
                  value: v.entityId,
                  label: v.name,
                }))}
                placeholder="Категорія"
              ></Select>
            </Form.Group>

            {showSubCategories && (
              <Form.Group className="mb-3">
                <Select
                  {...selectSub}
                  options={filteredSubCategories.map(({ value }) => ({
                    value,
                    label: value,
                  }))}
                  placeholder="Підкатегорія"
                ></Select>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Control type="textarea" {...register('additionalText')} placeholder="Додатковий текст" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check {...register('type')} type="checkbox" label="Бар" defaultChecked={type === 'bar'} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check {...register('available')} label="У наявності" defaultChecked={available} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                {...register('forCrossSales')}
                label="Використовується як доп продаж?"
                onChange={() => {
                  setForCrossSales(!forCrossSales);
                }}
                defaultChecked={forCrossSales || false}
              />
            </Form.Group>

            {!forCrossSales && (
              <Form.Group className="mb-3">
                <Form.Label>Оберіть апсейл</Form.Label>
                <MultiSelect
                  {...input}
                  overrideStrings={{
                    'selectSomeItems': 'Обрати...',
                    'allItemsAreSelected': 'Всі дані вибрані.',
                    'selectAll': 'Вибрати все',
                    'search': 'Пошук',
                    'clearSearch': 'Очистити пошук',
                  }}
                  disabled={forCrossSales}
                  options={availableCrossSales}
                  selectAllLabel={'Вибрати все'}
                  labelledBy={'Виберіть допи'}
                />
              </Form.Group>
            )}
          </div>
          <div className="col-6">
            <ReactS3Uploader
              signingUrl="/s3/sign"
              signingUrlMethod="GET"
              accept="image/*"
              s3path={`${clientId}/`}
              onFinish={onFinishUpload}
              uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }} // this is the default
              contentDisposition="auto"
              server={context.apiServer}
              autoUpload={true}
            />

            {hasImages && (
              <div>
                {[...images, ...newImages].map((v) => {
                  return <img width="200px" className="pr-2 pb-4" src={v.url} alt={v.alt} key={v.url} />;
                })}
                <p>
                  <Button variant="outline-danger" size="sm" onClick={removeImages}>
                    Видалити все
                  </Button>
                </p>
              </div>
            )}

            <p className="mt-3">Наступні поля потрібні для конструктора динамічних сайтів:</p>

            <Form.Group className="mb-3">
              <Form.Control {...register('slug')} placeholder="Назва сторінки або slug" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control {...register('path')} placeholder="Шлях до продукту" />
            </Form.Group>
          </div>
        </div>
      </Form>
    </>
  );
}

EditProduct.propTypes = {
  submit: PropTypes.func,
};

export default EditProduct;
