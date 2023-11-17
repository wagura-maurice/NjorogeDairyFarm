// src/components/common/NotificationModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NotificationModal = ({ isVisible, type, title, message, onClose }) => {
  const backgroundColor = getBackgroundColor(type);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, {borderColor: backgroundColor}]}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={[styles.button, {backgroundColor}]}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getBackgroundColor = (type) => {
  switch (type) {
    case 'success':
      return 'green';
    case 'warning':
      return 'orange';
    case 'info':
      return 'blue';
    case 'danger':
      return 'red';
    default:
      return 'gray';
  }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
});

export default NotificationModal;
