import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudySession } from '../../hooks/useStudySession';
import { COLORS } from '../../constants/theme';

const StudyScreen = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    // Extraemos rateCard pero no lo usamos directamente en el botón
    const { currentCard, isFlipped, loading, isFinished, flipCard, rateCard } = useStudySession(deckId);
    
    // Estado local para controlar la animación de salida/entrada
    const [isAnimating, setIsAnimating] = useState(false);

    // Función que orquesta la animación + cambio de datos
    const handleRate = (level) => {
        // 1. Iniciar animación de salida (Zoom Out)
        setIsAnimating(true);

        // 2. Esperar a que termine la transición CSS (300ms)
        setTimeout(() => {
            // 3. Cambiar los datos (El hook se encarga de poner isFlipped en false)
            rateCard(level);

            // 4. Iniciar animación de entrada (Zoom In) con un leve retraso
            // para asegurar que el navegador haya procesado el cambio de carta
            setTimeout(() => {
                setIsAnimating(false);
            }, 50);
        }, 300);
    };

    if (loading) return <div style={styles.loadingContainer}><h2>⏳ Cargando sesión...</h2></div>;

    if (isFinished) {
        return (
            <div style={styles.finishedContainer}>
                <h1 style={{ color: COLORS.PRIMARY }}>🎉 ¡Sesión Completada!</h1>
                <p style={{ color: COLORS.MUTED }}>Has repasado todas las tarjetas de esta sesión.</p>
                <button 
                    onClick={() => navigate('/')}
                    style={styles.primaryButton}
                >
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div style={styles.pageContainer}>
            {/* Contenedor de la Escena 3D */}
            <div style={styles.scene}>
                <div 
                    style={{
                        ...styles.cardObject,
                        // COMBINAMOS LAS TRANSFORMACIONES:
                        // 1. Rotación (Flip): Depende de si está volteada
                        // 2. Escala (Zoom): Depende de si está animando el cambio
                        transform: `
                            ${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'} 
                            scale(${isAnimating ? 0.8 : 1}) 
                        `,
                        // También animamos la opacidad para que se desvanezca
                        opacity: isAnimating ? 0 : 1,
                    }}
                    onClick={(!isFlipped && !isAnimating) ? flipCard : undefined}
                >
                    {/* --- CARA FRONTAL (PREGUNTA) --- */}
                    <div style={{ ...styles.cardFace, ...styles.cardFront }}>
                        <span style={styles.label}>PREGUNTA</span>
                        <h2 style={styles.cardText}>{currentCard.pregunta}</h2>
                        <span style={styles.tapHint}>Haz clic para voltear</span>
                    </div>

                    {/* --- CARA TRASERA (RESPUESTA) --- */}
                    <div style={{ ...styles.cardFace, ...styles.cardBack }}>
                        <span style={{ ...styles.label, color: '#fff', opacity: 0.8 }}>RESPUESTA</span>
                        <h2 style={{ ...styles.cardText, color: 'white' }}>{currentCard.respuesta}</h2>
                    </div>
                </div>
            </div>

            {/* CONTROLES */}
            <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isFlipped && !isAnimating ? (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <p style={{ color: COLORS.MUTED, marginBottom: '10px' }}>¿Qué tan bien lo sabías?</p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    // Usamos nuestro manejador con animación
                                    onClick={() => handleRate(level)}
                                    style={{
                                        ...styles.ratingButton,
                                        backgroundColor: getColorForRating(level)
                                    }}
                                    title={`Nivel ${level}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    !isAnimating && (
                        <p style={{ color: COLORS.MUTED, fontStyle: 'italic' }}>Piensa la respuesta antes de voltear...</p>
                    )
                )}
            </div>
        </div>
    );
};

// --- ESTILOS ---
const styles = {
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: COLORS.PRIMARY },
    finishedContainer: { textAlign: 'center', marginTop: '100px', animation: 'fadeIn 0.5s' },
    pageContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', justifyContent: 'center', padding: '20px' },
    
    primaryButton: {
        padding: '12px 25px', backgroundColor: COLORS.PRIMARY, color: 'white', border: 'none', borderRadius: '50px', 
        cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '20px', transition: 'transform 0.2s'
    },

    scene: {
        width: '100%',
        maxWidth: '600px',
        height: '400px',
        perspective: '1000px',
        cursor: 'pointer',
    },

    cardObject: {
        width: '100%',
        height: '100%',
        position: 'relative',
        // AJUSTE CLAVE: Agregamos 'opacity' a la transición
        transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1), opacity 0.3s ease-in-out',
        transformStyle: 'preserve-3d',
    },

    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
        boxSizing: 'border-box',
    },

    cardFront: {
        backgroundColor: COLORS.WHITE,
        border: '1px solid #eee',
    },

    cardBack: {
        backgroundColor: '#2E2E2E',
        transform: 'rotateY(180deg)',
    },

    label: { position: 'absolute', top: '25px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', color: '#999' },
    cardText: { fontSize: '32px', textAlign: 'center', margin: 0 },
    tapHint: { position: 'absolute', bottom: '25px', fontSize: '14px', color: COLORS.PRIMARY, fontWeight: 'bold' },
    ratingButton: {
        width: '50px', height: '50px', borderRadius: '50%', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px',
        cursor: 'pointer', transition: 'transform 0.2s, filter 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    }
};

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

export default StudyScreen;