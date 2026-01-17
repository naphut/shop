// Frontend API Integration for Master Shirt Shop
import axios from 'axios';

// API Configuration
const API_BASE = 'http://localhost:8000';

// Create Axios instance
const api = axios.create({
    baseURL: '',
    headers: { 'Content-Type': 'application/json' }
});

// JWT Token Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ms-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API Service
export const apiService = {
    // Authentication
    login: async (credentials) => {
        const response = await api.post(`${API_BASE}/login`, credentials);
        if (response.data.success) {
            localStorage.setItem('ms-token', response.data.token);
            localStorage.setItem('ms-user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post(`${API_BASE}/register`, userData);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get(`${API_BASE}/me`);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('ms-token');
        localStorage.removeItem('ms-user');
    },

    // Products
    getProducts: async () => {
        const response = await api.get(`${API_BASE}/products`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get(`${API_BASE}/categories`);
        return response.data;
    },

    // Admin Dashboard
    getAdminDashboard: async () => {
        const response = await api.get(`${API_BASE}/admin/dashboard`);
        return response.data;
    },

    getAdminOrders: async () => {
        const response = await api.get(`${API_BASE}/admin/orders`);
        return response.data;
    },

    getAdminProducts: async () => {
        const response = await api.get(`${API_BASE}/admin/products`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await api.post(`${API_BASE}/admin/products`, productData);
        return response.data;
    },

    updateProduct: async (productData) => {
        const response = await api.put(`${API_BASE}/admin/products`, productData);
        return response.data;
    },

    deleteProduct: async (productId) => {
        const response = await api.delete(`${API_BASE}/admin/products`, {
            data: { id: productId }
        });
        return response.data;
    },

    // User Orders
    getUserOrders: async () => {
        const response = await api.get(`${API_BASE}/user/orders`);
        return response.data;
    },

    placeOrder: async (orderData) => {
        const response = await api.post(`${API_BASE}/user/orders`, orderData);
        return response.data;
    }
};

// React Hook for API
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (apiCall) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall();
            return result;
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { request, loading, error };
};

export default apiService;
