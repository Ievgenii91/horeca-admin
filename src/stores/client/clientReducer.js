import {
  GET_CLIENT_SUCCESS,
  UPDATE_CLIENT_PRODUCT_AVAILABILITY_SUCCESS,
  TOGGLE_EDIT_MODE,
  REMOVE_CLIENT_PRODUCT_SUCCESS,
  EDIT_PRODUCT,
  FILTER_BY_NAME,
  GET_CLIENT_FAIL,
  GET_TEXTS_SUCCESS,
  REFRESH_TEXTS,
  SORT,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAIL,
  CLEAR_ERROR,
  TOGGLE_SELECT_CLIENT_MODAL,
  SET_CLIENTS_META,
  GET_CATEGORIES_SUCCESS,
  GET_VISITS_SUCCESS,
} from './clientActionTypes';

const initialOrders = {
  clientsMetaData: [],
  showSelectClientModal: false,
  owner: '',
  products: [],
  categories: [],
  subCategories: [],
  allProducts: [],
  users: [],
  texts: null,
  error: null,
  visits: [],
};

export default function clientReducer(state = initialOrders, action) {
  switch (action.type) {
    case TOGGLE_SELECT_CLIENT_MODAL: {
      return {
        ...state,
        showSelectClientModal: action.payload,
      };
    }

    case SET_CLIENTS_META: {
      return {
        ...state,
        clientsMetaData: action.payload,
      };
    }

    case CLEAR_ERROR: {
      return {
        ...state,
        error: null,
      };
    }
    case GET_CLIENT_SUCCESS: {
      const client = action.payload;
      return {
        ...client,
        products: [],
      };
    }

    case GET_CLIENT_FAIL: {
      return {
        ...initialOrders,
        clientLoadFailed: true,
      };
    }

    case UPDATE_CLIENT_PRODUCT_AVAILABILITY_SUCCESS: {
      const products = state.products.map((v) => {
        if (v.id === action.payload) {
          v.available = !v.available;
        }
        return v;
      });
      return {
        ...state,
        products,
        allProducts: [...products],
      };
    }

    case GET_PRODUCTS_SUCCESS: {
      let products = action.payload.map((v) => ({ ...v, visible: true }));
      return {
        ...state,
        products,
        allProducts: products,
      };
    }

    case GET_PRODUCTS_FAIL: {
      return {
        ...state,
        allProducts: [],
        error: 'Failed to load products',
      };
    }

    case TOGGLE_EDIT_MODE: {
      const products = state.products.map((v) => {
        if (v.id === action.payload) {
          v.editMode = !v.editMode;
        }
        return v;
      });
      return {
        ...state,
        products,
        allProducts: products,
      };
    }

    case EDIT_PRODUCT: {
      const { prop, value, id } = action.payload;
      const products = state.products.map((v) => {
        if (v.id === id) {
          v[prop] = value;
        }
        return v;
      });
      return {
        ...state,
        products,
        allProducts: products,
      };
    }

    case REMOVE_CLIENT_PRODUCT_SUCCESS: {
      const products = [...state.products.filter((v) => v.id !== action.payload)];
      return {
        ...state,
        products,
        allProducts: products,
      };
    }

    case FILTER_BY_NAME: {
      let search = action.payload.toLowerCase();
      let isBarOnly = false;
      let isFoodOnly = false;
      if (search.includes('bar:')) {
        isBarOnly = true;
      }
      if (search.includes('food:')) {
        isFoodOnly = true;
      }
      search = search.split(':');
      const cleanSearchRequest = search.pop();
      return {
        ...state,
        products: state.allProducts
          .filter((v) => {
            if (isBarOnly) {
              return v.type === 'bar';
            }
            if (isFoodOnly) {
              return v.type === 'food';
            }
            return v;
          })
          .map((v) => {
            v.visible = v.name.toLowerCase().includes(cleanSearchRequest);
            return v;
          }),
      };
    }

    case SORT: {
      const { name, desc } = action.payload;
      return {
        ...state,
        products: state.allProducts.sort((a, b) => {
          if (a[name] < b[name]) {
            return desc ? -1 : 1;
          }
          if (a[name] > b[name]) {
            return desc ? 1 : -1;
          }
          return 0;
        }),
      };
    }

    case GET_TEXTS_SUCCESS: {
      return {
        ...state,
        texts: action.payload,
      };
    }

    case REFRESH_TEXTS: {
      const texts = { ...state.texts };
      const { key, value } = action.payload;
      texts[key] = value;

      return {
        ...state,
        texts,
      };
    }

    case GET_CATEGORIES_SUCCESS: {
      let children = [];
      return {
        ...state,
        categories: action.payload.map((v) => {
          if(v.children) {
            children = [...children, ...v.children.map(name => ({ value: name, parentId: v._id }))];
          }
          return { ...v, entityId: v._id }
        }),
        subCategories: children
      };
    }

    case GET_VISITS_SUCCESS: {
      return {
        ...state,
        visits: action.payload || [],
      };
    }

    default:
      return state;
  }
}
