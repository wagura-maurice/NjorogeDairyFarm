// src/App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LocationProvider } from "./context/LocationContext";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <LocationProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </LocationProvider>
        </CartProvider>
      </AuthProvider>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default App;
