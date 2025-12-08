// shared/api/authService.js

import api from './axiosService'; // La instancia de Axios configurada

/**
 * Llama a la API de login y devuelve el token.
 */
export const login = async (email, password) => {
    // POST /api/v1/auth/login
    const response = await api.post('/auth/login', { email, password });
    return response.data.token; // Devolvemos el JWT
};

/**
 * Llama a la API de registro y devuelve el token.
 */
export const register = async (userData) => {
    // POST /api/v1/auth/register
    const response = await api.post('/auth/register', userData);
    return response.data.token; // Devolvemos el JWT
};