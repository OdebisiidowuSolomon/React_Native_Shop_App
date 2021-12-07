import React from "react";
import {
  Alert,
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { deleteProduct } from "../../store/actions/products";

const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);

  const dispatch = useDispatch();

  const editProductHandler = (id) => {
    props.navigation.navigate({
      routeName: "EditProduct",
      params: { productId: id },
    });
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Product", "Are You Sure You Want To Delete Product?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(deleteProduct(id));
        },
      },
    ]);
  };

  if (userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>You Have No Products Yet!</Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("EditProduct");
          }}
          style={{
            backgroundColor: Colors.accent,
            padding: 10,
            marginVertical: 10,
          }}
        >
          <Text>Create One</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={editProductHandler.bind(this, itemData.item.id)}
        >
          <Button
            color={Colors.primary}
            title="Edit Product"
            onPress={editProductHandler.bind(this, itemData.item.id)}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={
              Platform.OS == "web"
                ? () => {
                    dispatch(deleteProduct(itemData.item.id));
                  }
                : handleDelete.bind(this, itemData.item.id)
            }
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = (navData) => ({
  headerTitle: "Your Products",
  headerLeft: () =>
    Platform.OS == "web" ? (
      <View>
        <Text
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
          style={{ padding: 20 }}
        >
          <Ionicons name={"md-menu"} size={23} color={Colors.primary} />{" "}
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
            navData.navigation.navigate("EditProduct");
          }}
          style={{
            padding: 20,
            color: Colors.primary,
            fontFamily: "open-sans-bold",
          }}
        >
          <Ionicons name={"md-create"} size={23} color={Colors.primary} />
        </Text>
      </View>
    ) : (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    ),
});

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default UserProductsScreen;
