import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { login, signup } from "../../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let formIsValid = true;

    for (const key in updatedValidities) {
      formIsValid = formIsValid && updatedValidities[key];
    }
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    const sub = props.navigation.setParams({ isLogin: isLogin });
  }, [isLogin]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, value, isValid) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value,
        isValid,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    error && Alert.alert("An Error Ocurred", error, [{ text: "Okay" }]);
  }, [error]);

  const authHandler = async () => {
    const { email, password } = formState.inputValues;
    const action = isLogin ? login : signup;
    setError(false);
    setIsLoading(true);
    await dispatch(action(email, password))
      .then(() => {
        props.navigation.navigate("Shop");
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={4}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoComplete
              autoCapitalize="none"
              errorText="Email Address Not Valid"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please Enter A Valid Password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonView}>
              {!isLoading ? (
                <Button
                  title={isLogin ? "Login" : "Sign Up"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              ) : (
                <ActivityIndicator size="small" color={Colors.accent} />
              )}
            </View>
            <Button
              title={`Switch To ${!isLogin ? "Login" : "Sign Up"}`}
              color={Colors.accent}
              onPress={() => setIsLogin((prevState) => !prevState)}
            />
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

AuthScreen.navigationOptions = (navData) => {
  const isLogin = navData.navigation.getParam("isLogin");
  const headerTitle = isLogin ? "Login" : "Sign Up";
  return {
    headerTitle,
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonView: {
    marginVertical: 15,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
