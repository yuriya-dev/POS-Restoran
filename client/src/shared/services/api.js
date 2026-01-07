import axios from 'axios';
import { cacheService, CACHE_TTL } from './cacheService';
import { requestDeduplicator } from './requestDeduplicator';

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

/**
 * Wrapper untuk GET requests dengan caching otomatis
 */
const cachedGet = async (url, cacheKey, ttl = CACHE_TTL.CATEGORIES) => {
  // 1. Cek cache terlebih dahulu
  const cached = cacheService.get(cacheKey);
  if (cached) return { data: cached };

  // 2. Deduplicate requests - jika ada request yang sama sedang berjalan, tunggu hasilnya
  return requestDeduplicator.deduplicate(cacheKey, async () => {
    const response = await API.get(url);
    cacheService.set(cacheKey, response.data, ttl);
    return response;
  });
};

export const api = {
  // Auth (tanpa cache - sensitive data)
  login: (credentials) => API.post('/auth/login', credentials),
  register: (data) => API.post('/auth/register', data),

  // Categories (cache 5 menit)
  getCategories: () => cachedGet('/categories', 'cache:categories', CACHE_TTL.CATEGORIES),
  createCategory: (data) => API.post('/categories', data).then(res => {
    cacheService.invalidate('cache:categories');
    return res;
  }),
  updateCategory: (id, data) => API.put(`/categories/${id}`, data).then(res => {
    cacheService.invalidate('cache:categories');
    return res;
  }),
  deleteCategory: (id) => API.delete(`/categories/${id}`).then(res => {
    cacheService.invalidate('cache:categories');
    return res;
  }),

  // Menu Items (cache 5 menit)
  getMenuItems: () => cachedGet('/menu-items', 'cache:menuItems', CACHE_TTL.MENU_ITEMS),
  createMenuItem: (data) => API.post('/menu-items', data).then(res => {
    cacheService.invalidatePattern('cache:menu.*');
    return res;
  }),
  updateMenuItem: (id, data) => API.put(`/menu-items/${id}`, data).then(res => {
    cacheService.invalidatePattern('cache:menu.*');
    return res;
  }),
  deleteMenuItem: (id) => API.delete(`/menu-items/${id}`).then(res => {
    cacheService.invalidatePattern('cache:menu.*');
    return res;
  }),

  // Dining Tables (cache 1 menit)
  getTables: () => cachedGet('/tables', 'cache:tables', CACHE_TTL.TABLES),
  createTable: (data) => API.post('/tables', data).then(res => {
    cacheService.invalidate('cache:tables');
    return res;
  }),
  updateTable: (id, data) => API.put(`/tables/${id}`, data).then(res => {
    cacheService.invalidate('cache:tables');
    return res;
  }),
  deleteTable: (id) => API.delete(`/tables/${id}`).then(res => {
    cacheService.invalidate('cache:tables');
    return res;
  }),
  clearTable: (tableId) => API.put(`/tables/${tableId}/clear`).then(res => {
    cacheService.invalidate('cache:tables');
    return res;
  }),
  
  // Users (cache 10 menit)
  getUsers: () => cachedGet('/users', 'cache:users', CACHE_TTL.USERS),
  deleteUser: (id) => API.delete(`/users/${id}`).then(res => {
    cacheService.invalidate('cache:users');
    return res;
  }), 
  updateUser: (id, data) => API.put(`/users/${id}`, data).then(res => {
    cacheService.invalidate('cache:users');
    return res;
  }),

  // Orders & Reports (cache 30 detik)
  getOrders: () => cachedGet('/orders', 'cache:orders', CACHE_TTL.ORDERS),
  getKitchenOrders: () => cachedGet('/orders/kitchen', 'cache:kitchenOrders', CACHE_TTL.ORDERS),
  createOrder: (data) => API.post('/orders', data).then(res => {
    cacheService.invalidatePattern('cache:(orders|reports).*');
    return res;
  }),
  updateOrder: (id, data) => API.put(`/orders/${id}`, data).then(res => {
    cacheService.invalidatePattern('cache:(orders|reports).*');
    return res;
  }),
  completeOrder: (id) => API.put(`/orders/${id}/complete`).then(res => {
    cacheService.invalidatePattern('cache:(orders|reports).*');
    return res;
  }),
  cancelOrder: (id) => API.post(`/orders/${id}/cancel`).then(res => {
    cacheService.invalidatePattern('cache:(orders|reports).*');
    return res;
  }),
  getTopSellingItems: (startDate, endDate) => {
    const key = `cache:topSelling:${startDate}:${endDate}`;
    return cachedGet(`/reports/top-selling?startDate=${startDate}&endDate=${endDate}`, key, CACHE_TTL.TOP_SELLING);
  },

  // Shifts (cache 2 menit)
  getShiftActive: (userId) => cachedGet(`/shifts/active/${userId}`, `cache:shift:${userId}`, CACHE_TTL.SHIFTS),
  getShiftSummary: () => cachedGet('/shifts/summary', 'cache:shiftSummary', CACHE_TTL.SHIFTS),
  startShift: (data) => API.post('/shifts/start', data).then(res => {
    cacheService.invalidatePattern('cache:shift.*');
    return res;
  }),
  endShift: (data) => API.post('/shifts/end', data).then(res => {
    cacheService.invalidatePattern('cache:shift.*');
    return res;
  }),

  // ✅ Settings (cache 30 menit - jarang berubah)
  getSettings: () => cachedGet('/settings', 'cache:settings', CACHE_TTL.SETTINGS),
  updateSettings: (data) => API.put('/settings', data).then(res => {
    cacheService.invalidate('cache:settings');
    return res;
  }),
};