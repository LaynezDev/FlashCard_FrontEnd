import api from './axiosService';

export const getMyCourses = async () => {
    const response = await api.get('/courses');
    return response.data;
};

export const getDecksByCourse = async (courseId) => {
    const response = await api.get(`/courses/${courseId}/decks`);
    return response.data;
};
// ... imports
export const createCourse = async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
};

export const deleteCourse = async (courseId) => {
    await api.delete(`/courses/${courseId}`);
};
export const enrollStudentInCourse = async (studentId, courseId) => {
    // POST /api/v1/courses/enroll
    const response = await api.post('/courses/enroll', { studentId, courseId });
    return response.data;
};