import CartItem from "../../models/cart-item";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice,
      };
    case REMOVE_FROM_CART:
      const product = { ...state.items[action.productId] };
      const itemx = { ...state.items };
      if (product.quantity === 1) {
        delete itemx[action.productId];
        return {
          ...state,
          items: itemx,
          totalAmount: state.totalAmount - product.productPrice,
        };
      } else {
        const updatedCartItem = new CartItem(
          product.quantity - 1,
          product.productPrice,
          product.productTitle,
          product.sum - product.productPrice
        );
        return {
          ...state,
          items: { ...state.items, [action.productId]: updatedCartItem },
          totalAmount: state.totalAmount - product.productPrice,
        };
      }
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.productId]) {
        return state;
      }
      const items = { ...state.items };
      const itemTotal = state.items[action.productId].sum;
      delete items[action.productId];
      return {
        ...state,
        items,
        totalAmount: state.totalAmount - itemTotal,
      };
  }
  return state;
};
