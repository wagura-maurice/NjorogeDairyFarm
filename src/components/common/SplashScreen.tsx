// src/components/common/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../../utils/Storage";

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  // Function to navigate to the screen based on user roles
  const navigateBasedOnRoles = (roles) => {
    if (roles.includes('customer')) {
      navigation.navigate("MarketplaceScreen");
    } else if (roles.includes('supplier')) {
      navigation.navigate("InventoryListingScreen");
    } else if (roles.includes('driver')) {
      navigation.navigate("OrderListingScreen");
    }
  };

  useEffect(() => {
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

    // Fetch user roles and navigate based on the roles
    const initializeApp = async () => {
      const rolesJson = await getData("userRoles");
      if (rolesJson) {
        const roles = JSON.parse(rolesJson);
        // Directly call the navigation function without setting state
        navigateBasedOnRoles(roles);
      } else {
        // Navigate to SignInScreen if there are no roles data
        navigation.navigate("SignInScreen");
      }
    };

    initializeApp();
  }, [navigation, fadeAnim]);

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
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});

export default SplashScreen;

