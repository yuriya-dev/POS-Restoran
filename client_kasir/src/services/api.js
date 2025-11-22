import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', 
});

export const api = {
  login: (credentials) => API.post('/auth/login', credentials),
  
  // Menu & Order
  getCategories: () => API.get('/categories'),
  getMenuItems: () => API.get('/menu-items'),
  getTables: () => API.get('/tables'),
  createOrder: (data) => API.post('/orders', data),
  
  // Shift
  getShiftActive: (userId) => API.get(`/shifts/active/${userId}`),
  getShiftSummary: () => API.get('/shifts/summary'),
  startShift: (data) => API.post('/shifts/start', data),
  endShift: (data) => API.post('/shifts/end', data),
};