// ========================================
// 💾 ASYNC STORAGE UTILITIES
// Helper functions untuk menyimpan dan mengambil data
// ========================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
  IS_LOGGED_IN: '@is_logged_in',
};

// ========================================
// TOKEN MANAGEMENT
// ========================================

/**
 * Simpan authentication token
 * @param {string} token - Firebase auth token
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    return { success: true };
  } catch (error) {
    console.error('Error saving token:', error);
    return { success: false, error };
  }
};

/**
 * Ambil authentication token
 * @returns {Promise<string|null>} token atau null
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Hapus authentication token
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    return { success: true };
  } catch (error) {
    console.error('Error removing token:', error);
    return { success: false, error };
  }
};

// ========================================
// USER DATA MANAGEMENT
// ========================================

/**
 * Simpan user data
 * @param {object} userData - Data user (email, nama, dll)
 */
export const saveUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
    return { success: true };
  } catch (error) {
    console.error('Error saving user data:', error);
    return { success: false, error };
  }
};

/**
 * Ambil user data
 * @returns {Promise<object|null>} user data atau null
 */
export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Hapus user data
 */
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    return { success: true };
  } catch (error) {
    console.error('Error removing user data:', error);
    return { success: false, error };
  }
};

// ========================================
// LOGIN STATUS MANAGEMENT
// ========================================

/**
 * Set login status
 * @param {boolean} status - true jika login, false jika logout
 */
export const setLoginStatus = async (status) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, status.toString());
    return { success: true };
  } catch (error) {
    console.error('Error setting login status:', error);
    return { success: false, error };
  }
};

/**
 * Check apakah user sudah login
 * @returns {Promise<boolean>} true jika sudah login
 */
export const isLoggedIn = async () => {
  try {
    const status = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return status === 'true';
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// ========================================
// CLEAR ALL DATA (untuk logout)
// ========================================

/**
 * Hapus semua data auth dari AsyncStorage
 */
export const clearAllAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.IS_LOGGED_IN,
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return { success: false, error };
  }
};
