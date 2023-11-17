// src/components/common/Profile.tsx
import React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import { IoMdHelpBuoy } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import Avatar from './Avatar';

const Profile = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Avatar source={{ uri: "https://source.unsplash.com/random" }} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Joe Bloggs</Text>
          <Text style={styles.userEmail}>joe@bloggs.com</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <Pressable style={styles.menuItem}>
          {/* Replace these icons with React Native compatible icons */}
          <IoSettingsOutline name="settings-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Settings</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <IoMdHelpBuoy name="help-buoy-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Help</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <TbLogout name="logout" size={24} color="#fff" />
          <Text style={styles.menuText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1f2937', // Approximation of Tailwind bg-gray-950
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  userName: {
    color: '#f9fafb', // Approximation of Tailwind text-gray-50
    fontSize: 24, // Approximation of Tailwind text-3xl
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#f9fafb', // Approximation of Tailwind text-gray-50
    fontSize: 18, // Approximation of Tailwind text-lg
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
  menuText: {
    color: '#f9fafb', // Approximation of Tailwind text-gray-50
    fontSize: 18, // Approximation of Tailwind text-lg
    marginLeft: 8,
  },
});

export default Profile;
