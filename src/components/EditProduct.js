import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { useController, useForm } from 'react-hook-form';
import ReactS3Uploader from 'react-s3-uploader';
// import MultiSelect from 'react-multi-select-component';
import Select from 'react-select';
import { deleteImage } from '../stores/client/clientActions';
// import { withContext as ReactTags } from 'react-tag-input';

import { EnvironmentContext } from '../context';
import { useGetToken } from '../hooks/get-token';
import { slugify } from 'transliteration';

function EditProduct(props) {
  const {
    clientId,
    product: {
      id,
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
      images,
      weight,
      capacity,
      order,
      tags,
      rating,
      visible,
    },
    categories = [],
    subCategories = [],
    availableCrossSales,
    submit,
  } = props;

  let token = useGetToken();
  const [newImages, addImage] = useState([]);
  const [progress, updateProgress] = useState(0);
  const [slug, setSlug] = useState(() => slugify(name));

  const dispatch = useDispatch();
  const showProgress = !!(progress !== 0 && progress !== 100);
  const hasImages = !!((images && images.length) || newImages.length);

  useEffect(() => {
    addImage((v) => [...v, ...images]);
  }, [images]);

  // const usedCrossSales = useCallback(() => {
  //   return availableCrossSales.filter((v) => (crossSales ?? []).includes(v.value));
  // }, [availableCrossSales, crossSales]);

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
      weight,
      capacity,
      order,
      tags,
      rating,
      visible,
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
  // const {
  //   field: { ref, ...input },
  // } = useController({
  //   name: 'selectedCrossSales',
  //   control,
  //   shouldUnregister: true,
  //   defaultValue: usedCrossSales(),
  // });

  const removeImage = useCallback(
    (image) => {
      dispatch(
        deleteImage(
          image.key,
          {
            id,
            clientId,
          },
          token,
        ),
      );
      const data = [...newImages.filter((v) => v.key !== image.key)];
      addImage(data);
      widget.onChange(data);
    },
    [widget, newImages, dispatch, token, id, clientId],
  );

  const changeImage = useCallback(
    (data) => {
      const image = {
        ...data,
        isDefault: !!!newImages.length,
      };
      // TODO sync
      widget.onChange([...newImages, image]);
      addImage((v) => [...v, image]);
    },
    [widget, newImages],
  );

  const onFinishUpload = useCallback(
    ({ signedUrl, filename }) => {
      const [url] = signedUrl.split('?');
      const splittedName = filename.split('_');
      const image = {
        url,
        alt: splittedName[splittedName.length - 1],
        key: filename,
      };
      changeImage(image);
    },
    [changeImage],
  );

  const onProgress = useCallback(updateProgress, [updateProgress]);

  const context = useContext(EnvironmentContext);

  // const [forCrossSales, setForCrossSales] = useState(null);

  const [isBar, setIsBar] = useState(type === 'bar');

  // useEffect(() => {
  //   setForCrossSales(usedForCrossSales);
  // }, [usedForCrossSales, crossSales, availableCrossSales, usedCrossSales]);

  const hasError = (field) => {
    return touchedFields[field] && errors[field];
  };

  return (
    <Form noValidate onSubmit={handleSubmit(submit)} id="product-form">
      <div className="row">
        <div className="col-6">
          <Form.Group className="mb-3">
            <Form.Control
              {...register('name', { required: true })}
              placeholder="Назва продукту"
              onChange={(e) => setSlug(slugify(e.target.value))}
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
          {/* <Form.Group className="mb-3">
            <Form.Control {...register('fancyName')} placeholder="Назва в онлайн меню" />
          </Form.Group> */}
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
            <Form.Check {...register('visible')} type="checkbox" label="Видимий на сайті ?" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              {...register('type')}
              type="checkbox"
              label="Бар"
              onChange={() => {
                setIsBar(!isBar);
              }}
              defaultChecked={isBar}
            />
          </Form.Group>

          {isBar && (
            <Form.Group className="mb-3">
              <Form.Control type="number" {...register('capacity')} placeholder="Мілілітри" />
            </Form.Group>
          )}

          {!isBar && (
            <Form.Group className="mb-3">
              <Form.Control type="number" {...register('weight')} placeholder="Вага" />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Check {...register('available')} label="У наявності" defaultChecked={available} />
          </Form.Group>

          {/* <Form.Group className="mb-3">
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
              )} */}
        </div>
        <div className="col-6">
          {showProgress && <ProgressBar now={progress} className="mb-4" />}
          <ReactS3Uploader
            className="btn btn-primary"
            signingUrl="/s3/sign"
            signingUrlMethod="GET"
            accept="image/*"
            s3path={`${clientId}/`}
            preprocess={(file, next) => {
              next(file);
            }}
            onFinish={onFinishUpload}
            onProgress={onProgress}
            uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }} // this is the default
            contentDisposition="auto"
            server={context.apiServer}
            autoUpload={true}
          />

          {hasImages && (
            <>
              <Carousel>
                {newImages.map((v) => {
                  return (
                    <Carousel.Item key={v.url}>
                      <img height={300} className="pr-2 pb-4" src={v.url} alt={v.alt} />
                      <Carousel.Caption>
                        <h5>{v.alt}</h5>
                      </Carousel.Caption>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
              <div>
                {newImages.map((v, index) => {
                  return (
                    <p key={v.alt + index}>
                      {v.alt}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="ml-3"
                        onClick={() => {
                          removeImage(v);
                        }}
                      >
                        Видалити
                      </Button>
                    </p>
                  );
                })}
              </div>
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Control {...register('tags')} placeholder="Теги для пошуку" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control type="number" {...register('rating')} placeholder="Рейтинг" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control label="Slug:" type="text" disabled value={slug} />
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <ReactTags tags={tags.map(v => ({ id: v, text: v}))} />
          </Form.Group>
           */}
        </div>
      </div>
    </Form>
  );
}

EditProduct.propTypes = {
  submit: PropTypes.func,
};

export default EditProduct;
