// shared/utils/storage.js (CÓDIGO HÍBRIDO DEFINITIVO)

// Detectamos si estamos en un entorno donde window no existe (React Native)
const isMobile = typeof window === 'undefined' || (typeof navigator !== 'undefined' && navigator.product === 'ReactNative');

let AsyncStorage;

if (isMobile) {
    // Importación dinámica (require) para que la Web no explote al leer esto
    try {
        AsyncStorage = require('@react-native-async-storage/async-storage').default;
    } catch (e) {
        console.error("AsyncStorage no encontrado. Instálalo en mobile-app.");
    }
}

export const getItem = async (key) => {
    if (isMobile) {
        return await AsyncStorage.getItem(key);
    } else {
        // Web: chequeo seguro
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(key);
        }
        return null;
    }
};

export const setItem = async (key, value) => {
    if (isMobile) {
        await AsyncStorage.setItem(key, value);
    } else {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, value);
        }
    }
};

export const removeItem = async (key) => {
    if (isMobile) {
        await AsyncStorage.removeItem(key);
    } else {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(key);
        }
    }
};