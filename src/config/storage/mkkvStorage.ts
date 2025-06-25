/* eslint-disable no-console */
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

// Define keys for the values you want to store
const KEYS = {
  REFRESH_TOKEN: "refresh_token",
  TOKEN: "user_token",
};

export const MMKVStorage = {
  /**
   * Save a value with a specific key in MMKV
   */
  saveValue(key: string, value: boolean | number | string) {
    try {
      storage.set(key, value);
    } catch (error) {
      console.error(`MMKVStorage saveValue error (${key}):`, error);
    }
  },

  /**
   * Retrieve a value by key from MMKV
   */
  getValue(key: string): boolean | null | number | string {
    try {
      return storage.getString(key) || storage.getNumber(key) || storage.getBoolean(key) || null;
    } catch (error) {
      console.error(`MMKVStorage getValue error (${key}):`, error);
      return null;
    }
  },

  /**
   * Remove a value by key from MMKV
   */
  removeValue(key: string) {
    try {
      storage.delete(key);
    } catch (error) {
      console.error(`MMKVStorage removeValue error (${key}):`, error);
    }
  },

  /**
   * Check if a key exists in MMKV
   */
  hasKey(key: string): boolean {
    return storage.contains(key);
  },

  /**
   * Clear all values stored in MMKV (Use with caution)
   */
  clearAll() {
    try {
      storage.clearAll();
    } catch (error) {
      console.error("MMKVStorage clearAll error:", error);
    }
  },

  KEYS, // Export KEYS for easier usage
};
