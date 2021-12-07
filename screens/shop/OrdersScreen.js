import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  FlatList,
  Text,
  Platform,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import OrderItem from "../../components/shop/OrderItem";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { fetchOrders } from "../../store/actions/orders";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadOrders);
    return () => {
      willFocusSub.remove();
    };
  }, [loadOrders]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An Error Occurred!</Text>
        <Button title="Try Again" onPress={loadOrders} color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Orders Yet, Start Adding!</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={orders}
        renderItem={(itemData) => (
          <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            items={itemData.item.items}
          />
        )}
      />
    </>
  );
};

export default OrdersScreen;

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
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
            <Ionicons name={"ios-menu"} size={23} color={Colors.primary} />
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
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
