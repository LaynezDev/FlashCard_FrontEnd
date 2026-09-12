import React from 'react';
import { AuthProvider } from '@shared/context/AuthContext';
import RootNavigator from '@shared/components/RootNavigator';

/**
 * Componente raíz de la aplicación web.
 * Envuelve toda la app con AuthProvider para gestionar el estado de autenticación
 * y RootNavigator para manejar las rutas.
 * @returns {JSX.Element} Árbol de componentes de la aplicación
 */
function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

export default App;
