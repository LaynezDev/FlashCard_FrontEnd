import api from './axiosService';

export const getDeckProgress = async (deckId) => {
    // GET /api/v1/progress/:deckId/stats
    const response = await api.get(`/progress/${deckId}/stats`);
    return response.data;
};

// ...
export const getTeacherReport = async (courseId, deckId) => {
    const response = await api.get(`/progress/report/${courseId}/${deckId}`);
    return response.data; // Retorna { deck_info: {}, students: [] }
};