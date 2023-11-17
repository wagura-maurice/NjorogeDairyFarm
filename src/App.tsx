// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider

const App = () => {
  return (
    <AuthProvider> {/* Wrap NavigationContainer with AuthProvider */}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
