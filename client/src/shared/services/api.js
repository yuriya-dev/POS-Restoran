import axios from 'axios';

// ✅ LOGIKA DINAMIS:
// 1. Jika di Vercel (Production), dia pakai VITE_API_URL dari Settings Vercel (https://...)
// 2. Jika di Laptop (Local), dia pakai VITE_API_URL dari file .env (http://...)
// 3. Jika tidak ada .env, fallback ke http://localhost:5001/api

const API = axios.create({
  baseURL: 'https://pos-restoran.onrender.com/api', 
});

// ✅ TAMBAHAN PENTING: Request Interceptor
// Ini otomatis mengambil ID user dari localStorage dan mengirimnya ke server
// Server butuh ini untuk fitur "Tracking Update" di Settings
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user'); // Sesuaikan key dengan AuthContext ('user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && user.userId) {
        // Kirim custom header x-user-id
        config.headers['x-user-id'] = user.userId;
      }
    } catch (error) {
      console.error("Gagal parsing user data untuk header", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor (Log error global)
API.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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
  clearTable: (tableId) => API.put(`/tables/${tableId}/clear`),
  
  // Users (Employees)
  getUsers: () => API.get('/users'),
  deleteUser: (id) => API.delete(`/users/${id}`), 
  updateUser: (id, data) => API.put(`/users/${id}`, data),

  // Orders & Reports
  getOrders: () => API.get('/orders'),
  getKitchenOrders: () => API.get('/orders/kitchen'),
  createOrder: (data) => API.post('/orders', data),
  updateOrder: (id, data) => API.put(`/orders/${id}`, data),
  completeOrder: (id) => API.put(`/orders/${id}/complete`),
  cancelOrder: (id) => API.post(`/orders/${id}/cancel`),
  getTopSellingItems: (startDate, endDate) => 
    API.get('/reports/top-selling', { params: { startDate, endDate } }),

  // Shifts
  getShiftActive: (userId) => API.get(`/shifts/active/${userId}`),
  getShiftSummary: () => API.get('/shifts/summary'),
  startShift: (data) => API.post('/shifts/start', data),
  endShift: (data) => API.post('/shifts/end', data),

  // ✅ Settings
  getSettings: () => API.get('/settings'),
  updateSettings: (data) => API.put('/settings', data),
};