import api from './axiosService';

/**
 * Obtiene todos los decks disponibles para el usuario actual.
 * @returns {Promise<Array>} Lista de decks con id_deck, nombre_deck y descripcion
 */
export const getAvailableDecks = () => {
  return api.get('/decks');
};

/**
 * Inicia una sesión de estudio cargando las flashcards de un deck.
 * @param {number} deckId - ID del deck a estudiar
 * @returns {Promise<Array>} Lista de flashcards ordenadas por prioridad de estudio
 */
export const startStudySession = (deckId) => {
  return api.get(`/decks/${deckId}/study`);
};

/**
 * Registra el resultado de una revisión de flashcard.
 * @param {number} cardId - ID de la flashcard revisada
 * @param {number} confidence - Nivel de dominio del 1 al 5
 * @returns {Promise<object>} Respuesta del servidor con next_review_in_days
 */
export const registerCardReview = (cardId, confidence) => {
  return api.post(`/progress/flashcards/${cardId}/review`, { confianza: confidence });
};

/**
 * Obtiene todos los decks disponibles para el usuario (versión async).
 * @returns {Promise<Array>} Lista de decks disponibles
 */
export const getDecks = async () => {
    try {
        const response = await api.get('/decks');
        return response.data; 
    } catch (error) {
        console.error("Error obteniendo decks:", error);
        throw error;
    }
};

/**
 * Obtiene las flashcards de un deck específico.
 * @param {number} deckId - ID del deck
 * @returns {Promise<Array>} Lista de flashcards del deck
 */
export const getCardsForStudy = async (deckId) => {
    try {
        const response = await api.get(`/decks/${deckId}/cards`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo tarjetas:", error);
        throw error;
    }
};

/**
 * Crea un nuevo deck de flashcards.
 * @param {object} deckData - Datos del deck (nombre_deck, descripcion, id_curso, publico)
 * @returns {Promise<object>} Deck creado con todos sus campos
 */
export const createDeck = async (deckData) => {
    console.log("Creando deck con datos:", deckData);
    const response = await api.post('/decks', deckData);
    return response.data;
};

/**
 * Elimina un deck y todas sus flashcards asociadas.
 * @param {number} deckId - ID del deck a eliminar
 * @returns {Promise<void>}
 */
export const deleteDeck = async (deckId) => {
    await api.delete(`/decks/${deckId}`);
};

/**
 * Obtiene los datos de un deck para el editor (todas sus flashcards).
 * @param {number} deckId - ID del deck
 * @returns {Promise<object>} { cards: Array } con la lista de flashcards
 */
export const getDeckEditorData = async (deckId) => {
    const response = await api.get(`/decks/${deckId}/editor`);
    return response.data;
};

/**
 * Crea una nueva flashcard en un deck.
 * @param {number} deckId - ID del deck padre
 * @param {object} cardData - Datos de la flashcard (pregunta, respuesta, tipo)
 * @returns {Promise<object>} Flashcard creada
 */
export const createFlashcard = async (deckId, cardData) => {
    const response = await api.post(`/decks/${deckId}/cards`, cardData);
    return response.data;
};

/**
 * Elimina una flashcard específica por su ID.
 * @param {number} cardId - ID de la flashcard a eliminar
 * @returns {Promise<void>}
 */
export const deleteFlashcard = async (cardId) => {
    await api.delete(`/decks/cards/${cardId}`);
};
