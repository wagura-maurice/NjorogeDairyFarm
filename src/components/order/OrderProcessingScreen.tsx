// src/components/customer/OrderProcessingScreen.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { getData } from "../../utils/Storage";
import { CartContext } from "../../context/CartContext";
import { LocationContext } from "../../context/LocationContext";
import { validateTelephoneNumber } from "../../utils/Validation";
import Toast from 'react-native-toast-message';
import api from "../../utils/API";

const OrderProcessingScreen = ({ navigation }) => {
  const { cart, clearCart } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetailsState, setOrderDetailsState] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [transactData, setTransactData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData("userData");
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
  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const [payment, setPayment] = useState({
    phoneNumber: "",
  });

  const [step, setStep] = useState(1); // To handle step by step form

  const handleLocationSubmit = () => {
    saveLocation(location); // Save the location details in context and AsyncStorage
    setStep(2); // Proceed to payment details form
  };

  const handlePaymentSubmit = () => {
    if (validateTelephoneNumber(payment.phoneNumber)) {
      submitOrder({
        cartItems: cart,
        totalPrice: getTotalPrice(),
        location,
        payment,
      });
    } else {
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: 'Invalid Phone Number!',
        text2: 'Please enter a valid Kenyan phone number',
      });
    }
  };

  const submitOrder = async (orderDetails) => {
    try {
      if (!userData.customer || !userData.customer.id) {
        Toast.show({
          type: 'info',
          position: 'bottom',
          text1: 'Customer ID is not set',
          text2: 'Please provide a Customer number',
        });
        return;
      }

      setIsProcessing(true); // Start processing

       // Fetch the driver with the least number of orders
      const driverResponse = await api.get("/driver?include=orders&sort=order_count");
      const driverWithLeastOrders = driverResponse.data.data[0]; // Select the first driver

      const orders = await Promise.all(
        orderDetails.cartItems.map((item) => {
          return api.post("/order/catalog", {
            order_category_id: 1,
            produce_category_id: item.id,
            customer_id: userData.customer.id,
            driver_id: driverWithLeastOrders.id, // Use the fetched driver's ID
            quantity: item.quantity,
            total_amount: item.quantity * item.price,
          });
        })
      );

      const invoice = await api.post("/invoice/catalog", {
        category_id: 2,
        payable: orderDetails.totalPrice,
        _orders: orders.map((order) => order.data.data._pid),
      });

      // Handle the response from the invoice creation
      if (invoice.status === 201) {
        setOrderDetailsState(orderDetails);
        setInvoiceData(invoice.data.data);
        const transact = await api.post("/ipn/ke/mpesa/lnmo/transact", {
          reference: String(invoice.data.data._pid),
          amount: String(orderDetails.totalPrice),
          telephone: String(payment.phoneNumber),
        });

        if (transact.status === 201) {
          setTransactData(transact.data.data);
          // Navigate to a confirmation screen or reset the form
          // navigation.navigate('OrderConfirmationScreen', { transact: transact.data.data.transaction_id });
          Toast.show({
            type: 'info',
            position: 'bottom',
            text1: 'Transaction initialization!',
            text2: transact.data.message,
          });
        } else {
          Toast.show({
            type: 'info',
            position: 'bottom',
            text1: 'Transaction initialization!',
            text2: transact?.data?.message,
          });
        }
        // clearCart();
        setStep(3);
      } else {
        Toast.show({
          type: 'info',
          position: 'bottom',
          text1: 'Invoice creation failed',
          text2: invoice?.throwable?.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error submitting orders!',
        text2: error.message,
      });
    }
    setIsProcessing(false); // End processing
  };

  const handleLocationChange = (key, value) => {
    setLocation((prevLocation) => ({ ...prevLocation, [key]: value }));
  };

  const handleViewOrderHistory = () => {
    navigation.navigate("OrderListingScreen");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.stepIndicatorContainer}>
          <StepIndicator currentStep={step} />
        </View>
        {step === 1 && (
          <View style={styles.formCard}>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={location.city}
                onChangeText={(text) => handleLocationChange("city", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Road"
                value={location.road}
                onChangeText={(text) => handleLocationChange("road", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Street"
                value={location.street}
                onChangeText={(text) => handleLocationChange("street", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Building"
                value={location.building}
                onChangeText={(text) => handleLocationChange("building", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="House Number"
                value={location.houseNumber}
                onChangeText={(text) => handleLocationChange("houseNumber", text)}
              />
              <Text style={styles.button} onPress={handleLocationSubmit}>Next</Text>
            </View>
          </View>
        )}
        {step === 2 && (
          <View style={styles.formCard}>
            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#b37400" />
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            )}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone Number for M-Pesa"
                value={payment.phoneNumber}
                onChangeText={(text) =>
                  setPayment({ ...payment, phoneNumber: text })
                }
                keyboardType="phone-pad"
              />
              <Text style={styles.button} onPress={() => setStep(1)}>Previous</Text>
              <Text style={styles.button} onPress={handlePaymentSubmit}>Next</Text>
            </View>
          </View>
        )}
        {step === 3 && invoiceData && orderDetailsState && (
          <View style={styles.formCard}>
            <View style={styles.formContainer}>
              <Text style={styles.successMessage}>
                Order placed successfully.
              </Text>
              <Text style={styles.orderDetails}>
                0rder ID: #{invoiceData._pid}
              </Text>
              <Text style={styles.orderDetails}>
                Amount: {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(orderDetailsState.totalPrice)}
              </Text>
              <Text style={styles.emailMessage}>
                A confirmation email has been sent {/* to {userData.email} */}
              </Text>
              <Text style={styles.button} onPress={handleViewOrderHistory}>Orders</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );  
};

const StepIndicator = ({ currentStep }) => {
  return (
    <View style={styles.stepIndicatorContainer}>
      {['LOCATION', 'PAYMENT', 'CONFIRMATION'].map((step, index) => {
        const isCurrentStep = index === currentStep - 1;
        return (
          <View key={step} style={styles.stepContainer}>
            <Text
              style={[
                styles.stepText,
                isCurrentStep && styles.currentStepText,
              ]}
            >
              {index + 1}
            </Text>
            <Text
              style={[
                styles.stepLabel,
                isCurrentStep && styles.currentStepLabel,
              ]}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0ebe6",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 10,
  },
  formCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOffset: { height: 0, width: 0 },
    elevation: 3,
    width: '95%',
    alignSelf: 'center',
  },
  input: {
    height: 45,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    width: "100%",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    backgroundColor: "#00b31a",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  successMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00b31a",
    paddingBottom: 10,
  },
  orderDetails: {
    fontSize: 16,
    color: "black",
  },
  emailMessage: {
    fontSize: 14,
    color: "#b37400",
    paddingTop: 10,
    paddingBottom: 20,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepText: {
    color: '#00b31a',
    fontSize: 18,
    marginBottom: 4,
  },
  currentStepText: {
    color: '#b37400',
    fontWeight: 'bold',
  },
  stepLabel: {
    color: '#00b31a',
    fontSize: 14,
  },
  currentStepLabel: {
    color: '#b37400',
    fontWeight: 'bold',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#b37400',
  },
});

export default OrderProcessingScreen;
