
import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
});

// Axios Interceptor for JWT injection
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ms-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const apiService = {
    // --- Auth Endpoints ---
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (data: any) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
    
    // --- Public Content ---
    getProducts: () => api.get('/products'),
    getCategories: () => api.get('/categories'),
    
    // --- User Features ---
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data: any) => api.put('/user/profile', data),
    getUserOrders: () => api.get('/user/orders'),
    placeOrder: (orderData: any) => api.post('/user/orders', orderData),
    
    // --- Admin Features ---
    getAdminStats: () => api.get('/admin/dashboard'),
    getAdminOrders: () => api.get('/admin/orders'),
    updateOrderStatus: (id: string, status: string) => api.put('/admin/orders', { id, status }),
    getAdminProducts: () => api.get('/admin/products'),
    createProduct: (data: any) => api.post('/admin/products', data),
    updateProduct: (id: string, data: any) => api.put('/admin/products', { ...data, id }),
    deleteProduct: (id: string) => api.delete('/admin/products', { data: { id } }),
    getAdminCategories: () => api.get('/admin/categories'),
    createCategory: (data: any) => api.post('/admin/categories', data),
    updateCategory: (id: string, data: any) => api.put('/admin/categories', { ...data, id }),
    deleteCategory: (id: string) => api.delete('/admin/categories', { data: { id } }),
};

export default apiService;
