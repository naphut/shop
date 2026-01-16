# Master Shirt Shop API Documentation

## Overview
PHP-based REST API for the Master Shirt Shop e-commerce platform with JWT authentication and MySQL database.

## Setup

### Database
1. Import the `db.sql` file into your MySQL database
2. Update database credentials in `config.php`

### Default Admin
- Email: `admin@master.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info (requires auth)

### User Endpoints
- `GET /api/user/profile` - Get user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)
- `GET /api/user/orders` - Get user orders (requires auth)
- `POST /api/user/orders` - Create new order (requires auth)

### Public Endpoints
- `GET /api/products` - Get all active products
- `GET /api/categories` - Get all categories

### Admin Endpoints (requires admin role)
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders` - Update order status
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products` - Update product
- `DELETE /api/admin/products` - Delete product
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories` - Update category
- `DELETE /api/admin/categories` - Delete category

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Order Creation Example
```json
POST /api/user/orders
{
  "total_amount": 99.99,
  "address": "123 Main St, City, State",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price_at_time": 49.99,
      "selected_size": "L",
      "selected_color": "Blue"
    }
  ]
}
```

## Product Management Example
```json
POST /api/admin/products
{
  "name": {"en": "Premium T-Shirt", "es": "Camiseta Premium"},
  "description": {"en": "High quality cotton t-shirt", "es": "Camiseta de algodón de alta calidad"},
  "price": 29.99,
  "typical_price": 39.99,
  "category_id": 1,
  "brand": "MasterBrand",
  "stock": 100,
  "image_url": "https://example.com/image.jpg",
  "material": "100% Cotton",
  "is_active": true,
  "is_best_seller": false,
  "is_new_arrival": true
}
```
