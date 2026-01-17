# 🚀 Frontend + API Integration Guide

## 📋 Prerequisites

### Backend Running
✅ **API Server**: `http://localhost:8000` - Running
✅ **Database**: MySQL with sample data
✅ **Authentication**: JWT tokens working

### Frontend Setup
```bash
# Install dependencies
npm install axios

# Start React development server
npm start
```

## 🔌 API Integration

### 1. Install API Service
Copy `frontend_api_integration.js` to your React project:
```bash
cp frontend_api_integration.js src/services/apiService.js
```

### 2. Update React Components

#### Login Component
```jsx
import { apiService } from '../services/apiService';

const Login = () => {
  const handleLogin = async (credentials) => {
    try {
      const result = await apiService.login(credentials);
      if (result.success) {
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Login form */}
    </form>
  );
};
```

#### Products Component
```jsx
import { apiService } from '../services/apiService';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await apiService.getProducts();
        setProducts(result.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name_json?.en || product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};
```

#### Admin Dashboard
```jsx
import { apiService } from '../services/apiService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await apiService.getAdminDashboard();
        setStats(result.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {stats && (
        <div>
          <p>Revenue: ${stats.revenue}</p>
          <p>Orders: {stats.orders}</p>
          <p>Users: {stats.users}</p>
        </div>
      )}
    </div>
  );
};
```

## 🧪 Testing Integration

### 1. Test API Connection
```javascript
// In browser console
fetch('http://localhost:8000/products')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. Test Authentication
```javascript
// Login test
fetch('http://localhost:8000/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@master.com',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## 🔧 Environment Configuration

### Development (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

### Production (.env.production)
```
REACT_APP_API_URL=https://your-domain.com/api
```

## 📱 Complete Flow

### 1. User Registration
```
React Form → POST /register → API → MySQL → Response
```

### 2. User Login
```
React Login → POST /login → API → MySQL → JWT Token → Local Storage
```

### 3. Product Display
```
React Component → GET /products → API → MySQL → JSON → React UI
```

### 4. Admin Operations
```
React Admin → GET /admin/dashboard → API JWT → MySQL → JSON → React Charts
```

## 🎯 Current Status

✅ **Backend API**: Running on `http://localhost:8000`
✅ **Authentication**: JWT tokens working
✅ **Database**: MySQL with sample data
✅ **CORS**: Enabled for cross-origin requests
✅ **Endpoints**: All CRUD operations available

## 🚀 Next Steps

1. **Integrate API service** into your React components
2. **Update environment variables** for API URL
3. **Test authentication flow** in your React app
4. **Implement error handling** for API calls
5. **Add loading states** for better UX

**Your Master Shirt Shop is ready for full-stack development!** 🎉
