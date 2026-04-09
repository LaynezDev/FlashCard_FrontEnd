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

    // --- Comparador Universal (Dictado y Traducción) ---
    const checkAnswer = () => {
        // Si es traducción, comparamos con la RESPUESTA. Si es dictado, con la PREGUNTA.
        const targetText = currentCard.tipo === 'traduccion' ? currentCard.respuesta : currentCard.pregunta;

        const original = targetText.toLowerCase().trim().split(/\s+/);
        const typed = userText.toLowerCase().trim().split(/\s+/);
        
        const resultParts = typed.map((word, i) => ({
            text: word,
            correct: word === original[i]
        }));

        const matches = resultParts.filter(p => p.correct).length;
        const score = Math.round((matches / original.length) * 100);
        
        setComparison({ score, parts: resultParts });
    };

    const handleNext = async (level) => {
        await saveProgress(currentCard.id_flashcard, level);
        setComparison(null);
        setUserText('');
        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert("¡Mazo completado!");
            navigate('/dashboard');
        }
    };

    if (!currentCard) return <p>Cargando...</p>;

    return (
        <div style={styles.container}>
            <div style={{...styles.card, transform: isFlipped ? 'rotateY(0deg)' : 'none'}}>
                {!isFlipped ? (
                    <div style={styles.face}>
                        {/* CATEGORÍA IMAGEN */}
                        {currentCard.tipo === 'imagen' && (
                            <img crossorigin="anonymous" 
                            // src={currentCard.imagen_url} 
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
                                <button onClick={checkAnswer} style={styles.checkBtn}>Validar</button>
                                
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
                        {/* CATEGORÍA TRADUCCIÓN */}
                        {currentCard.tipo === 'traduccion' && (
                            <div style={styles.dictadoContainer}>
                                <h2 style={{ color: '#555', marginBottom: '20px' }}>
                                    Traducción: "{currentCard.pregunta}"
                                </h2>
                                
                                <input 
                                    style={styles.input}
                                    value={userText}
                                    onChange={(e) => setUserText(e.target.value)}
                                    placeholder="Escribe la traducción aquí..."
                                />
                                
                                {/* Usamos la misma función universal */}
                                <button onClick={checkAnswer} style={styles.checkBtn}>Verificar</button>
                                
                                {comparison && (
                                    <div style={styles.feedback}>
                                        {comparison.parts.map((p, i) => (
                                            <span key={i} style={{ color: p.correct ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
                                                {p.text} 
                                            </span>
                                        ))}
                                        <p style={{fontWeight: 'bold'}}>Precisión: {comparison.score}%</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* TEXTO NORMAL */}
                        {currentCard.tipo === 'texto' && <h2>{currentCard.pregunta}</h2>}
                        
                        <button onClick={() => setIsFlipped(true)} style={styles.flipBtn}>VOLTEAR</button>
                    </div>
                ) : (
                    <div >
                        <h2>Respuesta:</h2>
                        <p>{currentCard.respuesta}</p>
                        <div style={styles.btnRow}>
                            <button onClick={() => handleNext(1)} style={{backgroundColor: '#F44336'}}>Mal</button>
                            <button onClick={() => handleNext(3)} style={{backgroundColor: '#FF9800'}}>Regular</button>
                            <button onClick={() => handleNext(5)} style={{backgroundColor: '#4CAF50'}}>Bien</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', padding: 20 },
    card: { width: 400, minHeight: 500, background: 'white', borderRadius: 15, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', padding: 20, textAlign: 'center' },
    image: { width: '100%', borderRadius: 10, marginBottom: 15 },
    input: { width: '80%', padding: 10, margin: '10px 0', borderRadius: 5, border: '1px solid #ccc' },
    audioBtn: { padding: 10, borderRadius: 50, cursor: 'pointer', border: 'none', background: '#e3f2fd' },
    checkBtn: { padding: '10px 20px', background: COLORS.PRIMARY, color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' },
    flipBtn: { marginTop: 20, padding: 10, width: '100%', background: '#eee', border: 'none', borderRadius: 5, cursor: 'pointer' },
    btnRow: { display: 'flex', gap: 10, marginTop: 20, justifyContent: 'center' }
};

export default StudyScreen;