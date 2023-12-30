// src/components/auth/SignInScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import NotificationModal from '../common/NotificationModal';
import { validateEmail } from '../../utils/Validation';
import CheckBox from '@react-native-community/checkbox';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (!email || !validateEmail(email)) {
      setModalMessage('Please enter a valid email address.');
      setModalVisible(true);
      return;
    }
    if (!password) {
      setModalMessage('Please enter your password.');
      setModalVisible(true);
      return;
    }
    try {
      await signIn(email, password);
      navigation.navigate('MarketplaceScreen');
    } catch (error) {
      setModalMessage(error.message);
      setModalVisible(true);
    }
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image 
          source={require('../../assets/img/logo.png')} 
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
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={rememberMe}
          onValueChange={setRememberMe}
          style={styles.checkbox}
          tintColors={{ true: '#00FF00', false: '#333' }} // Optional: customize checkbox colors
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
      <NotificationModal
        isVisible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        type="danger"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0ebe6',
    padding: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50, // Half of width and height to make it a circle
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // This ensures the image does not escape the circle boundaries
    marginBottom: 20, // Space between circle and text
  },
  logo: {
    width: '100%', // Fill the circle
    height: '100%', // Maintain aspect ratio
    marginLeft: -1.5, // Move the logo to the left by 1px
    marginTop: -1.5, // Move the logo to the top by 1px
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center', // Ensure checkbox and label are vertically aligned
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    color: '#333',
    marginLeft: 8, // Add space between checkbox and label
  },
  button: {
    width: '100%',
    backgroundColor: '#00FF00',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetPassword: {
    color: '#333',
  },
  signUp: {
    color: '#333',
    marginTop: 10,
  },
});

export default SignInScreen;