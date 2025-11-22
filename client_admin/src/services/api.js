// src/services/api.js
import axios from 'axios';

// Ganti URL sesuai port server Express Anda
const API = axios.create({
  baseURL: 'http://localhost:5001/api', 
});

// Interceptor (Opsional: Untuk debugging)
API.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// --- Endpoints Definition ---
export const api = {
  // Auth
  login: (credentials) => API.post('/auth/login', credentials),
  register: (data) => API.post('/auth/register', data),

  // Categories
  getCategories: () => API.get('/categories'),
  createCategory: (data) => API.post('/categories', data),
  updateCategory: (id, data) => API.put(`/categories/${id}`, data),
  deleteCategory: (id) => API.delete(`/categories/${id}`),

  // Menu Items
  getMenuItems: () => API.get('/menu-items'),
  createMenuItem: (data) => API.post('/menu-items', data),
  updateMenuItem: (id, data) => API.put(`/menu-items/${id}`, data),
  deleteMenuItem: (id) => API.delete(`/menu-items/${id}`),

  // Dining Tables
  getTables: () => API.get('/tables'),
  createTable: (data) => API.post('/tables', data),
  updateTable: (id, data) => API.put(`/tables/${id}`, data),
  deleteTable: (id) => API.delete(`/tables/${id}`),
  
  // Users
  getUsers: () => API.get('/users'),
  deleteUser: (id) => API.delete(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),

  // Orders
  getOrders: () => API.get('/orders'),

  // Reports
  getTopSellingItems: (startDate, endDate) => 
    API.get('/reports/top-selling', { params: { startDate, endDate } }),

  // --- Settings ---
  getSettings: () => API.get('/settings'),
  updateSettings: (data) => API.put('/settings', data),
};