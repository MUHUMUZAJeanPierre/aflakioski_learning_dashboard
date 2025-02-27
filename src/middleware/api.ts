import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const courseApi = {
  getCourses: () => api.get('/course'),
  getCourseById: (id) => api.get(`/course/${id}`),
  enrollCourse: (userId,courseId) => api.post(`/enroll/${userId}/${courseId}`),
  getModules: (courseId) => api.get(`/course/${courseId}/modules`),
  getAllCourseModules: (courseId) => api.get(`/coursemodules/${courseId}`),
  getModuleById: (moduleId) => api.get(`/modules/${moduleId}`),
  getLessons: (moduleId) => api.get(`/modules/${moduleId}/lessons`),
  submitQuiz: (moduleId, answers) => 
    api.post(`/modules/${moduleId}/quiz/submit`, { answers }),
  updateProgress: (courseId, moduleId, lessonId) =>
    api.post(`/course/${courseId}/progress`, { moduleId, lessonId }),
  fetchSubmoduleDetails: (submoduleId) => api.get(`/submodules/${submoduleId}`),
  updateSubmodule: (id, formData) => 
    api.put(`/v1/submodules/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateCourse: (id, formData) => 
    api.put(`/course/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateQuiz: (moduleId, quizData) => 
    api.put(`/modules/${moduleId}/quiz`, quizData, {
      headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateModule: (moduleId, formData) => 
    api.put(`/modules/${moduleId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }



export const authApi = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  verifyEmail: (token) => api.post(`/auth/verify/${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => 
    api.post(`/auth/reset-password/${token}`, { password })
}