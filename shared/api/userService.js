import api from './axiosService';

export const getStudents = async () => {
    const response = await api.get('/users/students');
    return response.data;
};

export const createStudent = async (studentData) => {
    const response = await api.post('/users/students', studentData);
    return response.data;
};