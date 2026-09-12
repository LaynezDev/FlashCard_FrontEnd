import api from './axiosService';

/**
 * Obtiene los cursos del usuario actual según su rol.
 * @returns {Promise<Array>} Lista de cursos con información del profesor
 */
export const getMyCourses = async () => {
    const response = await api.get('/courses');
    return response.data;
};

/**
 * Obtiene los decks asignados a un curso específico.
 * @param {number} courseId - ID del curso
 * @returns {Promise<Array>} Lista de decks del curso
 */
export const getDecksByCourse = async (courseId) => {
    const response = await api.get(`/courses/${courseId}/decks`);
    return response.data;
};

/**
 * Crea un nuevo curso en el centro educativo.
 * @param {object} courseData - Datos del curso (nombre_curso, descripcion, id_profesor)
 * @returns {Promise<object>} Curso creado
 */
export const createCourse = async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
};

/**
 * Elimina un curso por su ID.
 * @param {number} courseId - ID del curso a eliminar
 * @returns {Promise<void>}
 */
export const deleteCourse = async (courseId) => {
    await api.delete(`/courses/${courseId}`);
};

/**
 * Inscribe un alumno en un curso.
 * @param {number} studentId - ID del alumno
 * @param {number} courseId - ID del curso
 * @returns {Promise<object>} Confirmación de inscripción
 */
export const enrollStudentInCourse = async (studentId, courseId) => {
    const response = await api.post('/courses/enroll', { studentId, courseId });
    return response.data;
};

/**
 * Obtiene las flashcards de un deck específico.
 * @param {number} deckId - ID del deck
 * @returns {Promise<Array>} Lista de flashcards
 */
export const getFlashcardsByDeck = async (deckId) => {
    const response = await api.get(`/decks/${deckId}/cards`);
    console.log("Flashcards obtenidas:", response.data);
    return response.data;
};
