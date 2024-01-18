// src/components/auth/ForgotPasswordScreen.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { validateEmail } from "../../utils/Validation";
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useContext(AuthContext);

  const handleForgotPassword = async () => {
    if (!email || !validateEmail(email)) {
      Toast.show({
        type: 'warning',
        position: 'bottom',
        text1: 'Please enter a valid email address',
      });
      return;
    }

    try {
      const message = await forgotPassword(email);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: message,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: error.message,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.circle}>
          <Image
            source={require("../../assets/img/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.subtitle}>
          Forgotten your account password? Enter your email address below and you'll receive a link to create a new one.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0ebe6",
  },
  content: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
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
  subtitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
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
});

export default ForgotPasswordScreen;
