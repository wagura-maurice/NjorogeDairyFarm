// src/components/Avatar.tsx
import React from "react";
import { Image, StyleSheet } from "react-native";

export const Avatar = ({ source }) => {
  return <Image source={source} style={styles.avatar} />;
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Adjust as needed
  },
});
