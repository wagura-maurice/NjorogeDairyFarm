// src/components/common/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Profile'); // Navigate to Profile screen after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer
  }, [navigation]);
    
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image 
          source={require('../../assets/img/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90EE90', // Light green background
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50, // Half of width and height to make it a circle
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // This ensures the image does not escape the circle boundaries
    marginBottom: 20, // Space between circle and text
  },
  logo: {
    width: '100%', // Fill the circle
    height: '100%' // Maintain aspect ratio
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center', // Center text horizontally
  },
});

export default SplashScreen;

// if the user is not logged in, we can navigate to the Login screen instead of the Profile screen. We can do this by using the useNavigation hook from React Navigation. We can then use the navigate method to navigate to the Profile screen after 3 seconds. We can also use the useEffect hook to clean up the timer when the component unmounts.

// the navigatin to the login screen should be triiger froma notehr FileReader, i.e somthin that globally availabin anyware in the app
