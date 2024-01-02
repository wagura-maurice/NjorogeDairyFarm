// src/components/common/SplashScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { isSignedIn } from "../../utils/AuthUtils";
import { getData } from "../../utils/Storage";

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData("userData");
      const userData = userDataJson ? JSON.parse(userDataJson) : null;
      setUserData(userData);
    };

    fetchData();
  }, []);
  
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
      ])
    ).start();

    // Check sign-in status and navigate with delay
    const checkSignInStatus = async () => {
      const signedIn = await isSignedIn();
      // Wait for 3 seconds before navigating
      setTimeout(() => {
        if (signedIn && userData) {
          if (userData.customer && userData.customer.id) {
            navigation.navigate("MarketplaceScreen");
          } else if (userData.supplier && userData.supplier.id) {
            navigation.navigate("MarketplaceScreen");
          } else if (userData.driver && userData.driver.id) {
            navigation.navigate("MarketplaceScreen");
          } else {
            navigation.navigate("MarketplaceScreen");
          }
        } else {
          navigation.navigate("SignInScreen");
        }
      }, 3000);      
    };

    checkSignInStatus();
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image
          source={require("../../assets/img/logo.png")}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#90EE90",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: "100%",
    marginLeft: -1.5,
    marginTop: -1.5,
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});

export default SplashScreen;
