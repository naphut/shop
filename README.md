# E-Commerce Application

A complete, production-ready e-commerce application built with React frontend and PHP backend with JWT authentication.

## Features

### User Features
- User registration and login
- Browse products with filtering by category and brand
- Product detail pages
- Shopping cart functionality

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Font Awesome** for icons
- **Axios** for API calls

### Backend
- **Native PHP 8.5** (no frameworks)
- **JWT Authentication** with secure tokens
- **SQLite Database** with sample data
- **RESTful API** with proper HTTP codes
- **CORS Enabled** for cross-origin requests

## Project Structure

```
master-shirt-shop/
├── frontend/
│   ├── index.html
│   ├── index.tsx
│   ├── App.tsx
│   ├── components/
│   ├── services/
│   └── package.json
├── backend/
│   ├── index.php
│   ├── config.php
│   ├── JWT.php
│   ├── .env
│   └── database.sqlite
├── api/
│   ├── index.php (API router)
│   ├── config.php
│   └── JWT.php
├── deployment/
│   ├── vercel.json
│   ├── netlify.toml
│   ├── docker-compose.yml
│   └── Dockerfile
└── README.md
```

## Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **PHP 8.5+** 
- **Web Server** (Apache/Nginx/XAMPP)

### Installation
```bash
# Clone repository
git clone https://github.com/naphut/websiteshop.git
cd websiteshop

# Install frontend dependencies
npm install

# Start development servers
npm run dev  # Frontend on :3000
php -S localhost:8001  # Backend API
```

### Default Credentials
- **Admin Email**: `admin@master.com`
- **Admin Password**: `admin123`

## Configuration

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_NAME=master_shirt_shop
DB_USER=root
DB_PASS=

# Security
JWT_SECRET=MASTER_NODE_SECURE_99_ALPHA_V3
JWT_EXPIRY=86400

# Server
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8001
```

3. **Build for Production**
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/products` - Get all products
- `GET /api/user/products/{id}` - Get product details
- `GET /api/user/categories` - Get categories
- `GET /api/user/brands` - Get brands
- `POST /api/user/orders` - Create order
- `GET /api/user/orders` - Get user orders

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}` - Update user status
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/{id}` - Update category
- `DELETE /api/admin/categories/{id}` - Delete category
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}` - Update order status

## Default Users

After database setup, you can login with:

**Admin User:**
- Email: admin@ecommerce.com
- Password: password

**Regular Users:**
- Email: john@example.com
- Password: password

- Email: jane@example.com
- Password: password

## Security Features

- JWT-based authentication
- Password hashing with PHP's password_hash()
- Role-based access control
- SQL injection prevention with prepared statements
- XSS prevention
- CORS configuration
- Input validation

## Customization

### Adding New Fields
1. Update the database schema
2. Modify the corresponding model
3. Update the API controller
4. Modify the frontend components

### Changing JWT Expiration
Edit `backend/config/Config.php`:
```php
const JWT_EXPIRE = 86400; // 24 hours in seconds
```

### Customizing Styling
All styles are in `frontend/src/styles/index.css`. The application uses:
- CSS Grid for layouts
- Flexbox for component alignment
- CSS custom properties for consistent theming
- Mobile-first responsive design

## Deployment

### Backend Deployment
1. Upload backend files to your server
2. Configure database connection
3. Set proper file permissions
4. Configure web server
5. Update CORS origin in production

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Upload the build folder to your web server
3. Configure your web server to serve the static files

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update `CORS_ORIGIN` in `backend/config/Config.php`
   - Ensure your frontend URL is whitelisted

2. **Database Connection Issues**
   - Check database credentials in `backend/config/Database.php`
   - Ensure MySQL server is running
   - Verify database exists

3. **JWT Token Issues**
   - Check JWT secret key configuration
   - Ensure token is not expired
   - Verify token is being sent in Authorization header

4. **404 Errors**
   - Ensure mod_rewrite is enabled (Apache)
   - Check .htaccess file configuration
   - Verify URL rewriting rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions, please open an issue on the GitHub repository.
