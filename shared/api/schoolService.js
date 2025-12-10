import api from "./axiosService";

export const getGrades = async () => {
    const response = await api.get("/school/grades");
    return response.data;
};

export const createGrade = async (nombre_grado) => {
    const response = await api.post("/school/grades", { nombre_grado });
    return response.data;
};

export const getSections = async (gradeId) => {
    const response = await api.get(`/school/grades/${gradeId}/sections`);
    return response.data;
};

export const createSection = async (nombre_seccion, id_grado) => {
    const response = await api.post("/school/sections", { nombre_seccion, id_grado });
    return response.data;
};
