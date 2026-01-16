// Frontend Fetch Examples for Master Shirt Shop API

// Base API configuration
const API_BASE = '/api'; // Works with Vite proxy
// OR use direct: const API_BASE = 'http://localhost:8001';

// Universal fetch wrapper with error handling
async function apiCall(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add JWT token if available
    const token = localStorage.getItem('ms-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// LOGIN EXAMPLE
async function login(email, password) {
    try {
        const result = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (result.success) {
            // Store token and user data
            localStorage.setItem('ms-token', result.token);
            localStorage.setItem('ms-user', JSON.stringify(result.user));
            console.log('Login successful:', result.user);
            return result;
        }
    } catch (error) {
        console.error('Login failed:', error.message);
        // Show error to user
        alert(error.message);
    }
}

// REGISTER EXAMPLE
async function register(name, email, password) {
    try {
        const result = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        if (result.success) {
            console.log('Registration successful:', result.message);
            // Redirect to login or auto-login
            return result;
        }
    } catch (error) {
        console.error('Registration failed:', error.message);
        // Show error to user
        alert(error.message);
    }
}

// GET PRODUCTS EXAMPLE
async function getProducts() {
    try {
        const result = await apiCall('/products', {
            method: 'GET'
        });

        if (result.success) {
            console.log('Products loaded:', result.data);
            return result.data;
        }
    } catch (error) {
        console.error('Failed to load products:', error.message);
        return [];
    }
}

// GET CATEGORIES EXAMPLE
async function getCategories() {
    try {
        const result = await apiCall('/categories', {
            method: 'GET'
        });

        if (result.success) {
            console.log('Categories loaded:', result.data);
            return result.data;
        }
    } catch (error) {
        console.error('Failed to load categories:', error.message);
        return [];
    }
}

// ADMIN DASHBOARD EXAMPLE (requires auth)
async function getAdminDashboard() {
    try {
        const result = await apiCall('/admin/dashboard', {
            method: 'GET'
        });

        if (result.success) {
            console.log('Dashboard data:', result.data);
            return result.data;
        }
    } catch (error) {
        console.error('Failed to load dashboard:', error.message);
        // Handle unauthorized - redirect to login
        if (error.message.includes('Unauthorized')) {
            localStorage.removeItem('ms-token');
            window.location.href = '/login';
        }
        return null;
    }
}

// USAGE EXAMPLES:

// Login usage:
// login('admin@master.com', 'admin123')
//   .then(result => console.log('Logged in'))
//   .catch(err => console.error('Login failed'));

// Register usage:
// register('John Doe', 'john@example.com', 'password123')
//   .then(result => console.log('Registered'))
//   .catch(err => console.error('Registration failed'));

// Get products usage:
// getProducts()
//   .then(products => console.log('Products:', products))
//   .catch(err => console.error('Failed to load products'));

// Get categories usage:
// getCategories()
//   .then(categories => console.log('Categories:', categories))
//   .catch(err => console.error('Failed to load categories'));

// Admin dashboard usage:
// getAdminDashboard()
//   .then(data => console.log('Dashboard:', data))
//   .catch(err => console.error('Failed to load dashboard'));

export {
    apiCall,
    login,
    register,
    getProducts,
    getCategories,
    getAdminDashboard
};
