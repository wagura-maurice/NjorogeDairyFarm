// src/components/order/OrderDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { getData } from '../../utils/Storage';
import api from '../../utils/API';

const OrderDetailScreen = ({ route }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);    
  const [isDriver, setIsDriver] = useState(false);

  const placeholderImage = require('../../assets/img/product_placeholder.png');
  
  useEffect(() => {
    const initialize = async () => {
      const rolesData = await getData("userRoles");
      if (rolesData) {
        const roles = JSON.parse(rolesData);
        setIsDriver(roles.includes('supplier') || roles.includes('driver'));
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    const orderId = route.params?.orderId;
    fetchOrderDetails(orderId);
  }, [route.params]);

  const fetchOrderDetails = async (orderId) => {
    try {
        const response = await api.get(`/order/catalog/${orderId}?include=order_category,produce_category,customer,driver`);
        setOrderDetails(response.data.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to fetch order details:',
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };
    
  const markAsDelivered = async () => {
    try {
      const payload = {
        _status: 3, // The new status you want to set for the order
      };
      await api.patch(`/order/catalog/${orderDetails.id}`, payload);
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        _status: 3, // Update the local status to match the payload sent
      }));
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Order has been marked as delivered!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to update order status:',
        text2: error.message
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

  if (!orderDetails) {
    return (
      <View style={styles.centered}>
        <Text>No order details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Order: #{orderDetails?._pid}</Text>
      <Image
        source={orderDetails?.produce_category?.image ? { uri: orderDetails?.produce_category?.image } : placeholderImage}
        style={styles.productImage}
      />
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Icon name="person-outline" size={20} style={styles.detailIcon} />
          <Text style={styles.detailTitle}>Customer Details</Text>
        </View>
        <Text style={styles.detailInfo}>Name: {orderDetails?.customer?.client_name}</Text>
        <Text style={styles.detailInfo}>Email: {orderDetails?.customer?.email}</Text>
        <Text style={styles.detailInfo}>Phone: {orderDetails?.customer?.contact_number}</Text>
        <Text style={styles.detailInfo}>Location: {orderDetails?.customer?.address}</Text>
        <Text style={styles.detailInfo}>Address: {orderDetails?.customer?.address}</Text>
      </View>
      {isDriver && (<TouchableOpacity 
        style={styles.button} 
        onPress={markAsDelivered}
        disabled={orderDetails._status === 3}
      >
        <Text style={styles.buttonText}>
          {orderDetails._status === 3 ? 'DELIVERED' : 'MARK AS DELIVERED'}
        </Text>
      </TouchableOpacity>)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default OrderDetailScreen;
