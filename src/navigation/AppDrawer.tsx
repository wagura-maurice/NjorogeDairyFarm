// src/navigation/AppDrawer.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../components/common/ProfileScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = React.memo((props) => {
  // Event handler for help item press
  const handleHelpPress = () => {
    alert('Link to help');
    // Here you would typically handle the press, e.g., by navigation or linking to a webpage
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        {/* Example of adding an image to the drawer header */}
        <Image
          source={require('../assets/img/logo.png')} // Replace with your image path
          style={styles.drawerLogo}
        />
        <Text style={styles.drawerHeaderText}>NJOROGE DAIRY FARM</Text>
      </View>

      <DrawerItemList {...props} />

      <DrawerItem
        label="Help"
        onPress={handleHelpPress}
      />
      {/* Additional Drawer Items can be added here */}
    </DrawerContentScrollView>
  );
});

const AppDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      {/* ... other screens go here */}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0ebe6',
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerLogo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  // ... add more styles for your drawer content if needed
});

export default AppDrawer;
