// src/navigation/AppNavigator.tsx
import React, { useState, useContext, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import InventoryListingScreen from "../components/inventory/InventoryListingScreen";
import InventoryDetailScreen from "../components/inventory/InventoryDetailScreen";
import OrderProcessingScreen from "../components/order/OrderProcessingScreen";
import ForgotPasswordScreen from "../components/auth/ForgotPasswordScreen";
import MarketplaceScreen from "../components/customer/MarketplaceScreen";
import OrderListingScreen from "../components/order/OrderListingScreen";
import OrderDetailScreen from "../components/order/OrderDetailScreen";
import CheckOutScreen from "../components/customer/CheckOutScreen";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../components/common/SplashScreen";
import SignInScreen from "../components/auth/SignInScreen";
import SignUpScreen from "../components/auth/SignUpScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import Toast from 'react-native-toast-message';
import { getData } from '../utils/Storage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isCustomer, setIsCustomer] = useState(false);

  const { cart } = useContext(CartContext);
  const { signOut } = useContext(AuthContext);
  
  const navigation = useNavigation();

  let timeoutHandle = null;

  const handleLogout = async () => {
    try {
      await signOut();
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'You have been successfully logged out.',
      });
      timeoutHandle = setTimeout(() => {
        navigation.navigate("SignInScreen");
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'An error occurred during logout:',
        text2: error.message
      });
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const rolesData = await getData("userRoles");
      if (rolesData) {
        const roles = JSON.parse(rolesData);
        setIsCustomer(roles.includes('customer'));
      }
    };
  
    initialize();
  }, []);  

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
      "OrderDetailScreen",
      "InventoryListingScreen",
      "InventoryDetailScreen",
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

    // This function determines the icon and the navigation target
    const getHeaderRightIconAndAction = () => {
      let iconName = "cart-outline";
      let action = () => navigation.navigate("CheckOutScreen");

      if (isCustomer) {
        if (route.name === "MarketplaceScreen") {
          action = () => navigation.navigate("CheckOutScreen");
        } else if (
          route.name === "CheckOutScreen" ||
          route.name === "OrderProcessingScreen" ||
          route.name === "OrderListingScreen" ||
          route.name === "OrderDetailScreen" ||
          route.name === "InventoryListingScreen" ||
          route.name === "InventoryDetailScreen"
        ) {
          iconName = "home-outline";
          action = () => navigation.navigate("MarketplaceScreen");
        }
      }

      return { iconName, action };
    };

    return {
      headerLeft: () => (
        canGoBackToAuthenticatedScreen() ? (
          <TouchableOpacity style={styles.iconLeft} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color="#b37400" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconLeft} onPress={handleLogout}>
            <Ionicons name="power-outline" size={30} color="#b37400" />
          </TouchableOpacity>
        )
      ),
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>      NJOROGE DAIRY FARM</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.iconRightContainer}>
          {isCustomer && (
            <TouchableOpacity
              onPress={getHeaderRightIconAndAction().action}
              style={styles.iconRight}
            >
              <Ionicons name={getHeaderRightIconAndAction().iconName} size={30} color="#b37400" />
              {cart.length > 0 && route.name === "MarketplaceScreen" && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      ),
      headerStyle: {
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
        backgroundColor: "#f0ebe6",
      },
      headerTintColor: "#ffffff",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#ffffff",
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
        name="OrderDetailScreen"
        component={OrderDetailScreen}
        options={authScreenOptions}
      />
      <Stack.Screen
        name="InventoryListingScreen"
        component={InventoryListingScreen}
        options={authScreenOptions}
      />
      <Stack.Screen
        name="InventoryDetailScreen"
        component={InventoryDetailScreen}
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
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    paddingLeft: 16,
    width: 50,
  },
  headerTitle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  headerTitleText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: "#00b31a",
  },
  iconRightContainer: {
    paddingRight: 16,
    width: 50,
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
