// React Fetch Examples for Master Shirt Shop API

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

// USER LOGIN EXAMPLE
async function loginUser(email, password) {
    try {
        const result = await apiCall('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (result.success) {
            // Store token and user data
            localStorage.setItem('ms-token', result.token);
            localStorage.setItem('ms-user', JSON.stringify(result.user));
            console.log('User login successful:', result.user);
            return result;
        }
    } catch (error) {
        console.error('User login failed:', error.message);
        alert(error.message);
        throw error;
    }
}

// ADMIN LOGIN EXAMPLE
async function loginAdmin(email, password) {
    try {
        const result = await apiCall('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (result.success) {
            // Store token and user data
            localStorage.setItem('ms-token', result.token);
            localStorage.setItem('ms-user', JSON.stringify(result.user));
            console.log('Admin login successful:', result.user);
            return result;
        }
    } catch (error) {
        console.error('Admin login failed:', error.message);
        alert(error.message);
        throw error;
    }
}

// USER REGISTER EXAMPLE
async function registerUser(name, email, password) {
    try {
        const result = await apiCall('/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        if (result.success) {
            console.log('Registration successful:', result.message);
            // Optionally auto-login after registration
            return result;
        }
    } catch (error) {
        console.error('Registration failed:', error.message);
        alert(error.message);
        throw error;
    }
}

// PROTECTED ROUTE EXAMPLE (requires JWT)
async function getCurrentUser() {
    try {
        const result = await apiCall('/me', {
            method: 'GET'
        });

        if (result.success) {
            console.log('Current user:', result.user);
            return result.user;
        }
    } catch (error) {
        console.error('Failed to get current user:', error.message);
        // Handle unauthorized - redirect to login
        if (error.message.includes('Unauthorized')) {
            localStorage.removeItem('ms-token');
            localStorage.removeItem('ms-user');
            window.location.href = '/login';
        }
        return null;
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

// USAGE EXAMPLES:

// 1. User Login:
// loginUser('user@example.com', 'password123')
//   .then(result => console.log('Logged in as user'))
//   .catch(err => console.error('Login failed'));

// 2. Admin Login:
// loginAdmin('admin@master.com', 'admin123')
//   .then(result => console.log('Logged in as admin'))
//   .catch(err => console.error('Admin login failed'));

// 3. Register User:
// registerUser('John Doe', 'john@example.com', 'password123')
//   .then(result => console.log('Registered'))
//   .catch(err => console.error('Registration failed'));

// 4. Get Current User (protected route):
// getCurrentUser()
//   .then(user => console.log('Current user:', user))
//   .catch(err => console.error('Failed to get user'));

// 5. Get Products:
// getProducts()
//   .then(products => console.log('Products:', products))
//   .catch(err => console.error('Failed to load products'));

export {
    apiCall,
    loginUser,
    loginAdmin,
    registerUser,
    getCurrentUser,
    getProducts
};
