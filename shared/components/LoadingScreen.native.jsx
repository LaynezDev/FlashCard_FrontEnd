import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// O usa Galio: import { Block, Text } from 'galio-framework';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.text}>⏳ Cargando sesión...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        color: '#333'
    }
});

export default LoadingScreen;