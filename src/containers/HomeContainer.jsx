import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { filterByName, removeClientProduct, saveClientProduct, sort } from '../stores/client/clientActions';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import ProductModel from '../models/product-model';
import {
  getAvailableCrossSales,
  getProducts,
  isThereUnsavedProduct,
  getClientId,
  isErrorShown,
  getCategories,
  getSubCategories,
} from '../stores/client/clientSelectors';
import ProductTable from '../components/ProductTable';
import ConfirmModal from '../components/ConfirmModal';
import AddEditProductModal from '../components/AddEditProductModal';

import { useGetToken } from '../hooks/get-token';

function HomeContainer({
  products,
  categories,
  subCategories,
  availableCrossSales,
  unsaved,
  saveClientProduct,
  removeClientProduct,
  filterByName,
  sort,
  clientId,
  error,
}) {
  let token = useGetToken();
  let [show, setShow] = useState(false);
  let [selectedProduct, setSelectedProduct] = useState(null);
  let [productIdToRemove, setProductIdToRemove] = useState(null);

  const showEditModal = useCallback(
    (id) => {
      if (id) {
        setSelectedProduct(products.find((v) => v.id === id));
      } else {
        setSelectedProduct(new ProductModel());
      }
      setShow(true);
    },
    [products],
  );

  const toggleAvailability = useCallback(
    (id) => {
      const product = products.find((v) => v.id === id);
      const transformed = ProductModel.transformModel({ ...product, available: !product.available });
      debugger;
      saveClientProduct(transformed, clientId, token);
    },
    [products, clientId, token, saveClientProduct],
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h4>Продукти</h4>
        </div>
      </div>
      <div className="row">
        <div className="col p-2">
          <InputGroup className="mb-2">
            <Button variant="primary" disabled={unsaved} onClick={() => showEditModal(null)} className="mr-4">
              Додати позицію
            </Button>
            <FormControl
              placeholder="Пошук по імені, використовуйте bar: або food: для фільтрації"
              aria-label="Пошук по імені"
              aria-describedby="basic-addon12"
              onChange={(e) => filterByName(e.currentTarget.value)}
            />
          </InputGroup>
        </div>
      </div>
      <div className="row">
        <div className="col mb-2 mt-0 pl-2">
          <b>
            Всього SKU: {products.length} | К-ть категорій: {categories.length} | З фото:{' '}
            {products.filter((v) => v.images && v.images.length).length}
          </b>
        </div>
      </div>

      <ProductTable
        products={products}
        categories={categories}
        showEditModal={showEditModal}
        removeItem={setProductIdToRemove}
        toggleAvailability={toggleAvailability}
        sort={sort}
      />

      <AddEditProductModal
        visible={show}
        clientId={clientId}
        product={selectedProduct}
        categories={categories}
        subCategories={subCategories}
        availableCrossSales={availableCrossSales}
        onConfirm={(data) => {
          saveClientProduct(ProductModel.transformModel({ ...data, id: selectedProduct.id }), clientId, token);
          setShow(false);
        }}
        onCancel={() => {
          setShow(false);
        }}
      />

      <ConfirmModal
        visible={!!productIdToRemove}
        onConfirm={() => {
          removeClientProduct(productIdToRemove, clientId, token);
          setProductIdToRemove(null);
        }}
        onCancel={() => {
          setProductIdToRemove(null);
        }}
      />
    </div>
  );
}

HomeContainer.defaultProps = {
  products: [],
  categories: [],
};

export default connect(
  (state) => ({
    products: getProducts(state),
    categories: getCategories(state),
    subCategories: getSubCategories(state),
    availableCrossSales: getAvailableCrossSales(state),
    unsaved: isThereUnsavedProduct(state),
    clientId: getClientId(state),
    error: isErrorShown(state),
  }),
  {
    saveClientProduct,
    removeClientProduct,
    filterByName,
    sort,
  },
)(HomeContainer);
