# 🚀 XAMPP Setup for Master Shirt Shop

## 📋 Prerequisites
1. **XAMPP Installation**: Download and install XAMPP for your OS
2. **MySQL Module**: Ensure MySQL module is enabled in XAMPP

## 🔧 Configuration Steps

### 1. Install XAMPP
```bash
# macOS
# Download XAMPP installer
curl -s https://www.apachefriends.org/en/xampp-files/7.4/xampp-osx-installer.pkg

# Install and follow instructions
# After installation, open XAMPP Control Panel
```

### 2. Configure XAMPP
- **Apache**: Enable Apache web server
- **MySQL**: Start MySQL database service
- **PHP**: Ensure PHP is enabled

### 3. Database Setup
```bash
# Import database schema
mysql -u root -p < /path/to/your/schema.sql < ecommerce

# Create database
mysql -u root -e "CREATE DATABASE ecommerce; USE ecommerce;"

# Import sample data
mysql -u root -p < /path/to/your/data.sql < ecommerce
```

### 4. Project Setup
```bash
# Copy project to XAMPP htdocs
cp -r /path/to/master-shirt-shop /Applications/XAMPP/xamppfiles/htdocs/master-shirt-shop

# Set permissions
chmod -R 755 /Applications/XAMPP/xamppfiles/htdocs/master-shirt-shop
```

## 🗄️ XAMPP File Structure
```
/Applications/XAMPP/xamppfiles/htdocs/
├── master-shirt-shop/
│   ├── index.php          # Main API router
│   ├── config.php         # Database configuration
│   ├── JWT.php            # JWT authentication
│   ├── .htaccess          # Apache configuration
│   └── database.sqlite    # SQLite database
└── logs/                # Error logs
```

## 🔐 Start Services
```bash
# Start Apache
sudo apachectl start

# Start MySQL
sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/mysql.server start

# Start PHP-FPM
sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/php-fpm start
```

## 📋 Environment Variables
Create `.env` file in the project root:
```env
DB_HOST=localhost
DB_NAME=ecommerce
DB_USER=root
DB_PASS=
JWT_SECRET=MASTER_NODE_SECURE_99_ALPHA_V3
JWT_EXPIRY=86400
```

## 🚀 Quick Start Commands
```bash
# Start all services
sudo apachectl start && sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/mysql.server start

# Or use XAMPP Control Panel
# Open XAMPP Control Panel and start services from GUI
```

## 🔍 Troubleshooting

### Common Issues
1. **Port Conflicts**: Ensure ports 80, 3306, 4444 are available
2. **Permissions**: Fix file permissions if needed
3. **Database Connection**: Check MySQL service status
4. **Module Loading**: Enable required PHP extensions in php.ini

### 📚 Default Credentials
- **MySQL**: root (no password)
- **Admin**: admin@master.com / admin123

Your Master Shirt Shop is ready for XAMPP deployment! 🎉
