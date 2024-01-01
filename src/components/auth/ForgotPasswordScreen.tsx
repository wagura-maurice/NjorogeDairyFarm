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
import NotificationModal from "../common/NotificationModal";
import { validateEmail } from "../../utils/Validation";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { forgotPassword } = useContext(AuthContext);

  const [modalType, setModalType] = useState("info"); // New state for modal type

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      // Use the validateEmail function for robust email validation
      setModalMessage("Please enter a valid email address.");
      setModalType("warning"); // Set the modal type to warning
      setModalVisible(true);
      return;
    }

    try {
      const message = await forgotPassword(email);
      setModalMessage(message || "Password reset email sent.");
      setModalType("success"); // Set the modal type to success
      setModalVisible(true);
    } catch (error) {
      setModalMessage(error.message);
      setModalType("danger"); // Set the modal type to danger on error
      setModalVisible(true);
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
          Forgotten your account password? Enter your email address below and
          you'll receive a link to create a new one.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          placeholderTextColor="#aaa" // Placeholder text color
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
      <NotificationModal
        isVisible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        type={modalType}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0ebe6", // A soft cream background
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
    borderRadius: 50, // Half of width and height to make it a circle
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // This ensures the image does not escape the circle boundaries
    marginBottom: 20, // Space between circle and text
  },
  logo: {
    width: "100%", // Fill the circle
    height: "100%", // Maintain aspect ratio
    marginLeft: -1.5, // Move the logo to the left by 1px
    marginTop: -1.5, // Move the logo to the top by 1px
  },
  subtitle: {
    fontSize: 12,
    color: "#555", // Darker grey for subtitle
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
