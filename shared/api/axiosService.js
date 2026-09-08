// shared/api/axiosService.js

import axios from 'axios';
// IMPORTANTE: Importamos nuestra utilidad segura, NO usamos localStorage directo
import { getItem } from '../utils/storage'; 

// URL base de tu API (Asegúrate de que para Android Emulator sea 10.0.2.2, no localhost)
// Para pruebas en celular real, usa tu IP local (ej: http://192.168.1.50:3000/api/v1)
const API_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://192.168.0.2:3000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token
axiosInstance.interceptors.request.use(
  // 1. Convertimos la función a ASYNC para poder esperar el token
  async (config) => {
    try {
        // 2. Usamos la función segura que funciona en Web y Móvil
        const token = await getItem('jwt_token'); 
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (error) {
        console.error("Error injectando token", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        const { removeItem } = await import('../utils/storage');
        await removeItem('jwt_token');
        console.warn('Sesión expirada. Por favor, inicia sesión de nuevo.');
      }

      if (status === 403) {
        console.warn('No tienes permiso para realizar esta acción.');
      }

      if (status === 500) {
        console.error('Error del servidor. Intenta de nuevo más tarde.');
      }
    } else if (error.request) {
      console.error('Error de conexión. Verifica tu conexión a internet.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;