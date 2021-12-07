import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Card = (props) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "black",
    shadowOpacity: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
});
