import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import { getItem, setItem, removeItem } from '../utils/storage'; 
import { login, register } from '../api/authService';

/**
 * Contexto de autenticación de la aplicación.
 * Proporciona estado de usuario, funciones de login/logout y verificación de token.
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * @returns {{ user: object, isLoading: boolean, signIn: Function, signUp: Function, signOut: Function, isAuthenticated: boolean }}
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Proveedor de autenticación.
 * Maneja el ciclo de vida del JWT: decodificación, persistencia y expiración.
 * Carga el token almacenado al iniciar la aplicación.
 * @param {object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Decodifica un JWT y establece el estado del usuario.
     * Verifica si el token está expirado antes de establecerlo.
     * @param {string} token - JWT a decodificar
     */
    const decodeAndSetUser = (token) => {
        try {
            const decoded = jwtDecode(token);
            
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                console.warn("Token expirado");
                signOut();
                return;
            }
            
            const userData = decoded.user || decoded; 

            setUser({
                token,
                isAuthenticated: true,
                ...userData
            });
        } catch (error) {
            console.error("Token inválido", error);
            signOut();
        }
    };

    useEffect(() => {
        const loadStoredToken = async () => {
            try {
                const storedToken = await getItem('jwt_token'); 
                if (storedToken) {
                    decodeAndSetUser(storedToken);
                }
            } catch (error) {
                console.error("Error cargando token:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredToken();
    }, []);

    /**
     * Inicia sesión con email y contraseña.
     * Almacena el JWT en storage y establece el estado del usuario.
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     */
    const signIn = async (email, password) => {
        const token = await login(email, password);
        await setItem('jwt_token', token);
        decodeAndSetUser(token);
    };

    /**
     * Registra un nuevo usuario con los datos proporcionados.
     * Almacena el JWT en storage y establece el estado del usuario.
     * @param {object} userData - Datos del usuario (nombre, email, password, tipo_usuario, id_centro)
     */
    const signUp = async (userData) => {
        const token = await register(userData);
        await setItem('jwt_token', token);
        decodeAndSetUser(token);
    };

    /**
     * Cierra sesión eliminando el JWT del storage y limpiando el estado.
     */
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
