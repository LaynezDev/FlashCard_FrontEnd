// shared/utils/storage.js

// 1. Detectar entorno de forma infalible
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/**
 * Esta función obtiene el motor de almacenamiento de forma dinámica
 * para evitar que Webpack intente resolver dependencias nativas en la Web.
 */
const getStorage = () => {
    if (isWeb) {
        return {
            getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
            setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
            removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
        };
    } else {
        // En Móvil, requerimos la librería. 
        // El 'require' dentro de una función evita que Webpack Web lo procese agresivamente.
        try {
            return require('@react-native-async-storage/async-storage').default;
        } catch (error) {
            console.warn("AsyncStorage no está disponible en este entorno.");
            return {
                getItem: () => Promise.resolve(null),
                setItem: () => Promise.resolve(),
                removeItem: () => Promise.resolve(),
            };
        }
    }
};

const storage = getStorage();

export const getItem = async (key) => await storage.getItem(key);
export const setItem = async (key, value) => await storage.setItem(key, value);
export const removeItem = async (key) => await storage.removeItem(key);