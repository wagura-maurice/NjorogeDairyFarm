// src/components/common/CheckOutScreen.tsx
import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../../context/CartContext';

const CheckOutScreen = () => {
  const navigation = useNavigation();
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

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
        source={item.image ? { uri: item.image } : require('../../assets/img/product_placeholder.png')} 
        style={styles.productImage} 
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>KES {item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id, item.quantity)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.productQuantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)} style={styles.removeButton}>
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
              TOTAL: {getTotalPrice().toLocaleString('en-US', { style: 'currency', currency: 'KES', maximumFractionDigits: 2 })}
            </Text>
            <TouchableOpacity
              style={[styles.checkoutButton, cart.length === 0 && styles.checkoutButtonDisabled]}
              onPress={() => {
                if (cart.length > 0) {
                  navigation.navigate('CustomerOrderScreen'); // Navigate only if the cart is not empty
                }
              }}
              disabled={cart.length === 0} // Disable the button if the cart is empty
            >
              <Text style={styles.checkoutButtonText}>PROCEED TO CHECKOUT</Text>
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
    backgroundColor: '#f0ebe6',
  },
  card: {
    flexDirection: 'row',
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  },
  productImage: {
    width: 100,
    height: '100%', // Make image height match the card
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  productName: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productQuantity: {
    fontSize: 16,
    color: 'grey',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  totalPrice: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  checkoutButtonDisabled: {
    backgroundColor: 'grey', // Change the color to indicate that it's disabled
  },
  checkoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'grey',
    paddingVertical: 20,
  },
  quantityButton: {
    backgroundColor: '#d1d1d1', // A neutral color for the button
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5, // Add some horizontal space between buttons
  },
  quantityButtonText: {
    color: '#000', // Text color, can be any color
    fontWeight: 'bold',
    fontSize: 16, // Adjust size as needed
  },
});

export default CheckOutScreen;

