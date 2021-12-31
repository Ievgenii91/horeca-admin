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
  GET_PRODUCTS_FAIL,
  TOGGLE_SELECT_CLIENT_MODAL,
  SET_CLIENTS_META,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  GET_VISITS,
  GET_VISITS_SUCCESS,
  GET_VISITS_FAIL,
} from './clientActionTypes';
import { getOrdersAsync } from '../orders/ordersActions';
import { apis } from '../../constants/api-routes';

export const getClientFail = () => ({
  type: GET_CLIENT_FAIL,
});

export const getClientSuccess = (client) => ({
  type: GET_CLIENT_SUCCESS,
  payload: client,
});

export const openSelectClientModal = (show) => ({
  type: TOGGLE_SELECT_CLIENT_MODAL,
  payload: show,
});

export const setReceivedClients = (clientsMetaData) => ({
  type: SET_CLIENTS_META,
  payload: clientsMetaData,
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

export function setClient({ id, token }) {
  return async (dispatch) => {
    sessionStorage.setItem('clientId', id);
    await dispatch(getClient(token));
  };
}

export function getClient(token) {
  return async (dispatch) => {
    try {
      const { data } = await http.get(apis.currentClient, {}, token);
      let clients = data;
      const clientIdFromSession = sessionStorage.getItem('clientId');
      if (clientIdFromSession) {
        clients = data.filter((v) => v._id === clientIdFromSession);
      }
      if (clients.length > 1) {
        dispatch(openSelectClientModal(true));
        dispatch(setReceivedClients(clients.map((v) => ({ name: v.name, id: v._id }))));
      } else {
        const [client] = clients;
        const clientId = client._id;
        dispatch(getProducts(clientId));
        dispatch(getClientSuccess(client));
        dispatch(getOrdersAsync(clientId));
        dispatch(getTexts(clientId, token));
        dispatch(getCategories(clientId, token));
      }
    } catch (e) {
      dispatch(getClientFail());
    }
  };
}

export function getProducts(clientId) {
  return async (dispatch) => {
    try {
      const { data: products } = await http.get(apis.products, { clientId });
      dispatch(getProductsSuccess(products));
    } catch (e) {
      dispatch(getProductsFail());
    }
  };
}

export const getProductsSuccess = (products) => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: products,
});

export const getProductsFail = () => ({
  type: GET_PRODUCTS_FAIL,
});

export const saveClientProduct = (product, clientId, token) => {
  return async (dispatch) => {
    try {
      product.clientId = clientId;
      if (product.id) {
        await http.post(`${apis.products}/${product.id}`, product, token);
      } else {
        await http.post(apis.products, product, token);
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
      await http.delete(`${apis.products}/${id}?clientId=${clientId}`, token);
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
      const texts = await http.get(apis.texts, { clientId }, token);
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
      const texts = await http.post(apis.texts, data, token);
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

export const getCategoriesSuccess = (categories) => ({
  type: GET_CATEGORIES_SUCCESS,
  payload: categories,
});

export const getCategoriesFail = () => ({
  type: GET_CATEGORIES_FAIL,
});

export const getCategories = (clientId, token) => {
  return async (dispatch) => {
    try {
      const { data } = await http.get(apis.categories, { clientId }, token);
      dispatch(getCategoriesSuccess(data));
    } catch (e) {
      dispatch(getCategoriesFail());
    }
  };
};

export const addCategory = (clientId, data, token) => {
  return async (dispatch) => {
    try {
      await http.post(apis.categories, { ...data, clientId }, token);
      dispatch(getCategories(clientId, token));
    } catch (e) {
      dispatch(getCategoriesFail());
    }
  };
};

export const updateCategory = (clientId, data, token) => {
  return async (dispatch) => {
    try {
      await http.patch(`${apis.categories}/${data._id}`, { clientId, ...data }, token);
      dispatch(getCategories(clientId, token));
    } catch (e) {
      dispatch(getCategoriesFail());
    }
  };
};

export const deleteCategory = (clientId, data, token) => {
  return async (dispatch) => {
    try {
      await http.delete(`${apis.categories}/${data.entityId}`);
      dispatch(getCategories(clientId, token));
    } catch (e) {
      dispatch(getCategoriesFail());
    }
  };
};

export const deleteImage = (key, body, token) => {
  return async (dispatch) => {
    try {
      await http.post(`${apis.images}?key=${key}`, body, token);
    } catch (e) {
      dispatch(getCategoriesFail());
    }
  };
};


export const getVisitsSuccess = (visits) => ({
  type: GET_VISITS_SUCCESS,
  payload: visits,
});

export const getVisitsFail = () => ({
  type: GET_VISITS_FAIL,
});

export const fetchVisits = (filter, token) => {
  return async (dispatch) => {
    try {
      const { data } = await http.get(apis.visits, filter, token);
      dispatch(getVisitsSuccess(data));
    } catch (e) {
      dispatch(getVisitsFail());
    }
  };
};
