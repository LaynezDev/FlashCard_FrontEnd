import React from 'react';

// 🛑 CAMBIO 1: Importar 'createRoot' desde 'react-dom/client'
import { createRoot } from 'react-dom/client'; 

// Importación existente del AuthProvider compartido
import { AuthProvider } from '@shared/context/AuthContext'; 

import App from './App'; // O el componente principal de tu web
import RootNavigator from '@shared/components/RootNavigator'; // Nuevo componente raíz

// ----------------------------------------------------
// Código anterior (React 17) que genera el error:
/*
import ReactDOM from 'react-dom';
ReactDOM.render(
  <React.StrictMode><App /></React.StrictMode>,
  document.getElementById('root')
);
*/
// ----------------------------------------------------

// 🚀 CÓDIGO NUEVO (React 18)

// 1. Encontrar el elemento raíz del DOM
const container = document.getElementById('root');

// 2. Crear la raíz
const root = createRoot(container); 

// 3. Renderizar el componente principal
root.render(
  <React.StrictMode>
    {/* Asegúrate de que AuthProvider esté accesible por la ruta corregida/alias */}
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  </React.StrictMode>
);