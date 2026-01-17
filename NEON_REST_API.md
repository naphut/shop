# 🚀 Neon REST API Setup Guide

## 📋 Prerequisites
1. **Neon Account**: Free account at https://neon.tech
2. **API Key**: Get your API key from Neon dashboard
3. **REST API**: Neon provides PostgreSQL REST API

## 🔧 Configuration

### Get Your Neon API Key
1. Login to Neon dashboard: https://neon.tech
2. Go to Project Settings
3. Generate API key
4. Copy the API key

### Update Configuration
Edit `backend_neon_rest/config.php`:
```php
define('NEON_API_KEY', 'your_actual_api_key_here');
```

## 📁 Files Created

### Backend Structure
```
backend_neon_rest/
├── index.php          # Main API router
├── config.php         # Neon configuration
├── JWT.php            # JWT authentication
├── .htaccess          # Apache configuration
```

## 🔐 API Endpoints

### Authentication
- `POST /login` - User authentication
- `POST /register` - User registration
- `POST /admin/login` - Admin authentication
- `GET /me` - Get current user (JWT protected)

### Data Management
- `GET /products` - Get all products
- `GET /categories` - Get all categories
- `GET /users?role=user` - Get all users
- `GET /orders` - Get all orders

### Admin Features
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/orders` - Manage all orders
- `GET /admin/products` - Product management
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

## 🌐 API Usage Examples

### Login Request
```javascript
const response = await fetch('http://localhost:8001/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'admin@master.com',
        password: 'admin123'
    })
});

const result = await response.json();
```

### Get Products
```javascript
const response = await fetch('http://localhost:8001/products', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
});

const products = await response.json();
```

## 🚀 Quick Start

```bash
# Start backend
cd backend_neon_rest
php -S localhost:8001

# Test API
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@master.com","password":"admin123"}' \
  http://localhost:8001/login
```

## 📊 Benefits of Neon REST API

✅ **Serverless**: No server management required
✅ **Auto-scaling**: Pay-as-you-grow pricing
✅ **Built-in Backups**: Automatic daily backups
✅ **High Performance**: PostgreSQL on modern infrastructure
✅ **Global CDN**: Fast data access worldwide
✅ **Free Tier**: Generous free tier for development

## 🔒 Security Notes

- Keep your API key secure and never commit to version control
- Use environment variables for sensitive data
- Implement rate limiting in production
- Use HTTPS in production

Your Neon REST API backend is now ready! 🎉
