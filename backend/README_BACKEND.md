# Master Shirt Shop Backend

## Overview
PHP-based REST API for the Master Shirt Shop e-commerce platform.

## Setup

### Database Setup
1. Start XAMPP MySQL service
2. Import `db.sql` into phpMyAdmin
3. Update `.env` with database credentials

### Start Server
```bash
php -S localhost:8001
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### User Endpoints
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/orders` - Get user orders
- `POST /user/orders` - Create new order

### Public Endpoints
- `GET /products` - Get all active products
- `GET /categories` - Get all categories

### Admin Endpoints
- `GET /admin/dashboard` - Get dashboard stats
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders` - Update order status
- `GET /admin/products` - Get all products
- `POST /admin/products` - Create product
- `PUT /admin/products` - Update product
- `DELETE /admin/products` - Delete product
- `GET /admin/categories` - Get all categories
- `POST /admin/categories` - Create category
- `PUT /admin/categories` - Update category
- `DELETE /admin/categories` - Delete category

## Default Admin
- Email: `admin@master.com`
- Password: `admin123`
