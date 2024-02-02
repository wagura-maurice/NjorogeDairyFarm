// src/components/inventory/InventoryDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { getData } from '../../utils/Storage';
import api from '../../utils/API';

const STATUS_MAP = {
  0: "PENDING",
  1: "PROCESSING",
  2: "AVAILABLE",
  3: "OUT OF STOCK",
};

const InventoryDetailScreen = ({ route }) => {
  const [inventoryDetails, setInventoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSupplier, setIsSupplier] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');

  const placeholderImage = require('../../assets/img/product_placeholder.png');

  useEffect(() => {
    const initialize = async () => {
      const rolesData = await getData("userRoles");
      if (rolesData) {
        const roles = JSON.parse(rolesData);
        setIsSupplier(roles.includes('supplier'));
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    const inventoryId = route.params?.inventoryId;
    fetchInventoryDetails(inventoryId);
  }, [route.params]);

  const fetchInventoryDetails = async (inventoryId) => {
    try {
      const response = await api.get(`/inventory/catalog/${inventoryId}?include=category,supplier`);
      console.log(response.data.data);
      setInventoryDetails(response.data.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to fetch inventory details:',
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async () => {
    try {
      const payload = {
        _status: 3, // The new status you want to set for the inventory
      };
      await api.patch(`/inventory/catalog/${inventoryDetails.id}`, payload);
      setInventoryDetails((prevDetails) => ({
        ...prevDetails,
        _status: 3, // Update the local status to match the payload sent
      }));
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Inventory has been marked as delivered!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to update inventory status:',
        text2: error.message
      });
    }
  };

  const submitQuote = async () => {
    if (!quotePrice) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Quote Price is required.',
      });
      return;
    }

    try {
      await api.post('invoice/catalog', {
        category_id: 1, // Assuming debit category ID
        payable: quotePrice,
        _inventories: [inventoryDetails._pid],
      });

      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Quote submitted successfully!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to submit quote:',
        text2: error.message,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!inventoryDetails) {
    return (
      <View style={styles.centered}>
        <Text>No inventory details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {inventoryDetails.category.image ? (
          <Image
            source={{ uri: inventoryDetails?.category?.image }}
            style={styles.productImage}
          />
        ) : (
          <Image
            source={placeholderImage}
            style={styles.productImage}
          />
        )}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Inventory ID: #{inventoryDetails._pid}</Text>
        <Text style={styles.detailText}>Product: {inventoryDetails.name}</Text>
        <Text style={styles.detailText}>Quantity: {Number(inventoryDetails.quantity).toFixed(2)}</Text>
        <Text style={styles.detailText}>Price: {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(inventoryDetails.price)}</Text>
        <Text style={styles.detailText}>Category: {inventoryDetails?.category?.name}</Text>
        <Text style={styles.detailText}>Supplier: {inventoryDetails?.supplier?.company_name}</Text>
      </View>
      {isSupplier && inventoryDetails._status === 0 && (
        <>
          <TextInput
            style={styles.quoteInput}
            placeholder="Enter Quoted Price"
            keyboardType="numeric"
            value={quotePrice}
            onChangeText={setQuotePrice}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={submitQuote}
          >
            <Text style={styles.buttonText}>Submit Quote/Invoice</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ebe6',
    paddingHorizontal: 8,
  },
  imageContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    shadowColor: "#00b31a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    shadowColor: "#00b31a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009a9a",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#00b31a",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  quoteInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 10,
  },
});

export default InventoryDetailScreen;
