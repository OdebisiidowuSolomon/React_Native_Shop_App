import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import { addToCart } from "../../store/actions/cart";

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam("productId");

  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((product) => product.id === productId)
  );
  const dispatch = useDispatch();
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.action}>
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={() => {
            dispatch(addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>
        ${Number(selectedProduct.price).toFixed(2)}
      </Text>
      <Text style={styles.description}>{selectedProduct.description} </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  action: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "open-sans-bold",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
    fontFamily: "open-sans",
  },
});

ProductDetailScreen.navigationOptions = (navData) => {
  let headerTitle = navData.navigation.getParam("productTitle");
  return {
    headerTitle,
  };
};

export default ProductDetailScreen;
