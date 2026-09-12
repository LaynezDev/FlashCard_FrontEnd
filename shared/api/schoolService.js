import api from "./axiosService";

/**
 * Obtiene todos los grados del centro educativo del usuario.
 * @returns {Promise<Array>} Lista de grados con id_grado y nombre_grado
 */
export const getGrades = async () => {
    const response = await api.get("/school/grades");
    return response.data;
};

/**
 * Crea un nuevo grado en el centro educativo.
 * @param {string} nombre_grado - Nombre del grado (ej: "1ro Primaria")
 * @returns {Promise<object>} Grado creado
 */
export const createGrade = async (nombre_grado) => {
    const response = await api.post("/school/grades", { nombre_grado });
    return response.data;
};

/**
 * Obtiene las secciones de un grado específico.
 * @param {number} gradeId - ID del grado
 * @returns {Promise<Array>} Lista de secciones
 */
export const getSections = async (gradeId) => {
    const response = await api.get(`/school/grades/${gradeId}/sections`);
    return response.data;
};

/**
 * Crea una nueva sección dentro de un grado.
 * @param {string} nombre_seccion - Nombre de la sección (ej: "A", "Matutina")
 * @param {number} id_grado - ID del grado al que pertenece
 * @returns {Promise<object>} Sección creada
 */
export const createSection = async (nombre_seccion, id_grado) => {
    const response = await api.post("/school/sections", { nombre_seccion, id_grado });
    return response.data;
};
