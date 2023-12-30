// src/navigation/AppNavigator.tsx
import React, { useContext, useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MarketplaceScreen from '../components/common/MarketplaceScreen';
import CheckOutScreen from '../components/common/CheckOutScreen';
import CustomerOrderScreen from '../components/common/CustomerOrderScreen';
import CustomerOrdersScreen from '../components/common/CustomerOrdersScreen';
import ProfileScreen from '../components/common/ProfileScreen';
import SplashScreen from '../components/common/SplashScreen';
import SignInScreen from '../components/auth/SignInScreen';
import SignUpScreen from '../components/auth/SignUpScreen';
import ForgotPasswordScreen from '../components/auth/ForgotPasswordScreen';
import NotificationModal from '../components/common/NotificationModal';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { cart } = useContext(CartContext); // Using the cart context
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  let timeoutHandle = null;

  const handleLogout = async () => {
    try {
      await signOut();
      setModalMessage('You have been successfully logged out.');
      setModalVisible(true);
      // Directly use the navigation from the hook's scope
      timeoutHandle = setTimeout(() => {
        navigation.navigate('SignInScreen'); // Use navigate instead of replace
      }, 1500);
    } catch (error) {
      setModalMessage(error.message || 'An error occurred during logout.');
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

  const authScreenOptions = () => {
    const navigation = useNavigation(); // Call useNavigation within the function scope
  
    return {
      headerLeft: () => (
        <TouchableOpacity style={styles.iconLeft} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={30} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.iconRightContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CheckOutScreen')}
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
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>NJOROGE DAIRY FARM</Text>
        </View>
      ),
      headerStyle: {
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
        backgroundColor: '#f0ebe6', // Set your desired color here
      },
      headerTintColor: '#ffffff', // Set the color of the back button and title, if necessary
      headerTitleStyle: {
        fontWeight: 'bold',
        // Add color property if you want to change the title color
        color: '#ffffff', // This sets the header title color to white
      },
    };
  };
    
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      {/* Authenticated Screens with the common header */}
      <Stack.Screen name="MarketplaceScreen" component={MarketplaceScreen} options={authScreenOptions} />
      <Stack.Screen name="CheckOutScreen" component={CheckOutScreen} options={authScreenOptions} />
      <Stack.Screen name="CustomerOrderScreen" component={CustomerOrderScreen} options={authScreenOptions} />
      <Stack.Screen name="CustomerOrdersScreen" component={CustomerOrdersScreen} options={authScreenOptions} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={authScreenOptions} />

      {/* Non-Authenticated Screens without the header */}
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleText: {
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  iconLeft: {
    paddingLeft: 16,
  },
  iconRightContainer: {
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRight: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -10, // Adjust the right position to move the badge to the left side of the icon
    top: -3, // Adjust the top position as needed
    backgroundColor: '#f68b1e',
    borderRadius: 15,
    width: 24, // Adjust the width as needed
    height: 24, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
