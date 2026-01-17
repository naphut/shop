# 🚀 Neon PostgreSQL Setup for Master Shirt Shop

## 📋 Prerequisites
1. **Neon Account**: Free PostgreSQL database at https://neon.tech
2. **Connection String**: `postgresql://neondb_owner:npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

## 🔧 Quick Setup

### 1. Create Neon Project
```bash
# Install Neon CLI
npm i -g @neondatabase/serverless

# Login to Neon
neonctl auth

# Create new project
neonctl projects create master-shirt-shop

# Get connection string
neonctl connection-string master-shirt-shop
```

### 2. Setup Backend Files
```bash
# Copy Neon backend files
cp -r backend_neon/* /path/to/your/backend/

# Create .env file
echo "DB_HOST=ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech" > .env
echo "DB_NAME=neondb" >> .env
echo "DB_USER=neondb_owner" >> .env
echo "DB_PASS=npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech" >> .env
echo "DB_PORT=5432" >> .env
echo "DB_SSL=require" >> .env
echo "JWT_SECRET=your_secure_jwt_secret" >> .env
```

### 3. Import Database Schema
```bash
# Connect to Neon and create tables
psql "postgresql://neondb_owner:npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" < create_tables.sql

# Insert sample data
psql "postgresql://neondb_owner:npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" < sample_data.sql
```

### 4. Start Backend
```bash
# Start PHP server
php -S localhost:8001

# Test API
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@master.com","password":"admin123"}' \
  http://localhost:8001/login
```

## 📊 Database Schema

### Tables Created
- **users**: User management with roles
- **categories**: Product categories
- **products**: Product catalog with foreign keys
- **orders**: Order tracking and management
- **order_items**: Order line items

### Sample Data
- **Admin User**: admin@master.com / admin123
- **Categories**: Men, Women, Kids, Custom
- **Products**: Sample t-shirts with pricing

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: BCrypt for password security
- **CORS Headers**: Cross-origin request support
- **Input Validation**: Sanitized user inputs
- **SQL Injection Prevention**: Prepared statements

## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /admin/login` - Admin authentication
- `GET /auth/me` - Get current user (JWT protected)

### Products
- `GET /products` - List all products
- `GET /categories` - List all categories

### Admin Panel
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/orders` - Manage orders
- `GET /admin/products` - Product management
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

## 🚀 Deployment

### Local Development
```bash
php -S localhost:8001
```

### Production Hosting
- **Neon**: Database hosted on Neon infrastructure
- **Shared Hosting**: Upload backend files to any PHP host
- **VPS**: Deploy with Docker or direct deployment

## 📱 Frontend Integration

Update your React app to use the Neon backend:
```typescript
const API_BASE = 'https://your-domain.com/api';

export const apiService = {
    login: (credentials) => api.post(`${API_BASE}/auth/login`, credentials),
    register: (data) => api.post(`${API_BASE}/auth/register`, data),
    getMe: () => api.get(`${API_BASE}/auth/me`),
    getProducts: () => api.get(`${API_BASE}/products`),
    // ... other endpoints
};
```

## 🎉 Benefits of Neon

- ✅ **Free Tier**: Generous free tier for development
- ✅ **Serverless**: No server management required
- ✅ **Automatic Backups**: Built-in backup system
- ✅ **High Performance**: PostgreSQL on modern infrastructure
- ✅ **Easy Scaling**: Pay-as-you-grow pricing
- ✅ **Global CDN**: Fast data access worldwide

Your Master Shirt Shop is ready for Neon PostgreSQL deployment! 🚀
