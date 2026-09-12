import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { AuthProvider } from '@shared/context/AuthContext'; 
import App from './App';
import RootNavigator from '@shared/components/RootNavigator';

/**
 * Punto de entrada de la aplicación web (React 18).
 * Renderiza el árbol de componentes con React.StrictMode para detectar problemas.
 * Envuelve la app con AuthProvider para gestión de autenticación global.
 */

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  </React.StrictMode>
);