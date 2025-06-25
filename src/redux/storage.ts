import { MMKV } from "react-native-mmkv";

// Create an instance of MMKV storage
export const mmkvStorage = new MMKV();

// MMKV Adapter for redux-persist
export const reduxStorage = {
  getItem: (key: string) => {
    const value = mmkvStorage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string) => {
    mmkvStorage.delete(key);
    return Promise.resolve();
  },
  setItem: (key: string, value: string) => {
    mmkvStorage.set(key, value);
    return Promise.resolve(true);
  },
};