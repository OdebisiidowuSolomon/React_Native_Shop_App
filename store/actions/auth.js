import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = (token, userId, expirationTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expirationTime));
    dispatch({ type: AUTHENTICATE, token, userId });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA_6yLbJ2yOgcXWBNUUiMGKjzJc7JfsyvA",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const message = errorResData.error?.message || "Something Went Wrong!";

      throw new Error(message.split("_").join(" ").toLowerCase());
    }

    const resData = await response.json();

    const { localId: userId, idToken: token, expiresIn } = resData;

    const expirationDate = new Date(
      new Date().getTime() + parseInt(expiresIn) * 1000
    );

    dispatch(authenticate(token, userId, parseInt(expiresIn) * 1000));

    saveDataToStorage(token, userId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA_6yLbJ2yOgcXWBNUUiMGKjzJc7JfsyvA",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const message = errorResData.error?.message || "Something Went Wrong!";

      throw new Error(message.split("_").join(" ").toLowerCase());
    }

    const resData = await response.json();

    const { localId: userId, idToken: token, expiresIn } = resData;

    const expirationDate = new Date(
      new Date().getTime() + parseInt(expiresIn) * 1000
    );

    dispatch(authenticate(token, userId, parseInt(expiresIn) * 1000));

    saveDataToStorage(token, userId, expirationDate);
  };
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const clearLogoutTimer = () => {
  timer && clearTimeout(timer);
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};
