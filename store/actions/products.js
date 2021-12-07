import Product from "../../models/product";

export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const ownerId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://rn-shopapp-5fac7-default-rtdb.europe-west1.firebasedatabase.app/products.json"
      );

      if (!response.ok) {
        throw new Error("Something Went Wrong!");
      }

      const resData = await response.json();
      const loadedProducts = [];
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === ownerId),
      });
    } catch (err) {
      // Do Something Else
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shopapp-5fac7-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Something Went Wrong!");
    }
    dispatch({ type: DELETE_PRODUCT, productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-shopapp-5fac7-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "'Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something Went Wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shopapp-5fac7-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "'Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something Went Wrong!");
    }
    dispatch({
      type: UPDATE_PRODUCT,
      productId: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
