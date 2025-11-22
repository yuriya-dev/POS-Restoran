import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', 
});

export const api = {
  login: (credentials) => API.post('/auth/login', credentials),
  getTables: () => API.get('/tables'),
  // Nanti kita tambah endpoint order di sini
};