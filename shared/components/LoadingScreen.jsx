import React from 'react';

const LoadingScreen = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            {/* Puedes poner un spinner CSS aquí si quieres */}
            <h2 style={{ color: '#4CAF50' }}>⏳ Cargando sesión...</h2>
        </div>
    );
};

export default LoadingScreen;