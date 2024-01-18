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
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { validateEmail } from "../../utils/Validation";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { signUp } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'warning',
        position: 'bottom',
        text1: 'Please enter your name',
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: 'warning',
        position: 'bottom',
        text1: 'Please enter a valid email address',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'warning',
        position: 'bottom',
        text1: 'Password must be at least 6 characters long',
      });
      return;
    }

    if (!role) {
      Toast.show({
        type: 'warning',
        position: 'bottom',
        text1: 'Please select a role',
      });
      return;
    }

    try {
      const message = await signUp(name, email, password, role);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: message,
      });
      navigation.navigate("SignInScreen");
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: error.message,
      });
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
