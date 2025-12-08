import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode"; // 1. IMPORTAR LIBRERÍA
import { getItem, setItem, removeItem } from '../utils/storage'; 
import { login, register } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Función auxiliar para decodificar y estructurar el usuario
    const decodeAndSetUser = (token) => {
        try {
            const decoded = jwtDecode(token);
            // El backend guarda la info dentro de "user": { user: { id_usuario... } }
            // O directamente en la raíz del payload. Depende de tu authController.
            // Asumiremos que tu backend hace: payload = { user: { ... } }
            
            const userData = decoded.user || decoded; 

            setUser({
                token,
                isAuthenticated: true,
                ...userData // Esto mezcla id_usuario, tipo_usuario, id_centro en el objeto user
            });
        } catch (error) {
            console.error("Token inválido", error);
            signOut(); // Si el token está corrupto, cerramos sesión
        }
    };

    useEffect(() => {
        const loadStoredToken = async () => {
            try {
                const storedToken = await getItem('jwt_token'); 
                if (storedToken) {
                    decodeAndSetUser(storedToken); // 2. DECODIFICAR AL CARGAR
                }
            } catch (error) {
                console.error("Error cargando token:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredToken();
    }, []);

    const signIn = async (email, password) => {
        const token = await login(email, password);
        await setItem('jwt_token', token);
        decodeAndSetUser(token); // 3. DECODIFICAR AL LOGUEARSE
    };

    const signUp = async (userData) => {
        const token = await register(userData);
        await setItem('jwt_token', token);
        decodeAndSetUser(token); // 3. DECODIFICAR AL REGISTRARSE
    };

    const signOut = async () => {
        await removeItem('jwt_token');
        setUser(null);
    };

    const contextValue = {
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};