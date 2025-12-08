import React from 'react';
import { useAuth } from '../context/AuthContext'; 
// 🚨 Importar los componentes sin extensión. El bundler elige .jsx o .native.jsx
import LoginScreen from './LoginScreen'; 
import MainAppStack from './MainAppStack'; 
import LoadingScreen from './LoadingScreen'; // 👈 Ahora importamos esto
// Importamos View/Text directamente desde react-native para esta pantalla simple 
// o bien, usamos componentes abstractos, pero para el RootNavigator, es común usar RN básico.
// Si esto falla en web, debes mover LoadingScreen a un archivo separado.


const RootNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // 1. Estado de Carga: Delegamos al componente LoadingScreen
    if (isLoading) {
        return <LoadingScreen />;
    }

    // 2. Estado Autenticado: Delegamos a MainAppStack
    if (isAuthenticated) {
        return <MainAppStack />;
    }

    // 3. Estado No Autenticado: Delegamos a LoginScreen
    return <LoginScreen />;
};

export default RootNavigator;