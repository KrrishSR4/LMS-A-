/**
 * Session-like storage using AsyncStorage.
 * - Persists data while app is open
 * - Clears automatically when app reloads (simulate session)
 * - Called on app mount to reset storage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * Clear all LMS data - simulates session end.
 * Call this when app mounts to start fresh session.
 */
export const clearSession = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
  } catch (e) {
    console.warn('Storage clear failed:', e);
  }
};

/**
 * Get item from storage (returns parsed JSON or null).
 */
export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.warn('Storage get failed:', key, e);
    return null;
  }
};

/**
 * Set item in storage (stringifies objects).
 */
export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage set failed:', key, e);
  }
};
