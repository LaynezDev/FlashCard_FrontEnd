import { useState, useEffect } from 'react';
import { getCardsForStudy, registerCardReview } from '../api/deckService';

/**
 * Hook personalizado para gestionar una sesión de estudio de flashcards.
 * Maneja la carga de tarjetas, navegación, volteo y calificación.
 * @param {number} deckId - ID del deck a estudiar
 * @returns {{
 *   currentCard: object,
 *   totalCards: number,
 *   progress: number,
 *   isFlipped: boolean,
 *   loading: boolean,
 *   isFinished: boolean,
 *   flipCard: Function,
 *   rateCard: Function
 * }}
 */
export const useStudySession = (deckId) => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

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

    /**
     * Voltea la tarjeta actual para mostrar la respuesta.
     */
    const flipCard = () => setIsFlipped(true);

    /**
     * Califica la tarjeta actual con un nivel de confianza y avanza a la siguiente.
     * @param {number} confidence - Nivel de dominio del 1 al 5
     */
    const rateCard = async (confidence) => {
        const currentCard = cards[currentIndex];
        
        registerCardReview(currentCard.id_flashcard, confidence).catch(console.error);

        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
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
