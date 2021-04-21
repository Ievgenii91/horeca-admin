import React, { useState } from 'react';
import { connect } from 'react-redux';
import { filterByName, removeClientProduct, saveClientProduct, sort } from '../stores/client/clientActions';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import ProductModel from '../models/product-model';
import {
  getAvailableCrossSales,
  getProducts,
  isThereUnsavedProduct,
  getClientId,
} from '../stores/client/clientSelectors';
import ProductTable from '../components/ProductTable';
import ConfirmModal from '../components/ConfirmModal';
import AddEditProductModal from '../components/AddEditProductModal';

import { useGetToken } from '../hooks/get-token';

function SettingsContainer({
  products,
  availableCrossSales,
  unsaved,
  saveClientProduct,
  removeClientProduct,
  filterByName,
  sort,
  clientId,
}) {
  let token = useGetToken();
  let [show, setShow] = useState(false);
  let [selectedProduct, setSelectedProduct] = useState(null);
  let [productIdToRemove, setProductIdToRemove] = useState(null);

  const showEditModal = (id) => {
    if (id) {
      setSelectedProduct(products.find((v) => v.id === id));
    } else {
      setSelectedProduct(new ProductModel());
    }
    setShow(true);
  };

  return (
    <div className="container-fluid">
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

      <ProductTable products={products} showEditModal={showEditModal} removeItem={setProductIdToRemove} sort={sort} />

      <AddEditProductModal
        visible={show}
        product={selectedProduct}
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

export default connect(
  (state) => ({
    products: getProducts(state),
    availableCrossSales: getAvailableCrossSales(state),
    unsaved: isThereUnsavedProduct(state),
    clientId: getClientId(state),
  }),
  {
    saveClientProduct,
    removeClientProduct,
    filterByName,
    sort,
  },
)(SettingsContainer);
