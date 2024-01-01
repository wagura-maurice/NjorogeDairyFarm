// src/components/common/NotificationModal.tsx
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

const NotificationModal = ({ isVisible, type, title, message, onClose }) => {
  const backgroundColor = getBackgroundColor(type);
  const bounceAnimation = useRef(new Animated.Value(0)).current; // Initial value for translateY: 0

  useEffect(() => {
    if (isVisible) {
      // Start the bounce animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnimation, {
            toValue: -10, // Bounce up
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnimation, {
            toValue: 0, // Bounce back to original position
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        {
          iterations: 3, // Number of bounce cycles
        }
      ).start();
    } else {
      bounceAnimation.setValue(0); // Reset animation state when modal is not visible
    }
  }, [isVisible, bounceAnimation]);

  const animatedStyle = {
    transform: [{ translateY: bounceAnimation }],
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none" // Disable the default slide animation
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animated.View
          style={[styles.modalView, animatedStyle, { backgroundColor }]}
        >
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const getBackgroundColor = (type) => {
  switch (type) {
    case "success":
      return "green";
    case "warning":
      return "orange";
    case "info":
      return "blue";
    case "danger":
      return "red";
    default:
      return "gray";
  }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationModal;
