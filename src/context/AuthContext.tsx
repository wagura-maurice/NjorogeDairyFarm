// src/context/AuthContext.js
import React, { createContext, useCallback } from 'react';
import api from '../utils/api';
import { storeData, removeData, getData } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const signIn = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/sign-in', { email, password });
      if (response.data.status === 'success') {
        const userData = response.data.data.user;
        await storeData('userData', JSON.stringify(userData));
        await storeData('userToken', response.data.data.accessToken);
        await storeData('userRoles', JSON.stringify(userData.roles));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error('Sign In Error: ' + error.message);
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
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error('Sign Up Error: ' + error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await removeData('userToken');
      await removeData('userData');
      await removeData('userRoles');
    } catch (error) {
      throw new Error('Sign Out Error: ' + error.message);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.status === 'success') {
        console.log(response.data.message);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error('Forgot Password Error: ' + error.message);
    }
  }, []);

  const hasRole = useCallback(async (roleSlug) => {
    const roles = await getData('userRoles');
    if (roles) {
      const rolesArray = JSON.parse(roles);
      return rolesArray.some(role => role.slug === roleSlug);
    }
    return false;
  }, []);

  const getUserData = useCallback(async () => {
    const userData = await getData('userData');
    return userData ? JSON.parse(userData) : null;
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signUp, signOut, hasRole, getUserData, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;