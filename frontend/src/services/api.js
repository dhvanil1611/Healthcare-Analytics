import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth APIs
export const authAPI = {
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  login: (email, password) => axios.post(`${API_BASE_URL}/auth/login`, { email, password }),
  getProfile: () => axios.get(`${API_BASE_URL}/auth/profile`, { headers: getAuthHeader() }),
  updateProfile: (data) => axios.put(`${API_BASE_URL}/auth/profile`, data, { headers: getAuthHeader() }),
};

// Prediction APIs
export const predictionAPI = {
  assess: (data) => axios.post(`${API_BASE_URL}/predictions/assess`, data, { headers: getAuthHeader() }),
  getHistory: () => axios.get(`${API_BASE_URL}/predictions/history`, { headers: getAuthHeader() }),
  getById: (id) => axios.get(`${API_BASE_URL}/predictions/${id}`, { headers: getAuthHeader() }),
};

// Health Metrics APIs
export const healthAPI = {
  getMetrics: () => axios.get(`${API_BASE_URL}/health/metrics`, { headers: getAuthHeader() }),
  createMetric: (data) => axios.post(`${API_BASE_URL}/health/metrics`, data, { headers: getAuthHeader() }),
};

// Reports APIs
export const reportAPI = {
  upload: (formData) => axios.post(`${API_BASE_URL}/reports/upload`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
  }),
  getReports: () => axios.get(`${API_BASE_URL}/reports`, { headers: getAuthHeader() }),
  deleteReport: (id) => axios.delete(`${API_BASE_URL}/reports/${id}`, { headers: getAuthHeader() }),
};

// Appointment APIs
export const appointmentAPI = {
  create: (data) => axios.post(`${API_BASE_URL}/appointments`, data, { headers: getAuthHeader() }),
  getAppointments: () => axios.get(`${API_BASE_URL}/appointments`, { headers: getAuthHeader() }),
  cancel: (id) => axios.delete(`${API_BASE_URL}/appointments/${id}`, { headers: getAuthHeader() }),
};

// Chatbot APIs
export const chatbotAPI = {
  sendMessage: (message) => axios.post(`${API_BASE_URL}/chatbot/message`, { message }, { headers: getAuthHeader() }),
};

export default {
  authAPI,
  predictionAPI,
  healthAPI,
  reportAPI,
  appointmentAPI,
  chatbotAPI,
};
