import api from './axiosService';

export const getStudents = async () => {
    const response = await api.get('/users/students');
    return response.data;
};

export const createStudent = async (studentData) => {
    const response = await api.post('/users/students', studentData);
    return response.data;
};

export const updateStudentPassword = async (studentId, password) => {
    // Hacemos una petición PUT a un endpoint específico para cambiar la contraseña
    const response = await api.put(`/users/students/${studentId}/password`, { password });
    return response.data;
};

// ... 
export const getTeachers = async () => {
    const response = await api.get('/users/teachers');
    return response.data;
};

export const createTeacher = async (teacherData) => {
    const response = await api.post('/users/teachers', teacherData);
    return response.data;
};