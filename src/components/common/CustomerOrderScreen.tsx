// /home/wagura-maurice/Documents/Projects/NjorogeDairyFarm/src/components/common/CustomerOrderScreen.tsx

import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { getData } from '../../utils/Storage';
import { CartContext } from '../../context/CartContext';
import { LocationContext } from '../../context/LocationContext';
import api from '../../utils/API';

const CustomerOrderScreen = ({ navigation }) => {
  const { cart, clearCart } = useContext(CartContext);
  const [orderDetailsState, setOrderDetailsState] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [transactData, setTransactData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData('userData');
      const userData = userDataJson ? JSON.parse(userDataJson) : null;
      setUserData(userData);
    };

    fetchData();
  }, []);

    const locationContext = useContext(LocationContext); // Use the context
  
    if (!locationContext) {
      // If the context does not exist, return null or some error component
      return null;
    }
  
    const { location, saveLocation, setLocation } = locationContext; // Destructure the needed data  

  // Calculate total price manually
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const [payment, setPayment] = useState({
    phoneNumber: '',
  });

  const [step, setStep] = useState(1); // To handle step by step form

  const handleLocationSubmit = () => {
    saveLocation(location); // Save the location details in context and AsyncStorage
    setStep(2); // Proceed to payment details form
  };
    
  const handlePaymentSubmit = () => {
    submitOrder({
      cartItems: cart,
      totalPrice: getTotalPrice(),
      location,
      payment,
    }); // Proceed to submit the order
  };

  const submitOrder = async (orderDetails) => {
    try {
      if (!userData.customer || !userData.customer.id) {
        console.error('Customer ID is not set');
        return;
      }
      
      const orders = await Promise.all(orderDetails.cartItems.map(item => {
        return api.post('/order/catalog', {
          order_category_id: 1,
          produce_category_id: item.id,
          customer_id: userData.customer.id,
          quantity: item.quantity,
          total_amount: (item.quantity * item.price),
        });
      }));
      
      const invoice = await api.post('/invoice/catalog', {
        category_id: 2,
        payable: orderDetails.totalPrice,
        _orders: orders.map(order => order.data.data._pid),
      });

      // Handle the response from the invoice creation
      if (invoice.status === 201) {
        setOrderDetailsState(orderDetails);
        setInvoiceData(invoice.data.data);
        const transact = await api.post('/ipn/ke/mpesa/lnmo/transact', {
          reference: String(invoice.data.data._pid),
          amount: String(orderDetails.totalPrice),
          telephone: String(payment.phoneNumber),
        });

        if (transact.status === 201) {
          setTransactData(transact.data.data);
          // Navigate to a confirmation screen or reset the form
          // navigation.navigate('OrderConfirmationScreen', { transact: transact.data.data.transaction_id });
        } else {
          console.error('Transaction creation failed:', transact);
        }
        clearCart();
        setStep(3);
      } else {
        console.error('Invoice creation failed:', invoice);
        // Optionally set an error state here
      }
    } catch (error) {
      console.error('Error submitting orders:', error);
      // Optionally set an error state here and display it to the user
    }
  };  

  const handleLocationChange = (key, value) => {
    setLocation(prevLocation => ({ ...prevLocation, [key]: value }));
  };

  const handleViewOrderHistory = () => {
    navigation.navigate('CustomerOrdersScreen');
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Enter Delivery Location Details</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={location.city}
              onChangeText={(text) => handleLocationChange('city', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Road"
              value={location.road}
              onChangeText={(text) => handleLocationChange('road', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Street"
              value={location.street}
              onChangeText={(text) => handleLocationChange('street', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Building"
              value={location.building}
              onChangeText={(text) => handleLocationChange('building', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="House Number"
              value={location.houseNumber}
              onChangeText={(text) => handleLocationChange('houseNumber', text)}
            />
            <View style={styles.nextButtonContainer}>
              <Button title="Next" onPress={handleLocationSubmit} />
            </View>
          </View>
        </>
      )}
      {step === 2 && (
        <>
          <Text style={styles.title}>Settle Payment</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number for M-Pesa"
              value={payment.phoneNumber}
              onChangeText={(text) => setPayment({ ...payment, phoneNumber: text })}
              keyboardType="phone-pad"
            />
            <View style={styles.buttonContainer}>
              <View style={{ width: '49%' }}>
                <Button title="Previous" onPress={() => setStep(1)} />
              </View>
              <View style={{ width: '49%' }}>
                <Button title="Confirm Order" onPress={handlePaymentSubmit} />
              </View>
            </View>
          </View>
        </>
      )}
      {step === 3 && invoiceData && orderDetailsState && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.header}>Order Confirmation</Text>
          <View style={styles.confirmationCard}>
            <Text style={styles.successMessage}>Order placed successfully.</Text>
            <Text style={styles.orderDetails}>Order ID: {invoiceData._pid}</Text>
            <Text style={styles.orderDetails}>Order Amount: KES {orderDetailsState.totalPrice.toFixed(2)}</Text>
            <Text style={styles.emailMessage}>
              A confirmation email has been sent to {userData.email}
            </Text>
            <Button
              title="View Order History"
              onPress={handleViewOrderHistory}
              color="#FFA500"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0ebe6',
  },
  formContainer: {
    width: '100%', // Use full width to center inner content with padding
    alignItems: 'center', // Center horizontally
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%', // Set a width for the input fields
    marginTop: 12,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This will place the buttons at opposite ends
    width: '80%', // Set a width for the buttons to match the input fields
    marginTop: 20, // Add some margin at the top to space it from the inputs
  },
  title: {
    // Style for the title text
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  nextButtonContainer: {
    marginTop: 20,
    width: '80%', // Match the width of the input fields
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    paddingBottom: 10,
  },
  confirmationCard: {
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    elevation: 3, // This adds a shadow on Android
    backgroundColor: 'white', // Card's background color
    padding: 20,
    borderRadius: 10,
    width: '90%', // Or any other width you prefer
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    paddingBottom: 10,
  },
  orderDetails: {
    fontSize: 16,
    color: 'black',
  },
  emailMessage: {
    fontSize: 14,
    color: 'grey',
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default CustomerOrderScreen;
