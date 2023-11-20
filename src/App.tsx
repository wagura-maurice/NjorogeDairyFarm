// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
