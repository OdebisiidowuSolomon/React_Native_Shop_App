import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Card from "../UI/Card";

const ProductItem = (props) => {
  let TouchableComponent = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }
  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableComponent onPress={props.onSelect} useForeground>
          <View>
            <Image style={styles.image} source={{ uri: props.image }} />
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>
                ${Number(props.price).toFixed(2)}
              </Text>
            </View>
            <View style={styles.action}>{props.children}</View>
          </View>
        </TouchableComponent>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
  },
  touchable: {
    overflow: "hidden",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "60%",
  },
  title: {
    fontSize: 18,
    marginVertical: 2,
    fontFamily: "open-sans-bold",
  },
  price: {
    fontSize: 14,
    color: "#888",
    fontFamily: "open-sans",
  },
  action: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "23%",
    // paddingHorizontal
  },
  details: {
    alignItems: "center",
    height: "17%",
    padding: 10,
  },
});

export default ProductItem;
