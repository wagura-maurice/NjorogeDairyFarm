// src/components/order/OrderDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { getData } from '../../utils/Storage';
import api from '../../utils/API';

const placeholderImage = require('../../assets/img/product_placeholder.png');
const ORDER_STATUS_MAP = {
  0: "PENDING",
  1: "PROCESSING",
  2: "PROCESSED",
  3: "COMPLETED",
  4: "CANCELLED",
};

const INVOICE_STATUS_MAP = {
  0: "PENDING",
  1: "PROCESSING",
  2: "PROCESSED",
  3: "REJECTED",
  4: "ACCEPTED",
};

const OrderDetailScreen = ({ route }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);    
  const [isDriver, setIsDriver] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const rolesData = await getData("userRoles");
      const userDataJson = await getData("userData");
      if (rolesData && userDataJson) {
        const roles = JSON.parse(rolesData);
        const userDataParsed = JSON.parse(userDataJson);
        setIsDriver(roles.includes('driver'));
        setIsCustomer(roles.includes('customer'));
        setUserData(userDataParsed);
      }
      fetchOrderDetails(route.params?.orderId);
    };
    initialize();
  }, [route.params]);

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await api.get(`/order/catalog/${orderId}?include=order_category,produce_category,customer,driver,invoices`);
      const fetchedOrderDetails = response.data.data;
      setOrderDetails(fetchedOrderDetails);
      // Assuming invoices are part of the orderDetails and you want the latest invoice related to the customer
      const relatedInvoice = fetchedOrderDetails.invoices.find(invoice => invoice.customer_id === fetchedOrderDetails.customer.id);
      setCurrentInvoice(relatedInvoice);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to fetch order details',
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    // Ensure the user is a driver and the order is not already completed.
    if (!isDriver || orderDetails._status === 3) {
        Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Action not allowed',
            text2: 'You cannot mark this order as completed.',
        });
        return;
    }

    // API call to update the order status to "COMPLETED"
    try {
        await api.patch(`/order/catalog/${orderDetails.id}`, {
            _status: 3, // Ensure this status matches your system's status code for completed orders
        });

        // Update the local state to reflect the change
        setOrderDetails({
            ...orderDetails,
            _status: 3,
        });

        Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Success',
            text2: 'Order has been marked as completed!',
        });
    } catch (error) {
        Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error updating order status',
            text2: error.toString(),
        });
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (!orderDetails) {
    return <View style={styles.centered}><Text>No order details available.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={orderDetails?.produce_category?.image ? { uri: orderDetails.produce_category.image } : placeholderImage}
          style={styles.productImage}
        />
        <Text style={styles.watermark}>#{orderDetails?._pid}</Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailSubTitle}>order details</Text>
        <Text style={styles.detailText}>Product Category: {orderDetails?.produce_category?.name}</Text>
        <Text style={styles.detailText}>Order Category: {orderDetails?.order_category?.name}</Text>
        <Text style={styles.status}>{ORDER_STATUS_MAP[orderDetails?._status] || 'Unknown'}</Text>
        <View style={styles.statusAndPidContainer}>
          <Text style={styles.pid}>#{orderDetails?._pid}</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailSubTitle}>Customer Details</Text>
        <View style={styles.infoRow}>
          <Icon name="person" size={20} color="#4F8EF7" />
          <Text style={styles.infoText}>{orderDetails?.customer?.client_name}</Text>
        </View>
        <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${orderDetails?.customer?.email}`)}>
          <Icon name="email" size={20} color="#4F8EF7" />
          <Text style={[styles.infoText, styles.linkText]}>{orderDetails?.customer?.email}</Text>
        </TouchableOpacity>
        <View style={styles.infoRow}>
          <Icon name="phone" size={20} color="#4F8EF7" />
          <Text style={styles.infoText}>{orderDetails?.customer?.contact_number}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="location-on" size={20} color="#4F8EF7" />
          <Text style={styles.infoText}>{orderDetails?.customer?.address}</Text>
        </View>
      </View>

      {currentInvoice && (
        <View style={styles.detailCard}>
          <Text style={styles.detailSubTitle}>current quote:</Text>
            <Text style={styles.detailText}>
              {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(currentInvoice?.payable)}
            </Text>
            <Text style={styles.detailText}>
              {new Intl.DateTimeFormat('en-KE', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              }).format(new Date(currentInvoice?._timestamp ?? null))}
            </Text>
            {orderDetails?.customer?.client_name && (<Text style={styles.detailText}>{orderDetails?.customer?.client_name}</Text>)}
          <Text style={styles.status}>{INVOICE_STATUS_MAP[currentInvoice?._status] || 'Unknown'}</Text>
          <View style={styles.statusAndPidContainer}>
            <Text style={styles.pid}>#{currentInvoice?._pid}</Text>
          </View>
        </View>
      )}

      {isDriver && orderDetails._status !== 'COMPLETED' && (
        <TouchableOpacity style={styles.button} onPress={markAsCompleted}>
          <Text style={styles.buttonText}>Mark as Delivered</Text>
        </TouchableOpacity>
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
  },
  imageContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 5,
    shadowColor: "#00b31a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailSubTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#009a9a",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#00b31a',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusAndPidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10, // You can adjust this value to increase the space from the bottom
    right: 10,
  },
  status: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#00b31a",
  },
  pid: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#b37400",
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    // color: '#333',
  },
  linkText: {
    color: '#007bff',
    // textDecorationLine: 'underline',
  },
  link: {
    color: '#007bff', // Example link color
    textDecorationLine: 'underline',
  },
});

export default OrderDetailScreen;
