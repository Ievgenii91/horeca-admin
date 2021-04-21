import { ADD_ORDER, FINISH_ORDER, GET_ORDERS_SUCCESS, REMOVE_ORDER } from './ordersActionTypes';

const initialOrders = [];

export default function ordersReducer(state = initialOrders, action) {
  switch (action.type) {
    case GET_ORDERS_SUCCESS: {
      return [...action.payload];
    }
    case ADD_ORDER: {
      return [...state, action.payload];
    }
    case FINISH_ORDER: {
      const id = action.payload;
      const orders = state.map((v) => {
        if (id === v.id) {
          return {
            ...v,
            status: 'done',
          };
        }
        return v;
      });
      return [...orders];
    }
    case REMOVE_ORDER: {
      return [...state.filter((v) => v.id !== action.payload)];
    }
    default:
      return state;
  }
}
