// src/components/common/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isSignedIn } from '../../utils/AuthUtils';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    // Fade in and out animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Check sign-in status and navigate with delay
    const checkSignInStatus = async () => {
      const signedIn = await isSignedIn();
      // Wait for 3 seconds before navigating
      setTimeout(() => {
        if (signedIn) {
          navigation.navigate('ProfileScreen');
        } else {
          navigation.navigate('SignInScreen');
        }
      }, 3000);
    };

    checkSignInStatus();
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image 
          source={require('../../assets/img/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        Loading...
      </Animated.Text>
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
    height: '100%', // Maintain aspect ratio
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center', // Center text horizontally
  },
});

export default SplashScreen;
