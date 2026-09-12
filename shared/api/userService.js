import api from './axiosService';

/**
 * Obtiene todos los alumnos del mismo centro educativo.
 * @returns {Promise<Array>} Lista de alumnos con id_usuario, nombre y email
 */
export const getStudents = async () => {
    const response = await api.get('/users/students');
    return response.data;
};

/**
 * Crea un nuevo alumno en el centro educativo.
 * @param {object} studentData - Datos del alumno (nombre, email, password)
 * @returns {Promise<object>} Alumno creado
 */
export const createStudent = async (studentData) => {
    const response = await api.post('/users/students', studentData);
    return response.data;
};

/**
 * Actualiza la contraseña de un alumno específico.
 * @param {number} studentId - ID del alumno
 * @param {string} password - Nueva contraseña
 * @returns {Promise<object>} Confirmación de actualización
 */
export const updateStudentPassword = async (studentId, password) => {
    const response = await api.put(`/users/students/${studentId}/password`, { password });
    return response.data;
};

/**
 * Obtiene todos los profesores del mismo centro educativo.
 * @returns {Promise<Array>} Lista de profesores con id_usuario, nombre y email
 */
export const getTeachers = async () => {
    const response = await api.get('/users/teachers');
    return response.data;
};

/**
 * Crea un nuevo profesor en el centro educativo.
 * @param {object} teacherData - Datos del profesor (nombre, email, password)
 * @returns {Promise<object>} Profesor creado
 */
export const createTeacher = async (teacherData) => {
    const response = await api.post('/users/teachers', teacherData);
    return response.data;
};
