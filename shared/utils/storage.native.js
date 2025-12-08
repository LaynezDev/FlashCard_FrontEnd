// shared/utils/storage.native.js

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        console.error('Error getting item from AsyncStorage', e);
        return null;
    }
};

export const setItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error('Error setting item in AsyncStorage', e);
    }
};

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error('Error removing item from AsyncStorage', e);
    }
};