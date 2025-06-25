/* eslint-disable no-console */
import * as Keychain from 'react-native-keychain';

export const SecureCredentials = {
  async getCredentials(): Promise<null | string> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('SecureStorage getToken error:', error);
      return null;
    }
  },

  async removeCredentials() {
    try {
      await Keychain.resetGenericPassword();
    } catch (error) {
      console.error('SecureStorage removeToken error:', error);
    }
  },
  async saveCredentials(username: string, password: string) {
    try {
      // Save in Keychain (encrypted storage)
      await Keychain.setGenericPassword(username, password);
      // Save in MMKV (for fast access)
    } catch (error) {
      console.error('SecureStorage saveToken error:', error);
    }
  },
};
