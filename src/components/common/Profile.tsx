// src/components/common/Profile.tsx
import React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to link this library
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to link this library

const Profile = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image 
          source={{ uri: "https://source.unsplash.com/random" }} 
          style={styles.avatar} 
        />
        <Text style={styles.userName}>Joe Bloggs</Text>
        <Text style={styles.userEmail}>joe@bloggs.com</Text>
      </View>
      <View style={styles.menuContainer}>
        <Pressable style={styles.menuItem}>
          <Icon name="settings-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Settings</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Icon name="help-circle-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Help</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <MaterialIcon name="logout" size={24} color="#fff" />
          <Text style={styles.menuText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color
  },
  container: {
    alignItems: 'center',
    paddingTop: 50, // Adjust the padding as needed
  },
  avatar: {
    width: 120, // Size of the avatar
    height: 120, // Size of the avatar
    borderRadius: 60, // Half of width/height to make it round
    marginTop: 8, // Space between top of the screen and avatar
    marginBottom: 16, // Space between avatar and text
  },
  userName: {
    color: '#FFFFFF', // White color for the text
    fontSize: 26, // Larger text for the name
    fontWeight: 'bold',
    marginBottom: 4, // Space between name and email
  },
  userEmail: {
    color: '#FFFFFF', // White color for the text
    fontSize: 16, // Smaller text for the email
    marginBottom: 36, // Space between email and menu items
  },
  menuContainer: {
    alignItems: 'center', // Align menu items to center
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24, // Space between menu items
  },
  menuText: {
    color: '#FFFFFF', // White color for the text
    fontSize: 18, // Text size for menu items
    marginLeft: 16, // Space between icon and text
  },
});

export default Profile;
