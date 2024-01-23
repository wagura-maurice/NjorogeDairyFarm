// src/components/auth/SignInScreen.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import CheckBox from "@react-native-community/checkbox";
import { validateEmail } from "../../utils/Validation";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-toast-message';
import { getData } from "../../utils/Storage";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation();

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

  const handleSignIn = async () => {
    if (!email || !validateEmail(email)) {
      Toast.show({
        type: 'warning',
        position: 'bottom',
        text1: 'Please enter a valid email address',
      });
      return;
    }

    if (!password) {
      Toast.show({
        type: 'warning',
        position: 'bottom',
        text1: 'Please enter your password',
      });
      return;
    }

    try {
      const message = await signIn(email, password);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: message,
      });
      navigateBasedOnRoles(JSON.parse(await getData("userRoles")));
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: error.message,
      });
    }
  };  

  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image
          source={require("../../assets/img/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisibility}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisibility(!passwordVisibility)}
          style={styles.eyeIcon}
        >
          <Icon
            name={passwordVisibility ? "eye-off" : "eye"}
            size={25}
            color="#333"
            style={{ opacity: 0.5 }} // This will make the icon more faded
          />
        </TouchableOpacity>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={rememberMe}
          onValueChange={setRememberMe}
          style={styles.checkbox}
          tintColors={{ true: "#00FF00", false: "#333" }}
        />
        <Text style={styles.label}>Remember me</Text>
      </View>
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.resetPassword} onPress={navigateToForgotPassword}>
        Reset password
      </Text>
      <Text style={styles.signUp} onPress={navigateToSignUp}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0ebe6",
    padding: 20,
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
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    padding: 15,
  },
  eyeIconImage: {
    width: 25,
    height: 25,
  },
  checkboxContainer: {
    flexDirection: "row", // Set back to row for inline elements
    alignItems: "center", // Vertically align checkbox and label
    width: "100%",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    color: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#00FF00",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  resetPassword: {
    color: "#333",
  },
  signUp: {
    color: "#333",
    marginTop: 10,
  },
});

export default SignInScreen;
