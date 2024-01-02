// src/navigation/AppNavigator.tsx
import React, { useContext, useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MarketplaceScreen from "../components/customer/MarketplaceScreen";
import CheckOutScreen from "../components/customer/CheckOutScreen";
import OrderProcessingScreen from "../components/customer/OrderProcessingScreen";
import OrderListingScreen from "../components/customer/OrderListingScreen";
import ProfileScreen from "../components/common/ProfileScreen";
import SplashScreen from "../components/common/SplashScreen";
import SignInScreen from "../components/auth/SignInScreen";
import SignUpScreen from "../components/auth/SignUpScreen";
import ForgotPasswordScreen from "../components/auth/ForgotPasswordScreen";
import NotificationModal from "../components/common/NotificationModal";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { cart } = useContext(CartContext); // Using the cart context
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  let timeoutHandle = null;

  const handleLogout = async () => {
    try {
      await signOut();
      setModalMessage("You have been successfully logged out.");
      setModalVisible(true);
      timeoutHandle = setTimeout(() => {
        navigation.navigate("SignInScreen");
      }, 1500);
    } catch (error) {
      setModalMessage(error.message || "An error occurred during logout.");
      setModalVisible(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []);

  const authScreenOptions = ({ navigation, route }) => {
    // Define a list of authenticated screen names
    const authenticatedScreens = [
      "MarketplaceScreen",
      "CheckOutScreen",
      "OrderProcessingScreen",
      "OrderListingScreen",
      "ProfileScreen",
    ];

    // Function to check if the previous route is an authenticated screen
    const canGoBackToAuthenticatedScreen = () => {
      const currentRouteIndex = navigation.getState().index;
      if (currentRouteIndex === 0) {
        // If we are on the first screen, can't go back
        return false;
      }
      // Get the route name of the previous screen
      const previousRouteName = navigation.getState().routes[currentRouteIndex - 1].name;
      // Check if the previous screen is an authenticated screen
      return authenticatedScreens.includes(previousRouteName);
    };

    return {
      headerLeft: () => (
        canGoBackToAuthenticatedScreen() ? (
          <TouchableOpacity style={styles.iconLeft} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color="#000" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconLeft} onPress={handleLogout}>
            <Ionicons name="power-outline" size={30} color="#000" />
          </TouchableOpacity>
        )
      ),
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>NJOROGE DAIRY FARM</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.iconRightContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CheckOutScreen")}
            style={styles.iconRight}
          >
            <Ionicons name="cart-outline" size={30} color="#000" />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
        backgroundColor: "#f0ebe6", // Set your desired color here
      },
      headerTintColor: "#ffffff", // Set the color of the back button and title, if necessary
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#ffffff", // This sets the header title color to white
      },
    };
  };

  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      {/* Authenticated Screens with the common header */}
      <Stack.Screen
        name="MarketplaceScreen"
        component={MarketplaceScreen}
        options={authScreenOptions}
      />
      <Stack.Screen
        name="CheckOutScreen"
        component={CheckOutScreen}
        options={authScreenOptions}
      />
      <Stack.Screen
        name="OrderProcessingScreen"
        component={OrderProcessingScreen}
        options={authScreenOptions}
      />
      <Stack.Screen
        name="OrderListingScreen"
        component={OrderListingScreen}
        options={authScreenOptions}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={authScreenOptions}
      />

      {/* Non-Authenticated Screens without the header */}
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    paddingLeft: 16,
    width: 50, // Adjust the width to match the headerRight button width
  },
  headerTitle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  headerTitleText: {
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
    textAlign: "center", // Ensure the text itself is centered within the title view
  },
  iconRightContainer: {
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconRight: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    right: -10,
    top: -3,
    backgroundColor: "#f68b1e",
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AppNavigator;
