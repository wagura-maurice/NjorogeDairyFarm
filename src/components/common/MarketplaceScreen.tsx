// src/components/common/MarketplaceScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { CartContext } from '../../context/CartContext';
import useProducts from '../../hooks/useProducts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductCard = ({ product }) => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);
  
  // Check if the product is already in the cart
  const cartItemIndex = cart.findIndex((item) => item.id === product.id);
  const isInCart = cartItemIndex !== -1;
  
  // Function to handle adding/removing items from the cart
  const toggleCart = () => {
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  // Function to update the quantity of the item in the cart
  const changeQuantity = (newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={product.image ? { uri: product.image } : require('../../assets/img/product_placeholder.png')} style={styles.productImage}/>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>KES {product.price}</Text>
      {isInCart ? (
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => changeQuantity(cart[cartItemIndex].quantity - 1)} style={styles.quantityMinusButton}>
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{cart[cartItemIndex].quantity}</Text>
          <TouchableOpacity onPress={() => changeQuantity(cart[cartItemIndex].quantity + 1)} style={styles.quantityPlusButton}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={toggleCart} style={styles.addToCartButton}>
          <Text style={styles.addToCartButtonText}>add to cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const MarketplaceScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, error, cart } = useProducts();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noProducts}>Failed to load products: {error}</Text>
      </View>
    );
  }

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  const renderProduct = ({ item }) => <ProductCard key={item.id} product={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TextInput
      style={styles.searchInput}
      placeholder="Search..."
      onChangeText={setSearchQuery}
      value={searchQuery}
        />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListEmptyComponent={<Text style={styles.noProducts}>No products found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ebe6',
    paddingHorizontal: 8,
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 50,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    textDecorationStyle: 'dotted',
  },
  card: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'green',
  },  
  productName: {
    fontWeight: 'bold',
    margin: 8,
    textTransform: 'capitalize',
  },
  productPrice: {
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#f9f9f9',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 0,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 20,
    marginBottom: 8,
  },
  quantityPlusButton: {
    padding: 5,
    backgroundColor: '#FF9999',
    borderRadius: 10,
  },
  quantityMinusButton: {
    padding: 5,
    backgroundColor: '#87CEFA',
    borderRadius: 10,
  },
  quantityText: {
    color: 'green',
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  noProducts: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  }
});

export default MarketplaceScreen;
