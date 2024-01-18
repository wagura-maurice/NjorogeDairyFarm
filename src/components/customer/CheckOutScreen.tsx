// src/components/customer/CheckOutScreen.tsx
import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../../context/CartContext";

const CheckOutScreen = () => {
  const navigation = useNavigation();
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  const handleIncreaseQuantity = (id) => {
    increaseQuantity(id);
  };

  const handleDecreaseQuantity = (id, quantity) => {
    if (quantity > 1) {
      decreaseQuantity(id);
    } else if (quantity === 1) {
      handleRemoveFromCart(id); // Remove the item if the quantity reaches 0 after decrease
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.image
            ? { uri: item.image }
            : require("../../assets/img/product_placeholder.png")
        }
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(item.price)}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleDecreaseQuantity(item.id, item.quantity)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.productQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => handleIncreaseQuantity(item.id)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemoveFromCart(item.id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.totalPrice}>
              TOTAL: {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(getTotalPrice())}
            </Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                cart.length === 0 && styles.checkoutButtonDisabled,
              ]}
              onPress={() => {
                if (cart.length > 0) {
                  navigation.navigate("OrderProcessingScreen");
                }
              }}
              disabled={cart.length === 0}
            >
              <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0ebe6",
  },
  card: {
    flexDirection: "row",
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  },
  productImage: {
    width: 100,
    height: "100%",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
    margin: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#b37400",
    margin: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  productQuantity: {
    fontSize: 16,
    color: "grey",
  },
  removeButton: {
    backgroundColor: "#009a9a",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  totalPrice: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#b37400",
  },
  checkoutButton: {
    backgroundColor: "#00b31a",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  checkoutButtonDisabled: {
    backgroundColor: "grey",
  },
  checkoutButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#009a9a",
    paddingVertical: 20,
  },
  quantityButton: {
    backgroundColor: "#d1d1d1",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CheckOutScreen;
