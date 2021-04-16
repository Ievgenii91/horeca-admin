import http from '../../services/http';
import {
  EDIT_PRODUCT,
  FILTER_BY_NAME,
  GET_CLIENT_FAIL,
  GET_CLIENT_SUCCESS,
  GET_TEXTS_FAIL,
  GET_TEXTS_SUCCESS,
  REFRESH_TEXTS,
  REMOVE_CLIENT_PRODUCT_FAIL,
  REMOVE_CLIENT_PRODUCT_SUCCESS,
  SAVE_CLIENT_PRODUCT_FAIL,
  TOGGLE_EDIT_MODE,
  UPDATE_CLIENT_PRODUCT_AVAILABILITY_FAIL,
  UPDATE_CLIENT_PRODUCT_AVAILABILITY_SUCCESS,
  UPDATE_TEXTS_FAIL,
  UPDATE_TEXTS_SUCCESS,
  SORT,
  GET_PRODUCTS_SUCCESS,
} from './clientActionTypes';
import { getOrdersAsync } from '../orders/ordersActions';

export const getClientFail = () => ({
  type: GET_CLIENT_FAIL,
});

export const getClientSuccess = (client) => ({
  type: GET_CLIENT_SUCCESS,
  payload: client,
});

export const updateClientProductAvailabilitySuccess = (id) => ({
  type: UPDATE_CLIENT_PRODUCT_AVAILABILITY_SUCCESS,
  payload: id,
});

export const updateClientProductAvailabilityFail = () => ({
  type: UPDATE_CLIENT_PRODUCT_AVAILABILITY_FAIL,
});

export function updateClientProductAvailability({ id, available, token }) {
  return async (dispatch) => {
    try {
      await http.post('/product/available', { id, available }, token);
      dispatch(updateClientProductAvailabilitySuccess(id));
    } catch (e) {
      dispatch(updateClientProductAvailabilityFail());
    }
  };
}

export function getClient(token) {
  return async (dispatch) => {
    try {
      const client = await http.get('/client', {}, token);
      dispatch(getClientSuccess(client));
      dispatch(getOrdersAsync(client._id));

      dispatch(getTexts(client._id, token));
    } catch (e) {
      dispatch(getClientFail());
    }
  };
}

export function getProducts(clientId) {
  return async (dispatch) => {
    try {
      const { products } = await http.get('/product/all', { clientId });
      dispatch(getProductsSuccess(products));
    } catch (e) {
      dispatch(getClientFail());
    }
  };
}

export const getProductsSuccess = (products) => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: products,
});

export const saveClientProduct = (product, clientId, token) => {
  return async (dispatch) => {
    try {
      product.clientId = clientId;
      if (product.id) {
        await http.post(`/product/${product.id}`, product, token);
      } else {
        await http.post('/product', product, token);
      }
      dispatch(getProducts(clientId));
    } catch (e) {
      dispatch(saveClientProductFail());
    }
  };
};

export const saveClientProductFail = () => ({
  type: SAVE_CLIENT_PRODUCT_FAIL,
});

export const removeClientProduct = (id, clientId, token) => {
  return async (dispatch) => {
    try {
      await http.post('/product/delete', { id, clientId }, token);
      dispatch(removeClientProductSuccess(id));
    } catch (e) {
      dispatch(removeClientProductFail());
    }
  };
};

export const removeClientProductSuccess = (id) => ({
  type: REMOVE_CLIENT_PRODUCT_SUCCESS,
  payload: id,
});

export const removeClientProductFail = () => ({
  type: REMOVE_CLIENT_PRODUCT_FAIL,
});

export const toggleEditMode = (id) => ({
  type: TOGGLE_EDIT_MODE,
  payload: id,
});

export const editProduct = (id, prop, value) => ({
  type: EDIT_PRODUCT,
  payload: { id, prop, value },
});

export const filterByName = (search) => ({
  type: FILTER_BY_NAME,
  payload: search,
});

export const sort = (name, desc) => ({
  type: SORT,
  payload: { name, desc },
});

export const getTexts = (clientId, token) => {
  return async (dispatch) => {
    try {
      const texts = await http.get('/texts', { clientId }, token);
      dispatch(getTextsSuccess(texts));
    } catch (e) {
      dispatch(getTextsFail());
    }
  };
};

export const getTextsSuccess = (texts) => ({
  type: GET_TEXTS_SUCCESS,
  payload: texts,
});

export const getTextsFail = () => ({
  type: GET_TEXTS_FAIL,
});

export const updateTexts = (data, token) => {
  return async (dispatch) => {
    try {
      const texts = await http.post('/texts', data, token);
      dispatch(updateTextsSuccess(texts));
    } catch (e) {
      dispatch(updateTextsFail());
    }
  };
};

export const updateTextsSuccess = (texts) => ({
  type: UPDATE_TEXTS_SUCCESS,
  payload: texts,
});

export const updateTextsFail = () => ({
  type: UPDATE_TEXTS_FAIL,
});

export const refreshTexts = ({ key, value }) => ({
  type: REFRESH_TEXTS,
  payload: { key, value },
});
