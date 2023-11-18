// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importing screens
import SplashScreen from '../components/common/SplashScreen';
import ProfileScreen from '../components/common/ProfileScreen';
// Import other screens as needed

// Importing utility functions if needed
import { hasRole, getUserData } from '../utils/AuthUtils';

const Stack = createStackNavigator();

const AppNavigator = () => {
  // You can use hasRole and getUserData here if necessary

  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      {/* SplashScreen as the initial route */}
      <Stack.Screen 
        name="SplashScreen" 
        component={SplashScreen} 
        options={{ headerShown: false }} 
      />
      
      {/* ProfileScreen */}
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen}
        // Add options or configurations if needed
      />

      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
