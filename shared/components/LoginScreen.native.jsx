import React, { useState } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native'; // Importaciones de RN
import { useAuth } from '../context/AuthContext';
// 1. IMPORTANTE: View no existe en Galio, usamos Block en su lugar.
// Galio ya tiene Input y Button pre-estilizados.
import { Block, Text, Button, Input, theme } from 'galio-framework'; 

const LoginScreen = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            // La navegación la maneja el RootNavigator automáticamente
        } catch (err) {
            console.log(err);
            setError('Credenciales inválidas o error de conexión.');
            Alert.alert('Error', 'Credenciales inválidas.'); // Alerta nativa
        } finally {
            setLoading(false);
        }
    };

    return (
        // 2. Usamos Block (de Galio) en lugar de View o Div
        // 'safe' evita el notch, 'flex' ocupa la pantalla, 'middle' centra verticalmente
        <Block safe flex middle center style={styles.container}>
            
            <Block style={styles.card}>
                <Text h4 color={theme.COLORS.PRIMARY} style={{ textAlign: 'center', marginBottom: 20 }}>
                    🔑 Iniciar Sesión
                </Text>

                {/* Mensaje de error */}
                {!!error && (
                    <Text color={theme.COLORS.DANGER} style={{ marginBottom: 10, textAlign: 'center' }}>
                        {error}
                    </Text>
                )}

                {/* 3. Usamos Input de Galio (NO <input> HTML) */}
                <Input
                    placeholder="Email"
                    type="email-address"
                    value={email}
                    onChangeText={setEmail} // En RN es onChangeText, no onChange
                    rounded
                    style={{ borderColor: theme.COLORS.PRIMARY }}
                />

                <Input
                    placeholder="Contraseña"
                    password // Propiedad de Galio para ocultar texto
                    viewPass // Icono para ver contraseña
                    value={password}
                    onChangeText={setPassword}
                    rounded
                    style={{ borderColor: theme.COLORS.PRIMARY }}
                />

                {/* 4. Usamos Button de Galio (NO <button> HTML) */}
                <Button
                    round
                    color={theme.COLORS.PRIMARY}
                    onPress={handleLogin} // En RN es onPress, no onClick
                    loading={loading}
                    disabled={loading}
                    style={{ textAlign: 'center', marginBottom: 20,width: '100rh'}}
                >ENTRARs
                </Button>

                {/* Enlace de registro simulado */}
                <TouchableOpacity onPress={() => console.log('Ir a registro')} style={{ marginTop: 20 }}>
                    <Text color={theme.COLORS.MUTED} size={14}>
                        ¿No tienes cuenta? <Text bold color={theme.COLORS.PRIMARY}>Regístrate aquí</Text>
                    </Text>
                </TouchableOpacity>
            </Block>
        </Block>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.COLORS.WHITE,
    },
    card: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        // Sombras estilo React Native (boxShadow no funciona igual)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10
    }
});

export default LoginScreen;