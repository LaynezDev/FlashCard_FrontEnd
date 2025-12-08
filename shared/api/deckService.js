import api from './axiosService';

export const getAvailableDecks = () => {
  return api.get('/decks'); // GET /api/v1/decks
};

export const startStudySession = (deckId) => {
  return api.get(`/decks/${deckId}/study`); // GET /api/v1/decks/:deckId/study
};

export const registerCardReview = (cardId, confidence) => {
  return api.post(`/progress/flashcards/${cardId}/review`, { confianza: confidence }); // POST /api/v1/flashcards/:cardId/review
};
// Obtener todos los decks disponibles para el usuario
export const getDecks = async () => {
    try {
        // Llama a GET /api/v1/decks
        const response = await api.get('/decks');
        return response.data; 
    } catch (error) {
        console.error("Error obteniendo decks:", error);
        throw error;
    }
};
// (Preparando el terreno para el futuro) Obtener tarjetas para estudiar
export const getCardsForStudy = async (deckId) => {
    try {
        const response = await api.get(`/decks/${deckId}/cards`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo tarjetas:", error);
        throw error;
    }
};

// Crear un nuevo deck
export const createDeck = async (deckData) => {
    console.log("Creando deck con datos:", deckData);
    const response = await api.post('/decks', deckData);
    return response.data;
};
// Eliminar un deck
export const deleteDeck = async (deckId) => {
    await api.delete(`/decks/${deckId}`);
};

// Obtener lista plana de tarjetas para el editor
export const getDeckEditorData = async (deckId) => {
    const response = await api.get(`/decks/${deckId}/editor`);
    return response.data; // { cards: [...] }
};
// Crear una nueva tarjeta en un deck
export const createFlashcard = async (deckId, cardData) => {
    const response = await api.post(`/decks/${deckId}/cards`, cardData);
    return response.data;
};
// Eliminar una tarjeta específica
export const deleteFlashcard = async (cardId) => {
    await api.delete(`/decks/cards/${cardId}`);
};