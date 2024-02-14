// src/utils/Storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores data in AsyncStorage.
 * @param key The key under which to store the value.
 * @param value The value to store (must be a string).
 */
const storeData = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`AsyncStorage Error: ${error.message}`);
  }
};

/**
 * Retrieves data from AsyncStorage.
 * @param key The key under which the value is stored.
 */
const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error(`AsyncStorage Error: ${error.message}`);
    return null;
  }
};

/**
 * Removes data from AsyncStorage.
 * @param key The key under which the value is stored that should be removed.
 */
const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`AsyncStorage Error: ${error.message}`);
  }
};

export { storeData, getData, removeData };
