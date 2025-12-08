// shared/components/LoginScreen.jsx (Versión SOLO WEB - NO IMPORTA GALIO)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// 🛑 LÍNEA ELIMINADA: No se importa { Text, View } de Galio aquí.

// Estilos de ejemplo para la web (Sustituyen a theme de Galio)
const WEB_STYLES = {
    PRIMARY_COLOR: '#4CAF50',
    DANGER_COLOR: '#FF5722',
    FONT_SIZE: '16px',
};


const Input = ({ placeholder, value, onChangeText, secureTextEntry }) => (
    <input 
        placeholder={placeholder} 
        value={value} 
        onChange={e => onChangeText(e.target.value)} 
        type={secureTextEntry ? 'password' : 'text'} 
        style={{ margin: '10px 0', padding: '12px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
    />
);

const Button = ({ title, onPress, disabled, color = WEB_STYLES.PRIMARY_COLOR }) => (
    <button 
        onClick={onPress} 
        disabled={disabled}
        style={{ 
            padding: '12px 20px', 
            backgroundColor: disabled ? '#ccc' : color, 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: disabled ? 'not-allowed' : 'pointer',
            width: '100%',
            fontWeight: 'bold'
        }}
    >
        {title}
    </button>
);


const LoginScreen = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (err) {
            setError('Credenciales inválidas. Por favor, revisa tu email y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // 🚨 CAMBIO: Reemplazamos <View> por <div>
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            
            {/* 🚨 CAMBIO: Reemplazamos <Text h4> por <h2> */}
            <h2 style={{ color: WEB_STYLES.PRIMARY_COLOR, textAlign: 'center', marginBottom: '20px' }}>🔑 Iniciar Sesión</h2>
            
            {/* 🚨 CORRECCIÓN: Usamos <p> para el error */}
            {error && <p style={{ color: WEB_STYLES.DANGER_COLOR, textAlign: 'center' }}>{error}</p>}
            
            <Input
                placeholder="Email de usuario/escuela"
                value={email}
                onChangeText={setEmail}
            />
            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button
                title={loading ? 'Cargando...' : 'Entrar'}
                onPress={handleLogin}
                disabled={loading}
                color={WEB_STYLES.PRIMARY_COLOR}
            />
            
            {/* 🚨 CAMBIO: Reemplazamos <Text> por <p> */}
            <p style={{ marginTop: '15px', textAlign: 'center', fontSize: WEB_STYLES.FONT_SIZE }}>
                ¿No tienes cuenta? <a href="#" style={{ color: WEB_STYLES.PRIMARY_COLOR }}>Regístrate aquí.</a>
            </p>
        </div>
    );
};

export default LoginScreen;