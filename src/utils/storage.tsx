// src/utils/storage.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    throw new Error('AsyncStorage Error: ' + error.message);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      throw new Error('No value found for key: ' + key);
    }
  } catch (error) {
    throw new Error('AsyncStorage Error: ' + error.message);
  }
};

const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new Error('AsyncStorage Error: ' + error.message);
  }
};

export { storeData, getData, removeData };
