// mobile-app/App.js

import React from 'react';
// ... otros imports de React Native

// 🚨 CORRECCIÓN DE TIPOGRAFÍA Y RUTA RELATIVA
import { AuthProvider } from '../shared/context/AuthContext'; 
import RootNavigator from '../shared/components/RootNavigator';

// ...
const App = () => {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
};

export default App;