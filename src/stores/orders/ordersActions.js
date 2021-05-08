import {
  ADD_ORDER,
  FINISH_ORDER,
  GET_ORDERS,
  GET_ORDERS_FAIL,
  GET_ORDERS_SUCCESS,
  REMOVE_ORDER,
} from './ordersActionTypes';
import http from '../../services/http';

export const addOrder = (data) => ({
  type: ADD_ORDER,
  payload: data,
});

export const finishOrder = (id) => ({
  type: FINISH_ORDER,
  payload: id,
});

export const removeOrder = (id) => ({
  type: REMOVE_ORDER,
  payload: id,
});

export const getOrdersAsync = (clientId) => {
  return async (dispatch) => {
    try {
      let { data } = await http.get('/orders', { clientId, status: 'new' });
      dispatch(getOrdersSuccess(data));
    } catch (e) {
      dispatch(getOrdersFail(e));
    }
  };
};

export const getOrders = (data) => ({
  type: GET_ORDERS,
  payload: data,
});

export const getOrdersSuccess = (orders) => ({
  type: GET_ORDERS_SUCCESS,
  payload: orders,
});

export const getOrdersFail = (data) => ({
  type: GET_ORDERS_FAIL,
  payload: data,
});
