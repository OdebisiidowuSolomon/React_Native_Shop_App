import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import { removeFromCart } from "../../store/actions/cart";
import { addOrder } from "../../store/actions/orders";

const CartScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (let key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        ...state.cart.items[key],
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const dispatch = useDispatch();

  const senOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(addOrder(cartItems, cartTotalAmount));
    setIsLoading(null);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>
            ${Number(cartTotalAmount).toFixed(2)}
          </Text>
        </Text>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            onPress={senOrderHandler}
            disabled={cartItems.length === 0}
          />
        )}
      </Card>
      <View>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.productId}
          renderItem={(itemData) => (
            <CartItem
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              quantity={itemData.item.quantity}
              deletable
              onRemove={() => {
                dispatch(removeFromCart(itemData.item.productId));
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

export default CartScreen;

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 20,
    // You could get The Ios Card Shadow Also //
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
    marginLeft: 6,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
