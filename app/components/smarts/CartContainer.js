import React from "react";
import { connect } from "react-redux";
import CartScreen from "../screens/CartScreen";
import {
  getProductsCart,
  removeCart,
  changeQuantity,
  addToCart,
  changeQuantity2,
  checkTypeOrder,
  resetOrder,
  deductToCart
} from "../../actions/";

const mapStateToProps = state => ({
  auth: state.auth,
  translations: state.translations,
  myCart: state.cartReducer,
  isProductDetailsTimeout: state.isProductDetailsTimeout,
  loading: state.loading,
  settings: state.settings
});
const mapDispatchToProps = {
  getProductsCart,
  removeCart,
  changeQuantity,
  addToCart,
  changeQuantity2,
  checkTypeOrder,
  resetOrder,
  deductToCart
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartScreen);
