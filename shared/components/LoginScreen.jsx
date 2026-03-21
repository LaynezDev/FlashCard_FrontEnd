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
        <>
            <style>{`
                /* Reset básico y fondo de galaxia */
                // .modern-login-wrapper {
                //     min-height: 100vh;
                //     display: flex;
                //     justify-content: center;
                //     align-items: center;
                //     background: url('https://images.unsplash.com/photo-1534796636912-36528976b533?q=80&w=1920&auto=format&fit=crop') no-repeat center center/cover;
                //     font-family: 'Inter', 'Segoe UI', sans-serif;
                //     padding: 20px;
                // }
                .modern-login-wrapper {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #020024;
                    background: linear-gradient(45deg,rgba(2, 0, 36, 1) 0%, rgba(0, 212, 255, 1) 70%, rgba(255, 255, 255, 1) 100%);
                    padding: 20px;
                }

                /* Tarjeta Glassmorphism */
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 20px;
                    padding: 40px;
                    width: 100%;
                    max-width: 420px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.5);
                    color: #fff;
                }

                .glass-card h2 {
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 2.2rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                }

                /* Inputs */
                .input-group {
                    position: relative;
                    margin-bottom: 25px;
                }
                .input-group input {
                    width: 100%;
                    padding: 15px 45px 15px 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid transparent;
                    border-radius: 30px;
                    outline: none;
                    color: #fff;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
                    box-sizing: border-box;
                }
                .input-group input::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }
                .input-group input:focus {
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1), inset 0 2px 5px rgba(0,0,0,0.2);
                }
                .input-icon {
                    position: absolute;
                    right: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.7);
                    pointer-events: none;
                }

                /* Opciones: Remember / Forget */
                .options-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    font-size: 0.9rem;
                }
                .options-row label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    color: rgba(255, 255, 255, 0.8);
                }
                .options-row input[type="checkbox"] {
                    margin-right: 8px;
                    cursor: pointer;
                }
                .options-row a, .register-text a {
                    color: #fff;
                    text-decoration: none;
                    transition: text-shadow 0.3s;
                }
                .options-row a:hover, .register-text a:hover {
                    text-decoration: underline;
                    text-shadow: 0 0 8px rgba(255,255,255,0.6);
                }

                /* Botón principal */
                .login-btn {
                    width: 100%;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 30px;
                    color: #0b192c; /* Azul oscuro elegante para contraste */
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }
                .login-btn:hover {
                    background: #fff;
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
                    transform: translateY(-2px);
                }
                .login-btn:active {
                    transform: translateY(0);
                }
                .login-btn:disabled {
                    background: rgba(255,255,255,0.5);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                /* Mensaje Error y Registro */
                .register-text {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.8);
                }
                .error-msg {
                    color: #ff5252;
                    background: rgba(255,82,82,0.15);
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                    border: 1px solid rgba(255,82,82,0.3);
                }
            `}</style>

            <div className="modern-login-wrapper">
                <div className="glass-card">
                    <h2>Inicio de sesion</h2>
                    
                    {error && <div className="error-msg">{error}</div>}
                    
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Usuario / Correo" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        {/* Icono de Usuario (SVG Inline) */}
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        {/* Icono de Candado (SVG Inline) */}
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>

                    {/* <div className="options-row">
                        <label>
                            <input type="checkbox" /> Remember Me
                        </label>
                        <a href="#forgot">Forget Password?</a>
                    </div> */}
                    
                    <button 
                        className="login-btn" 
                        onClick={handleLogin} 
                        disabled={loading}
                    >
                        {loading ? 'Accediendo...' : 'Acceder'}
                    </button>
                    
                    <div className="register-text">
                        Don't have an account? <a href="#register">Register</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginScreen;