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
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { CartContext } from '../../context/CartContext';
import useProducts from '../../hooks/useProducts';

const ProductCard = ({ product }) => {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const isInCart = cart.some(item => item.id === product.id);
  const cartItem = isInCart && cart.find(item => item.id === product.id);

  // Function to call when the decrease button is pressed
  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity === 1) {
      // If quantity is 1, remove the item from the cart
      decreaseQuantity(product.id); // Assume this also removes the item from the cart
    } else if (cartItem) {
      // If quantity is more than 1, just decrease the quantity
      decreaseQuantity(product.id);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={product.image ? { uri: product.image } : require('../../assets/img/product_placeholder.png')}
        style={styles.productImage}
      />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>KES {product.price}</Text>
      {isInCart ? (
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{cartItem.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(product.id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => addToCart({ ...product, quantity: 1 })} style={styles.addToCartButton}>
          <Text style={styles.addToCartButtonText}>ADD TO CART</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const MarketplaceScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, error, refreshProducts } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProducts(); // Use the refreshProducts method from the hook
    } catch (error) {
      // Handle any errors here
    }
    setRefreshing(false);
  }, [refreshProducts]);
  
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noProducts}>Failed to load products: {error}</Text>
      </View>
    );
  }

  const filteredProducts = searchQuery
    ? products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
      <FlatList
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Add this lin
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard key={item.id} product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListEmptyComponent={<Text style={styles.noProducts}>No products found.</Text>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]} // You can customize the colors
          />
        }
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
  header: {
    // Style for the header if needed
  },
  searchInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2.5,
    borderRadius: 15,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginVertical: 10,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    margin: 8,
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  productImage: {
    flex: 0,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productName: {
    flex: 0,
    fontWeight: 'bold',
    padding: 8,
    fontSize: 16,
    textTransform: 'capitalize',
    minHeight: 20, // Make sure there is space for the text
  },
  productPrice: {
    flex: 0,
    padding: 8,
    color: '#888',
    fontSize: 14,
    minHeight: 20, // Make sure there is space for the text
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'absolute', // Position the quantity container absolutely
    bottom: 50, // Height of the addToCartButton
    left: 0,
    right: 0,
  },
  quantityButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', // You can adjust the color as needed
    padding: 10, // You can adjust the padding as needed
    borderRadius: 5, // You can adjust the border radius as needed
  },
  quantityButtonText: {
    fontSize: 18, // You can adjust the font size as needed
    color: 'black', // You can adjust the color as needed
  },
  addToCartButton: {
    backgroundColor: 'green',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProducts: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 50,
  }
});

export default MarketplaceScreen;