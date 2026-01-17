# 🔍 XAMPP Debug Guide - Error 230205

## ❌ Error 230205 - Access Denied

This error means MySQL is rejecting the root user login.

## 🔧 Solutions

### Solution 1: Reset MySQL Root Password
```bash
# Stop MySQL
sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/mysql.server stop

# Start MySQL in safe mode (skip grant tables)
sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/mysql.server --skip-grant-tables --skip-networking &

# Connect to MySQL (no password)
mysql -u root

# Reset password
ALTER USER 'root'@'localhost' IDENTIFIED BY '';

# Stop safe mode
sudo pkill mysqld

# Restart MySQL normally
sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/mysql.server start
```

### Solution 2: Use XAMPP Control Panel
1. Open XAMPP Control Panel
2. Go to MySQL tab
3. Click "Reset Password" button
4. Set new password (leave empty for no password)
5. Restart MySQL service

### Solution 3: Manual Configuration
```bash
# Edit MySQL config
sudo nano /Applications/XAMPP/xamppfiles/xamppfiles/etc/my.cnf

# Add this section (skip grant tables)
[mysqld]
skip-grant-tables
skip-networking
```

## 🚀 Quick Fix Commands

### Option A: Reset Root Password (Recommended)
```bash
# Stop XAMPP MySQL
sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/mysql.server stop

# Start in safe mode
sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/mysql.server --skip-grant-tables &

# Reset password (no password)
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '';"

# Kill safe mode
sudo pkill mysqld

# Restart normally
sudo /Applications/XAMPP/xamppfiles/xamppfiles/bin/mysql.server start
```

### Option B: Use XAMPP GUI
1. Open XAMPP Control Panel
2. MySQL tab → "Reset Password"
3. Leave password field empty
4. Click "Reset"
5. Restart MySQL service

## 📋 After Fix

Once password is reset, run:
```bash
# Import database (no password needed)
mysql -u root ecommerce < xampp_database.sql

# Test backend
cd backend_xampp
php -S localhost:8001

# Test API
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@master.com","password":"admin123"}' \
  http://localhost:8001/login
```

## 🔒 Security Note

For production, set a proper MySQL root password:
```bash
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_secure_password';"
```

## 📊 Expected Result
After fixing, you should see:
```json
{
    "success": true,
    "token": "eyJ...",
    "user": {
        "id": 1,
        "name": "System Admin",
        "role": "admin",
        "email": "admin@master.com"
    }
}
```

Choose one solution above and your XAMPP setup will work! 🎉
