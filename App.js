import React, { useState } from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import NavigationContainer from "./navigation/NavigationContainer";
import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";

const rootReducers = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
});

const compose =
  process.env.NODE_ENV === "development" ? composeWithDevTools : "";

const store = createStore(rootReducers, compose(applyMiddleware(ReduxThunk)));

const fetchFonts = async () => {
  return await Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

const App = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  if (!isFontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setIsFontLoaded(true)}
        onError={() => {}}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
};

export default App;

// $ yarn add redux react-redux react-navigation react-navigation-header-buttons^C
