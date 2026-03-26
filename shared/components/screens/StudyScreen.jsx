import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlashcardsByDeck } from '../../api/courseService';
import { saveProgress } from '../../api/progressService';
import { COLORS } from '../../constants/theme';
import api from '../../api/axiosService';

const StudyScreen = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showBackContent, setShowBackContent] = useState(false);
    
    // Estados para el Dictado
    const [userText, setUserText] = useState('');
    const [comparison, setComparison] = useState(null);

    useEffect(() => {
        getFlashcardsByDeck(deckId).then(setCards);
    }, [deckId]);

    const currentCard = cards[currentIndex];

    // --- Lógica de Voz (Web) ---
    const handleSpeak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Cambiar según el curso
        window.speechSynthesis.speak(utterance);
    };

    // --- Comparador de Dictado ---
    const checkDictado = () => {
        const original = currentCard.pregunta.toLowerCase().trim();
        const typed = userText.toLowerCase().trim();
        
        const wordsOrig = original.split(/\s+/);
        const wordsTyped = typed.split(/\s+/);
        
        const resultParts = wordsTyped.map((word, i) => ({
            text: word,
            correct: word === wordsOrig[i]
        }));

        const matches = resultParts.filter(p => p.correct).length;
        const score = Math.round((matches / wordsOrig.length) * 100);
        
        setComparison({ score, parts: resultParts });
    };

    const handleFlip = () => {
        setIsFlipped(true);
    };

    const handleTransitionEnd = () => {
        if (isFlipped) {
            setShowBackContent(true);
        }
    };

    const handleNext = async (level) => {
        await saveProgress(currentCard.id_flashcard, level);
        
        // Resetear estados para la siguiente tarjeta
        setIsFlipped(false);
        setShowBackContent(false);
        setComparison(null);
        setUserText('');

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert("¡Mazo completado!");
            navigate('/');
        }
    };

    if (!currentCard) return <p>Cargando...</p>;

    return (
        <div style={styles.scene}>
            <div 
                style={{...styles.card, transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}
                onTransitionEnd={handleTransitionEnd}
            >
                {/* CARA FRONTAL */}
                <div style={styles.faceFront}>
                    <div style={styles.faceContent}>
                        {/* CATEGORÍA IMAGEN */}
                        {currentCard.tipo === 'imagen' && (
                            <img crossorigin="anonymous" 
                            src={`${api.defaults.baseURL.replace('/api/v1', '')}${currentCard.imagen_url}`} 
                            style={styles.image} alt="pregunta" />
                        )}
                        
                        {/* CATEGORÍA NARRADO (DICTADO) */}
                        {currentCard.tipo === 'narrado' && (
                            <div style={styles.dictadoContainer}>
                                <button onClick={() => handleSpeak(currentCard.pregunta)} style={styles.audioBtn}>🔊 Escuchar</button>
                                <input 
                                    style={styles.input}
                                    value={userText}
                                    onChange={(e) => setUserText(e.target.value)}
                                    placeholder="Escribe lo que escuchas..."
                                />
                                <button onClick={checkDictado} style={styles.checkBtn}>Validar</button>
                                
                                {comparison && (
                                    <div style={styles.feedback}>
                                        {comparison.parts.map((p, i) => (
                                            <span key={i} style={{ color: p.correct ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
                                                {p.text} 
                                            </span>
                                        ))}
                                        <p style={{fontWeight: 'bold'}}>Puntaje: {comparison.score}%</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TEXTO NORMAL */}
                        {currentCard.tipo === 'texto' && <h2 style={styles.questionText}>{currentCard.pregunta}</h2>}
                    </div>
                    <button onClick={handleFlip} style={styles.flipBtn}>VOLTEAR</button>
                </div>

                {/* CARA TRASERA */}
                <div style={styles.faceBack}>
                    {showBackContent && (
                        <>
                            <div style={styles.faceContent}>
                                <h2 style={{ color: COLORS.SECONDARY }}>Respuesta:</h2>
                                <p style={styles.answerText}>{currentCard.respuesta}</p>
                            </div>
                            <div style={styles.ratingContainer}>
                                <p style={styles.ratingLabel}>¿Qué tal lo sabías?</p>
                                <div style={styles.btnRow}>
                                    {[1, 2, 3, 4, 5].map(level => (
                                        <button key={level} onClick={() => handleNext(level)} style={{...styles.ratingBtn, ...styles[`ratingBtn${level}`]}}>{level}</button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', padding: 20 },
    scene: {
        width: 450,
        height: 550,
        margin: '20px auto',
        perspective: '1200px',
    },
    card: {
        width: '100%',
        height: '100%',
        position: 'relative',
        transition: 'transform 0.8s',
        transformStyle: 'preserve-3d',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        borderRadius: 15,
    },
    faceFront: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backfaceVisibility: 'hidden',
        borderRadius: 15,
        background: 'white',
        padding: 25,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    faceBack: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backfaceVisibility: 'hidden',
        borderRadius: 15,
        background: 'white',
        padding: 25,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        transform: 'rotateY(180deg)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    faceContent: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
    },
    questionText: { fontSize: '1.8rem', color: COLORS.TEXT, fontWeight: '600' },
    answerText: { fontSize: '1.5rem', color: '#555', marginTop: 10 },
    image: { width: '100%', borderRadius: 10, marginBottom: 15 },
    input: { width: '80%', padding: 10, margin: '10px 0', borderRadius: 5, border: '1px solid #ccc' },
    audioBtn: { padding: 10, borderRadius: 50, cursor: 'pointer', border: 'none', background: '#e3f2fd' },
    checkBtn: { padding: '10px 20px', background: COLORS.PRIMARY, color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' },
    flipBtn: { marginTop: 'auto', paddingTop: 15, paddingBottom: 15, width: '100%', background: '#f0f0f0', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: '#555' },
    ratingContainer: { width: '100%', marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #eee' },
    ratingLabel: { margin: 0, color: '#777', fontWeight: 'bold' },
    btnRow: { display: 'flex', gap: 10, marginTop: 10, justifyContent: 'center' },
    ratingBtn: { width: 50, height: 50, borderRadius: '50%', border: 'none', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' },
    ratingBtn1: { backgroundColor: '#d32f2f' },
    ratingBtn2: { backgroundColor: '#f57c00' },
    ratingBtn3: { backgroundColor: '#fbc02d', color: '#333' },
    ratingBtn4: { backgroundColor: '#7cb342' },
    ratingBtn5: { backgroundColor: '#43a047' },
};

export default StudyScreen;