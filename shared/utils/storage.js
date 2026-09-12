// shared/utils/storage.js

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/**
 * Obtiene el motor de almacenamiento según el entorno.
 * En web: usa localStorage nativo.
 * En móvil: usa @react-native-async-storage/async-storage.
 * @returns {{ getItem: Function, setItem: Function, removeItem: Function }}
 */
const getStorage = () => {
    if (isWeb) {
        return {
            getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
            setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
            removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
        };
    } else {
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

/**
 * Obtiene un valor del almacenamiento por su clave.
 * @param {string} key - Clave del elemento a obtener
 * @returns {Promise<string|null>} Valor almacenado o null
 */
export const getItem = async (key) => await storage.getItem(key);

/**
 * Guarda un valor en el almacenamiento.
 * @param {string} key - Clave del elemento
 * @param {string} value - Valor a almacenar
 * @returns {Promise<void>}
 */
export const setItem = async (key, value) => await storage.setItem(key, value);

/**
 * Elimina un elemento del almacenamiento.
 * @param {string} key - Clave del elemento a eliminar
 * @returns {Promise<void>}
 */
export const removeItem = async (key) => await storage.removeItem(key);
