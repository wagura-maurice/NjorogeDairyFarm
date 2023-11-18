// src/context/AuthContext.js
import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/API';
import { storeData, removeData } from '../utils/Storage';
import NotificationModal from '../components/common/NotificationModal'; // Import the NotificationModal

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error'); // Type can be 'success', 'warning', 'info', 'danger'

  const showError = (message) => {
    setModalMessage(message);
    setModalType('danger');
    setModalVisible(true);
  };

  const signIn = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/sign-in', { email, password });
      if (response.data.status === 'success') {
        const userData = response.data.data.user;
        await storeData('userData', JSON.stringify(userData));
        await storeData('userToken', response.data.data.accessToken);
        await storeData('userRoles', JSON.stringify(userData.roles));
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      showError('Sign In Error: ' + error.message);
    }
  }, []);

  const signUp = useCallback(async (name, email, password, role) => {
    try {
      const response = await api.post('/auth/sign-up', { name, email, password, role });
      if (response.data.status === 'success') {
        const userData = response.data.data.user;
        await storeData('userData', JSON.stringify(userData));
        await storeData('userToken', response.data.data.accessToken);
        await storeData('userRoles', JSON.stringify(userData.roles));
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      showError('Sign Up Error: ' + error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await removeData('userToken');
      await removeData('userData');
      await removeData('userRoles');
    } catch (error) {
      showError('Sign Out Error: ' + error.message);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.status === 'success') {
        console.log(response.data.message);
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      showError('Forgot Password Error: ' + error.message);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signUp, signOut, forgotPassword }}>
      {children}
      <NotificationModal
        isVisible={isModalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
