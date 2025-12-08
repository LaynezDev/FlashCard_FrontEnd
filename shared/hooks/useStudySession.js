import { useState, useEffect } from 'react';
import { getCardsForStudy, registerCardReview } from '../api/deckService';

export const useStudySession = (deckId) => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    // Cargar tarjetas al iniciar
    useEffect(() => {
        const loadCards = async () => {
            try {
                const data = await getCardsForStudy(deckId);
                if (data.length === 0) setIsFinished(true);
                setCards(data);
            } catch (error) {
                console.error("Error cargando sesión:", error);
            } finally {
                setLoading(false);
            }
        };
        if (deckId) loadCards();
    }, [deckId]);

    // Voltear tarjeta
    const flipCard = () => setIsFlipped(true);

    // Calificar y pasar a la siguiente
    const rateCard = async (confidence) => {
        const currentCard = cards[currentIndex];
        
        // 1. Enviar dato a la API (sin esperar para que la UI sea rápida)
        registerCardReview(currentCard.id_flashcard, confidence).catch(console.error);

        // 2. Avanzar
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true); // Se acabaron las tarjetas del lote
        }
    };

    return {
        currentCard: cards[currentIndex],
        totalCards: cards.length,
        progress: currentIndex + 1,
        isFlipped,
        loading,
        isFinished,
        flipCard,
        rateCard
    };
};