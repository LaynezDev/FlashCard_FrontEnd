import api from './axiosService';

export const getDeckProgress = async (deckId) => {
    // GET /api/v1/progress/:deckId/stats
    const response = await api.get(`/progress/${deckId}/stats`);
    return response.data;
};