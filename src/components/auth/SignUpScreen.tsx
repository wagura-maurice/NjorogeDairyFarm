// src/components/auth/SignUpScreen.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { validateEmail } from "../../utils/Validation";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import NotificationModal from "../common/NotificationModal";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { signUp } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!name.trim()) {
      setModalMessage("Please enter your name.");
      setModalVisible(true);
      return;
    }
    if (!validateEmail(email)) {
      setModalMessage("Please enter a valid email address.");
      setModalVisible(true);
      return;
    }
    if (password.length < 6) {
      setModalMessage("Password must be at least 6 characters long.");
      setModalVisible(true);
      return;
    }
    if (!role) {
      setModalMessage("Please select a role.");
      setModalVisible(true);
      return;
    }

    try {
      await signUp(name, email, password, role);
      setModalMessage("Registration successful! You can now sign in.");
      setModalVisible(true);
      navigation.navigate("SignInScreen");
    } catch (error) {
      setModalMessage(error.message);
      setModalVisible(true);
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate("SignInScreen");
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
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Picker
        selectedValue={role}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
      >
        <Picker.Item label="Select Role" value="" />
        <Picker.Item label="Supplier" value="supplier" />
        <Picker.Item label="Customer" value="customer" />
        <Picker.Item label="Driver" value="driver" />
      </Picker>
      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.signIn} onPress={navigateToSignIn}>
        Already have an account? Sign In
      </Text>
      <NotificationModal
        isVisible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        type="info"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0ebe6",
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
  picker: {
    width: "100%",
    marginBottom: 20,
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
  signIn: {
    color: "#333",
    marginTop: 10,
  },
});

export default SignUpScreen;
