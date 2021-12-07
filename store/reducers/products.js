import PRODUCTS from "../../data/dummy-data";
import Product from "../../models/product";
import {
  CREATE_PRODUCT,
  SET_PRODUCTS,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "../actions/products";

const initialState = {
  availableProducts: [],
  userProducts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.productId
        ),
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.productId
        ),
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };

    case UPDATE_PRODUCT:
      const products = [...state.userProducts];
      const productIndex = products.findIndex(
        (prod) => prod.id === action.productId
      );

      const updatedProduct = new Product(
        action.productId,
        products[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        products[productIndex].price
      );
      const availableProducts = [...state.availableProducts];
      const availableProductIndex = availableProducts.findIndex(
        (product) => product.id === action.productId
      );
      availableProducts[availableProductIndex] = updatedProduct;
      products[productIndex] = updatedProduct;
      return {
        ...state,
        availableProducts,
        userProducts: products,
      };
  }

  return state;
};
