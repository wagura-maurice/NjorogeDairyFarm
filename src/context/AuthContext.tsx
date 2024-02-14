// src/context/AuthContext.js
import React, { createContext, useState, useCallback } from "react";
import api from "../utils/API";
import { storeData, getData, removeData } from "../utils/Storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const signIn = useCallback(async (email, password) => {
    try {
      const response = await api.post("/auth/sign-in", { email, password });
      if (response.data.status === "success") {
        const { user, accessToken } = response.data.data;
        await storeData('userData', JSON.stringify(user));
        await storeData('userToken', accessToken);
        const roleNames = user.roles.map(role => role.name);
        await storeData('userRoles', JSON.stringify(roleNames));
        return 'Sign In Successful';
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const signUp = useCallback(async (name, email, password, role) => {
    try {
      const response = await api.post("/auth/sign-up", {
        name,
        email,
        password,
        role,
      });
      if (response.data.status === "success") {
        const { user, accessToken } = response.data.data;
        await storeData("userData", JSON.stringify(user));
        await storeData("userToken", accessToken);
        const roleNames = user.roles.map(role => role.name);
        await storeData('userRoles', JSON.stringify(roleNames));
        return "Sign Up Successful";
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      /* const userToken = await getData('userToken'); // Get token and then remove it
      if (userToken) {
        await api.post('/auth/sign-out', {}, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
      } */
      await removeData("userData");
      await removeData("userToken");
      await removeData("userRoles");

      // Perform a check to see if the data is still there
      const userData = await getData("userData");
      const userToken = await getData("userToken");
      const userRoles = await getData("userRoles");

      if (userData || userToken || userRoles) {
        // If any of the data still exists, throw an error
        throw new Error("Failed to clear all user data on sign out.");
      }

      // If the data has been successfully removed, proceed
      return "Sign Out Successful";
    } catch (error) {
      throw error;
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data.status === "success") {
        return response.data.message;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signUp, signOut, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
