import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../../store/actions/products";
import Input from "../../components/UI/Input";

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

const EditProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const productId = props.navigation.getParam("productId");
  const product = useSelector((state) =>
    state.products.userProducts.find((product) => product.id === productId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: product ? product.title : "",
      imageUrl: product ? product.imageUrl : "",
      description: product ? product.description : "",
      price: "",
    },
    inputValidities: {
      title: product ? true : false,
      imageUrl: product ? true : false,
      description: product ? true : false,
      price: product ? true : false,
    },
    formIsValid: product ? true : false,
  });

  useEffect(() => {
    if (error) {
      Platform.OS !== "web" &&
        Alert.alert("An error occurred", error, [{ text: "Okay" }]);
      Platform.OS === "web" && alert(`An error occurred\n${error}`);
      return;
    }
  }, [error]);

  const dispatch = useDispatch();

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      if (Platform.OS === "web") {
        alert("Wrong Input\nPlease check the errors in the form.");
      } else {
        Alert.alert("Wrong input!", "Please check the errors in the form.", [
          { text: "Okay" },
        ]);
      }
      return;
    }
    const { title, description, imageUrl, price } = formState.inputValues;
    setError(null);
    setIsLoading(true);
    try {
      if (product) {
        await dispatch(updateProduct(productId, title, description, imageUrl));
      } else {
        await dispatch(createProduct(title, description, imageUrl, +price));
      }
      props.navigation.goBack();
      console.log("Submitting....");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setIsLoading(false);
  }, [dispatch, formState, productId]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="Title"
            id="title"
            errorText="Please enter a valid title!"
            onInputChange={inputChangeHandler}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            initialValue={product ? product.title : ""}
            initiallyValid={!!product}
            required
          />
          <Input
            id="imageUrl"
            label="Image URL"
            keyboardType="default"
            errorText="Please Enter A Valid Image Url"
            onInputChange={inputChangeHandler}
            initialValue={product ? product.imageUrl : ""}
            initiallyValid={!!product}
            required
          />
          {!product && (
            <Input
              id="price"
              label="Price"
              errorText="Please Enter A Valid Price"
              onInputChange={inputChangeHandler}
              keyboardType="decimal-pad"
              initialValue={product ? product.price : ""}
              initiallyValid={!!product}
              required
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="Description"
            errorText="Please Enter A Valid Description"
            onInputChange={inputChangeHandler}
            multiline
            numberOfLines={3}
            initialValue={product ? product.description : ""}
            initiallyValid={!!product}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () =>
      Platform.OS == "web" ? (
        <View>
          <Text
            onPress={submitFn}
            style={{
              padding: 20,
              color: Colors.primary,
              fontFamily: "open-sans-bold",
            }}
          >
            <Ionicons name={"md-checkmark"} size={23} color={Colors.primary} />
          </Text>
        </View>
      ) : (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={submitFn}
          />
        </HeaderButtons>
      ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EditProductScreen;
