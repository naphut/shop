# E-Commerce Setup Guide

## Quick Start

1. **Database Setup**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Backend Configuration**
   - Edit `backend/config/Database.php` with your database credentials
   - Change JWT secret in `backend/config/Config.php`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Default Login Credentials

**Admin:**
- Email: admin@ecommerce.com
- Password: password

**Users:**
- Email: john@example.com
- Password: password
- Email: jane@example.com
- Password: password

## Important Security Notes

⚠️ **CHANGE THESE IN PRODUCTION:**
- JWT secret key in `backend/config/Config.php`
- Database credentials in `backend/config/Database.php`
- Default user passwords
- CORS origin setting

## API Base URL

Frontend is configured to proxy to `http://localhost:8000` - ensure your backend is running on this port or update the proxy setting in `frontend/package.json`.
