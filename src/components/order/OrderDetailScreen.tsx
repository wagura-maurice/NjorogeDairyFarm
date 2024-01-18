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

const STATUS_MAP = {
  0: "PENDING",
  1: "PROCESSING",
  2: "PROCESSED",
  3: "COMPLETED",
  4: "CANCELLED",
};

const OrderDetailScreen = ({ route }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);    
  const [isDriver, setIsDriver] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);

  const placeholderImage = require('../../assets/img/product_placeholder.png');
  
  useEffect(() => {
    const initialize = async () => {
      const rolesData = await getData("userRoles");
      if (rolesData) {
        const roles = JSON.parse(rolesData);
        setIsDriver(roles.includes('driver'));
        setIsCustomer(roles.includes('customer'));
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
      <Text style={styles.header}>0rder ID: #{orderDetails?._pid}</Text>
      <Image
        source={orderDetails?.produce_category?.image ? { uri: orderDetails?.produce_category?.image } : placeholderImage}
        style={styles.productImage}
      />
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>Customer: #{orderDetails?.customer?._pid}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="account-circle" size={25} color="#757575" />
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{orderDetails?.customer?.client_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="email" size={25} color="#757575" />
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{orderDetails?.customer?.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="phone" size={25} color="#757575" />
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{orderDetails?.customer?.contact_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="home" size={25} color="#757575" />
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{orderDetails?.customer?.address}</Text>
        </View>
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
      {isCustomer && (
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            {STATUS_MAP[orderDetails._status]}
          </Text>
        </View>
      )}
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
    flex: 1,
    backgroundColor: '#f0ebe6',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#b37400",
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  detailCard: {
    backgroundColor: '#f9f9f9',
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
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    color: "#009a9a",
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 8,
    marginRight: 4,
  },
  detailValue: {
    color: '#757575',
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
});

export default OrderDetailScreen;
