// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../components/common/SplashScreen';
import Profile from '../components/common/Profile'; // Import Profile screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} />
      {/* Define other screens/routes here */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
