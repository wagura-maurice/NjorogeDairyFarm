// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importing screens
import ProfileScreen from '../components/common/ProfileScreen';
import SplashScreen from '../components/common/SplashScreen';

import SignInScreen from '../components/auth/SignInScreen';
import SignUpScreen from '../components/auth/SignUpScreen';
import ForgotPasswordScreen from '../components/auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      
      <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
