import React, { useState, useEffect, useCallback } from "react";
import {
  Platform,
  Button,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { addToCart } from "../../store/actions/cart";
import { fetchProducts } from "../../store/actions/products";

export default function ProductsOverviewScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const products = useSelector((state) => state.products.availableProducts);

  const selectItemHandler = (itemData) => {
    props.navigation.navigate({
      routeName: "ProductDetail",
      params: {
        productId: itemData.item.id,
        productTitle: itemData.item.title,
      },
    });
  };

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [loadProducts]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An Error Occurred!</Text>
        <Button
          title="Try Again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products Yet!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => selectItemHandler(itemData)}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => selectItemHandler(itemData)}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
}

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerLeft: () =>
      Platform.OS == "web" ? (
        <View>
          <Text
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
            style={{
              paddingLeft: 20,
              color: Colors.primary,
              fontFamily: "open-sans-bold",
            }}
          >
            <Ionicons name={"md-menu"} size={23} color={Colors.primary} />
          </Text>
        </View>
      ) : (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Menu"
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      ),
    headerRight: () =>
      Platform.OS == "web" ? (
        <View>
          <Text
            onPress={() => {
              navData.navigation.navigate("Cart");
            }}
            style={{
              paddingLeft: 20,
              color: Colors.primary,
              fontFamily: "open-sans-bold",
            }}
          >
            <Ionicons name={"md-cart"} size={23} color={Colors.primary} />{" "}
          </Text>
        </View>
      ) : (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Cart"
            iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
            onPress={() => {
              navData.navigation.navigate("Cart");
            }}
          />
        </HeaderButtons>
      ),
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
