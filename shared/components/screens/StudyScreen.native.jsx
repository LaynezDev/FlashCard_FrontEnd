import React, { useEffect, useRef } from 'react';
import { 
    StyleSheet, 
    Animated, // Asegúrate de importar Animated
    Dimensions, 
    TouchableOpacity,
    Easing // Importamos Easing para suavizar la transición
} from 'react-native';
import { Block, Text, Button, theme } from 'galio-framework';
import { useStudySession } from '../../hooks/useStudySession';
import { COLORS } from '../../constants/theme';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

const StudyScreen = ({ route, navigation }) => {
    const { deckId } = route.params;
    // Extraemos rateCard del hook, pero NO lo usaremos directamente en los botones
    const { currentCard, isFlipped, loading, isFinished, flipCard, rateCard } = useStudySession(deckId);

    // --- ANIMACIÓN 1: ROTACIÓN (Flip) ---
    // Valor animado para la rotación (0 a 180 grados)
    const flipAnimVal = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Esta animación solo maneja el volteo inicial (Pregunta -> Respuesta)
        if (isFlipped) {
            Animated.spring(flipAnimVal, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        }
        // NOTA: Quitamos el 'else' aquí. El regreso a 0 lo manejaremos manualmente
        // en la transición para evitar el parpadeo.
    }, [isFlipped]);


    // --- ANIMACIÓN 2: TRANSICIÓN ENTRE TARJETAS (Zoom/Escala) ---
    // Valor animado para la escala (1 = visible, 0 = invisible/lejos)
    const transitionAnimVal = useRef(new Animated.Value(1)).current;

    // --- NUEVA FUNCIÓN PARA MANEJAR LA CALIFICACIÓN ---
    const handleRateCard = (confidence) => {
        // 1. Iniciar secuencia de "Salida" (Zoom Out / Desvanecer)
        Animated.timing(transitionAnimVal, {
            toValue: 0, // Reducir a tamaño 0
            duration: 250, // Rápido
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(({ finished }) => {
            // Este callback se ejecuta cuando la animación de salida termina
            if (finished) {
                // 2. MIENTRAS ESTÁ INVISIBLE:
                
                // a) Cambiar los datos a la siguiente tarjeta
                rateCard(confidence);

                // b) Reiniciar INSTANTÁNEAMENTE el giro a 0 grados (sin animación)
                // Esto asegura que cuando reaparezca, muestre el frente.
                flipAnimVal.setValue(0); 

                // 3. Iniciar secuencia de "Entrada" (Zoom In / Aparecer)
                // Un pequeño retraso ayuda a que se sienta más fluido
                setTimeout(() => {
                    Animated.spring(transitionAnimVal, {
                        toValue: 1, // Volver a tamaño normal
                        friction: 7,
                        tension: 40,
                        useNativeDriver: true,
                    }).start();
                }, 50);
            }
        });
    };


    // --- INTERPOLACIONES ---

    // 1. Interpolación de Rotación (Flip)
    const frontRotate = flipAnimVal.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backRotate = flipAnimVal.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    // 2. Interpolación de Transición (Escala y Opacidad)
    const transitionScale = transitionAnimVal; // Usamos el valor directo (0 a 1)
    const transitionOpacity = transitionAnimVal.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1] // Desvanece más rápido para ocultar el contenido
    });


    // --- ESTILOS ANIMADOS COMBINADOS ---
    
    // Estilo para el contenedor principal de la tarjeta (aplica el zoom)
    const containerAnimatedStyle = {
        transform: [{ scale: transitionScale }],
        opacity: transitionOpacity
    };

    // Estilos de las caras individuales (aplican la rotación)
    const frontAnimatedStyle = { transform: [{ rotateY: frontRotate }] };
    const backAnimatedStyle = { transform: [{ rotateY: backRotate }] };


    if (loading) {
        return <Block flex middle><Text>Cargando tarjetas...</Text></Block>;
    }

    if (isFinished) {
        return (
            <Block flex middle center style={{ padding: 20 }}>
                <Text h4 bold color={COLORS.PRIMARY} style={{ textAlign: 'center', marginBottom: 20 }}>
                    🎉 ¡Sesión Completada!
                </Text>
                <Button color={COLORS.PRIMARY} onPress={() => navigation.goBack()}>
                    Volver al Inicio
                </Button>
            </Block>
        );
    }

    return (
        <Block flex safe style={styles.container}>
            
            {/* AREA DE TARJETA (Centrada) */}
            <Block flex middle center>
                <TouchableOpacity 
                    activeOpacity={1} 
                    // Solo permitimos voltear si la tarjeta está visible y no está volteada
                    onPress={() => {
                        if (!isFlipped && transitionAnimVal._value === 1) flipCard();
                    }}
                >
                    {/* APLICAMOS LA ANIMACIÓN DE TRANSICIÓN (ZOOM) AL CONTENEDOR */}
                    <Animated.View style={[styles.cardContainer, containerAnimatedStyle]}>
                        
                        {/* --- CARA FRONTAL (PREGUNTA) --- */}
                        <Animated.View style={[styles.cardFace, styles.cardFront, frontAnimatedStyle]}>
                            <Text color={COLORS.MUTED} size={14} style={styles.label}>
                                PREGUNTA
                            </Text>
                            <Text h3 style={styles.cardText}>
                                {currentCard.pregunta}
                            </Text>
                            <Text color={COLORS.PRIMARY} size={12} style={styles.tapHint}>
                                Toca para voltear
                            </Text>
                        </Animated.View>

                        {/* --- CARA TRASERA (RESPUESTA) --- */}
                        <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
                            <Text color={COLORS.WHITE} size={14} style={styles.label}>
                                RESPUESTA
                            </Text>
                            <Text h3 color={COLORS.WHITE} style={styles.cardText}>
                                {currentCard.respuesta}
                            </Text>
                        </Animated.View>

                    </Animated.View>
                </TouchableOpacity>
            </Block>

            {/* CONTROLES (Solo visibles si está volteada) */}
            <Block style={{ height: 100, justifyContent: 'center' }}>
                {isFlipped ? (
                    <Block>
                        <Text center muted size={12} style={{ marginBottom: 10 }}>
                            ¿Qué tan bien lo sabías?
                        </Text>
                        <Block row space="evenly">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <Button
                                    key={level}
                                    round
                                    color={getColorForRating(level)}
                                    style={styles.ratingButton}
                                    // 🚨 IMPORTANTE: Usamos nuestra nueva función manejadora
                                    onPress={() => handleRateCard(level)}
                                >
                                    <Text bold size={16} color="#fff">
                                        {level}
                                    </Text>
                                </Button>
                            ))}
                        </Block>
                    </Block>
                ) : (
                    <Text center muted>Piensa la respuesta antes de voltear</Text>
                )}
            </Block>
        </Block>
    );
};

// Helpers y Styles (Sin cambios respecto a la versión anterior)
const getColorForRating = (rating) => {
    switch(rating) {
        case 1: return '#FF5252'; 
        case 2: return '#FF9800'; 
        case 3: return '#FFC107'; 
        case 4: return '#8BC34A'; 
        case 5: return '#4CAF50'; 
        default: return '#ccc';
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F4F6F8',
    },
    cardContainer: {
        width: width * 0.90,   
        height: height * 0.50, 
    },
    cardFace: {
        width: '100%',
        height: '100%',
        position: 'absolute', 
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden', 
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    cardFront: {
        backgroundColor: COLORS.WHITE,
    },
    cardBack: {
        backgroundColor: '#2E2E2E', 
        transform: [{ rotateY: '180deg' }] 
    },
    label: {
        position: 'absolute', 
        top: 20,
        letterSpacing: 1,
        fontWeight: 'bold',
        opacity: 0.7
    },
    cardText: {
        textAlign: 'center',
    },
    tapHint: {
        position: 'absolute', 
        bottom: 20
    },
    ratingButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    }
});

export default StudyScreen;