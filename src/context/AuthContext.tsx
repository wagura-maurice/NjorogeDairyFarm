import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState('');
  const [userRoles, setUserRoles] = useState([]);

  const signIn = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/sign-in', { email, password });
      if (response.data.status === 'success') {
        setUserData(response.data.data.user);
        setUserToken(response.data.data.accessToken);
        setUserRoles(response.data.data.user.roles);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error('Sign In Error: ' + error.message);
    }
  }, []);

  const signUp = useCallback(async (name, email, password, role) => {
    try {
      const response = await api.post('/auth/sign-up', { name, email, password, password_confirmation: password, role });
      if (response.data.status === 'success') {
        setUserData(response.data.data.user);
        setUserToken(response.data.data.accessToken);
        setUserRoles(response.data.data.user.roles);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error('Sign Up Error: ' + error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (userToken) {
        await api.post('/auth/sign-out', {}, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
      }
      // Clear user data and token from the state
      setUserData(null);
      setUserToken('');
      setUserRoles([]);
    } catch (error) {
      throw new Error('Sign Out Error: ' + error.message);
    }
  }, [userToken]);  

  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.status !== 'success') {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error('Forgot Password Error: ' + error.message);
    }
  }, []);

  const hasRole = useCallback((roleSlug) => {
    return userRoles.some(role => role.slug === roleSlug);
  }, [userRoles]);

  const getUserData = useCallback(() => {
    return userData;
  }, [userData]);

  return (
    <AuthContext.Provider value={{ signIn, signUp, signOut, hasRole, getUserData, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
