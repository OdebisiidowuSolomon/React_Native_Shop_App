import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import ShopNavigator from "./ShopNavigator";

const NavigationContainer = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const navRef = useRef();
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);
  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;

const styles = StyleSheet.create({});
