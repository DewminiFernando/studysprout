// ─── API service placeholder ───
// This file will later connect to the FastAPI backend.
// For now, all data comes from demoData.js.

import axios from 'axios';

// Base URL — connected to our FastAPI backend
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor for JWT token ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Authentication API endpoints ──
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};


export const materialAPI = {
  uploadPDF: (formData) => api.post('/materials/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMaterials: () => api.get('/materials'),
  getMaterialById: (id) => api.get(`/materials/${id}`),
  deleteMaterial: (id) => api.delete(`/materials/${id}`),
};

export const materialsAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return materialAPI.uploadPDF(formData);
  },
  getAll: () => materialAPI.getMaterials(),
  getById: (id) => materialAPI.getMaterialById(id),
  delete: (id) => materialAPI.deleteMaterial(id),
};

export const quizAPI = {
  getQuestions: (materialId) => api.get(`/quiz/${materialId}/questions`),
  submitAnswer: (questionId, answer) =>
    api.post(`/quiz/${questionId}/answer`, { answer }),
  getResults: (quizId) => api.get(`/quiz/${quizId}/results`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getWeakTopics: () => api.get('/analytics/weak-topics'),
};

export default api;
