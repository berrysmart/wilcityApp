import axios from "axios";
import {
  GET_PRODUCT_DETAILS,
  LOADING,
  PRODUCT_TIMEOUT,
  ADD_TO_CART,
  GET_PRODUCTS_CART,
  GET_TOTAL_PRICE,
  REMOVE_PRODUCT_CART,
  CHANGE_QUANTITY,
  ADD_TO_CART_API,
  UPDATE_CART_ERR,
  CHANGE_QUANTITY_2,
  GET_VARIATIONS,
  SELECTED_ATTRIBUTE,
  RESET_ATTRIBUTE,
  PRODUCT_CART_TIMEOUT,
  GET_COMMENT_RATING,
  GET_RATING_STATICS,
  GET_COMMENT_ERR,
  GET_COMMENT_RATING_LOAD_MORE,
  RESET_PRODUCT_DETAILS,
  WISHLIST_TOKEN,
  DEDUCT_TO_CART
} from "../constants/actionTypes";
import { axiosHandleError, ActionSheet } from "../wiloke-elements";

export const getProductDetails = (
  productID,
  token = null
) => async dispatch => {
  const endpoint = `wc/products/${productID}`;
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (data.status === "success") {
      dispatch({
        type: PRODUCT_TIMEOUT,
        isTimeout: false
      });
      dispatch({
        type: GET_PRODUCT_DETAILS,
        payload: data.data
      });
      dispatch({
        type: LOADING,
        loading: true
      });
    } else {
      dispatch({
        type: PRODUCT_TIMEOUT,
        isTimeout: true
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOADING,
      loading: false
    });
    dispatch({
      type: PRODUCT_TIMEOUT,
      isTimeout: true
    });
  }
};

export const resetProductDetails = () => dispatch => {
  dispatch({
    type: RESET_PRODUCT_DETAILS
  });
};

export const getProductsCart = token => async dispatch => {
  const endpoint = "/wc/my-cart";
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_PRODUCTS_CART,
        payload: data.oCartItems,
        products: !data.oCartItems.items ? [] : data.oCartItems.items
      });
      dispatch({
        type: GET_TOTAL_PRICE
      });
      dispatch({
        type: PRODUCT_CART_TIMEOUT,
        isTimeout: false
      });
    }
  } catch (err) {
    axiosHandleError(err);
    dispatch({
      type: PRODUCT_CART_TIMEOUT,
      isTimeout: true
    });
  }
};

export const addToCart = (token, params) => async dispatch => {
  const endpoint = "/wc/add-to-cart";
  try {
    const { data } = await axios.post(
      endpoint,
      {
        id: params.id,
        quantity: params.quantity || 1,
        variationID: params.variationID ? params.variationID : "",
        attributes: params.attributes ? params.attributes : ""
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch({
      type: ADD_TO_CART,
      status: data
    });
  } catch (err) {
    axiosHandleError(err);
  }
};

export const deductToCart = (token, params) => async dispatch => {
  const endpoint = "/wc/deduct-to-cart";
  console.log(params);
  try {
    const { data } = await axios.post(
      endpoint,
      {
        id: params.id,
        quantity: params.quantity || 1,
        variationID: params.variationID ? params.variationID : "",
        attributes: params.attributes ? params.attributes : ""
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(data);
    dispatch({
      type: DEDUCT_TO_CART,
      status: data
    });
  } catch (err) {
    console.log(err);
    axiosHandleError(err);
  }
};

// export const addToCartAPI = (products, token) => async dispatch => {
//   const endpoint = "/wc/add-to-cart";
//   try {
//     const { data } = await axios.post(
//       endpoint,
//       {
//         products
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//     if (data.status === "success") {
//       dispatch({
//         type: ADD_TO_CART_API
//       });
//     } else {
//       dispatch({
//         type: UPDATE_CART_ERR,
//         payload: data.status
//       });
//     }
//   } catch (err) {
//     axiosHandleError(err);
//   }
// };

export const removeCart = (token, key) => async dispatch => {
  const endpoint = "/wc/remove-cart";
  try {
    const { data } = await axios.post(
      endpoint,
      {
        key
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (data.status === "success") {
      dispatch({
        type: REMOVE_PRODUCT_CART,
        key,
        msg: data.msg
      });
      dispatch({
        type: GET_TOTAL_PRICE
      });
    }
  } catch (err) {
    axiosHandleError(err);
  }
};

export const addWishListToken = info => dispatch => {
  dispatch({
    type: WISHLIST_TOKEN,
    payload: info
  });
};

export const changeQuantity = product => async dispatch => {
  dispatch({
    type: CHANGE_QUANTITY,
    payload: product
  });
  dispatch({
    type: GET_TOTAL_PRICE
  });
};

export const changeQuantity2 = product => async dispatch => {
  dispatch({
    type: CHANGE_QUANTITY_2,
    payload: product
  });
  dispatch({
    type: GET_TOTAL_PRICE
  });
};
export const getVariations = (productID, variations) => async dispatch => {
  const endpoint = `wc/products/${productID}/variations`;
  try {
    const { data } = await axios.get(endpoint, {
      params: {
        variations
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_VARIATIONS,
        payload: data.data
      });
    }
  } catch (err) {
    console.log(err);
    axiosHandleError(err);
  }
};
export const selectedAttribute = res => async dispatch => {
  dispatch({
    type: SELECTED_ATTRIBUTE,
    payload: res
  });
};
export const resetAttribute = res => async dispatch => {
  dispatch({
    type: RESET_ATTRIBUTE
  });
};
export const getCommentsRating = (productID, page = 1) => async dispatch => {
  const endpoint = `/wc/products/${productID}/ratings?count=5&page=${page}`;

  try {
    const { data } = await axios.get(endpoint);
    if (data.status === "success") {
      dispatch({
        type: GET_COMMENT_RATING,
        payload: data.data.aItems,
        totalPage: data.data.pages
      });
      dispatch({
        type: PRODUCT_TIMEOUT,
        isTimeout: false
      });
    }
  } catch (err) {
    console.log(err);
    axiosHandleError(err);
    dispatch({
      type: PRODUCT_TIMEOUT,
      isTimeout: true
    });
  }
};
export const getRatingStatics = productID => async dispatch => {
  const endpoint = `/wc/products/${productID}/ratings-statistic`;
  try {
    const { data } = await axios.get(endpoint);
    if (data.status === "success") {
      dispatch({
        type: GET_RATING_STATICS,
        payload: data.data
      });
      dispatch({
        type: PRODUCT_TIMEOUT,
        isTimeout: false
      });
    }
  } catch (err) {
    console.log(err);
    axiosHandleError(err);
    dispatch({
      type: PRODUCT_TIMEOUT,
      isTimeout: true
    });
  }
};
export const getCommentsLoadMore = (productID, page) => async dispatch => {
  const endpoint = `/wc/products/${productID}/ratings?count=5&page=${page}`;
  try {
    const { data } = await axios.get(endpoint);
    if (data.status === "success") {
      dispatch({
        type: GET_COMMENT_RATING_LOAD_MORE,
        payload: data.data.aItems
      });
      dispatch({
        type: PRODUCT_TIMEOUT,
        isTimeout: false
      });
    } else {
      dispatch({
        type: GET_COMMENT_ERR,
        status: data.status
      });
    }
  } catch (err) {
    console.log(err);
    axiosHandleError(err);
    dispatch({
      type: PRODUCT_TIMEOUT,
      isTimeout: true
    });
  }
};
