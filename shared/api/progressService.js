import api from './axiosService';

/**
 * Obtiene las estadísticas de progreso de un deck para el usuario actual.
 * @param {number} deckId - ID del deck
 * @returns {Promise<object>} { percentage: number, total_cards: number }
 */
export const getDeckProgress = async (deckId) => {
    const response = await api.get(`/progress/${deckId}/stats`);
    return response.data;
};

/**
 * Obtiene el reporte de progreso de todos los alumnos de un curso para un deck.
 * @param {number} courseId - ID del curso
 * @param {number} deckId - ID del deck
 * @returns {Promise<object>} { deck_info: { total_cards }, students: Array }
 */
export const getTeacherReport = async (courseId, deckId) => {
    const response = await api.get(`/progress/report/${courseId}/${deckId}`);
    return response.data;
};

/**
 * Registra el progreso de una flashcard revisada.
 * @param {number} flashcardId - ID de la flashcard
 * @param {number} nivelDominio - Nivel de dominio del 1 al 5
 * @returns {Promise<object>} Confirmación del progreso guardado
 */
export const saveProgress = async (flashcardId, nivelDominio) => {
    const response = await api.post('/progress/review', {
        id_flashcard: flashcardId,
        nivel_dominio: nivelDominio
    });
    return response.data;
};
