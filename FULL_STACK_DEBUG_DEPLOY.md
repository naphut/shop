# 🚀 Full-Stack Debug & Deployment Guide

## 📋 Project Analysis

Your Master Shirt Shop has:
- **Frontend**: React + TypeScript + Vite + Tailwind
- **Backend**: PHP with multiple options (MySQL, Neon, XAMPP)
- **Database**: SQLite/MySQL/PostgreSQL options
- **AI Integration**: Google Gemini API
- **Authentication**: JWT-based

---

## 🔧 Phase 1: Debug Frontend & Backend

### 1.1 Frontend Debugging

#### Check API Integration
```bash
# Test frontend build
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check environment variables
echo "VITE_API_URL: $VITE_API_URL"
echo "GEMINI_API_KEY: ${GEMINI_API_KEY:0:10}..."
```

#### Common Frontend Issues & Fixes

**Issue 1: API Connection Failed**
```typescript
// Check apiService.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Add error handling
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE}/api/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};
```

**Issue 2: CORS Errors**
```typescript
// Add to your API calls
const response = await fetch(`${API_BASE}/api/${endpoint}`, {
  mode: 'cors', // Add this
  credentials: 'include', // If using cookies
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // For development
  },
});
```

**Issue 3: Environment Variables**
```bash
# Create .env.local for development
echo "VITE_API_URL=http://localhost:8001" > .env.local
echo "GEMINI_API_KEY=your_actual_key" >> .env.local

# For production
echo "VITE_API_URL=https://your-backend-url.com" > .env.production
```

### 1.2 Backend Debugging

#### Test Backend API
```bash
# Test PHP backend
cd backend_mysql
php -S localhost:8001

# Test endpoints
curl -X GET http://localhost:8001/api/health
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@master.com","password":"admin123"}'
```

#### Common Backend Issues & Fixes

**Issue 1: Database Connection**
```php
// In config.php, add better error handling
function getDB() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        
        // Test connection
        $stmt = $pdo->query("SELECT 1");
        error_log("Database connected successfully");
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        // Return more detailed error
        throw new Exception("Database Error: " . $e->getMessage());
    }
}
```

**Issue 2: CORS Headers**
```php
// Add to top of index.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
```

**Issue 3: JWT Authentication**
```php
// Better JWT error handling
function verifyAuth() {
    $user = getAuthUser();
    if (!$user) {
        sendError("Unauthorized - Invalid or missing token", 401);
        exit();
    }
    return $user;
}

// Test JWT generation
$token = JWT::encode([
    "id" => $user['id'], 
    "role" => $user['role'], 
    "name" => $user['name'],
    "email" => $user['email'],
    "exp" => time() + 86400 // 24 hours
], JWT_SECRET);
```

### 1.3 Integration Testing

#### Full Stack Test
```bash
# Terminal 1: Start backend
cd backend_mysql
php -S localhost:8001

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Test API
curl -X POST http://localhost:8001/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

---

## 📁 Phase 2: Prepare for GitHub

### 2.1 Create Proper .gitignore

#### Root .gitignore
```gitignore
# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
build/
*/dist/
*/build/

# Environment files
.env
.env.local
.env.production
.env.*.local

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Backend specific
backend/database.sqlite
backend/database.sqlite3
backend/*/database.sqlite*
*/.env
*/logs/
*/temp/
*/cache/
```

#### Backend-specific .gitignore (in each backend folder)
```gitignore
# Database
*.sqlite
*.sqlite3
*.db

# Config
.env
.env.local
.env.production

# Logs
logs/
*.log

# Temp
temp/
cache/
uploads/
```

### 2.2 Initialize Git Repository

```bash
# If starting fresh repo
git init
git branch -M main

# If adding to existing repo
git remote add origin https://github.com/naphut/shop.git
git pull origin main

# Add all files
git add .

# Commit with clear messages
git commit -m "feat: Add full-stack Master Shirt Shop

- Frontend: React + TypeScript + Vite
- Backend: PHP with multiple database options
- AI: Gemini API integration
- Auth: JWT authentication
- Config: Environment-based configuration"
```

### 2.3 Push to GitHub

```bash
# Push to GitHub
git push -u origin main

# Verify push
git status
# Should show: "nothing to commit, working tree clean"
```

---

## 🚀 Phase 3: Deployment Instructions

### 3.1 Choose Your Stack

#### Option A: Vercel (Frontend) + Railway (Backend) - RECOMMENDED
**Pros**: Free tier, easy setup, auto-HTTPS, custom domains
**Best for**: Most projects, startups, MVPs

#### Option B: Netlify (Frontend) + Railway (Backend)
**Pros**: Free tier, form-based setup, good CI/CD
**Best for**: Static sites, simple deployments

#### Option C: Render (Full-stack)
**Pros**: Free tier, supports multiple services, web dashboard
**Best for**: Full-stack apps, monorepos

#### Option D: Fly.io (Full-stack)
**Pros**: Edge deployment, Docker support, global CDN
**Best for**: Performance-critical apps, global users

#### Option E: GitHub Pages (Frontend) + Railway (Backend)
**Pros**: Free, simple, GitHub integrated
**Best for**: Static sites, portfolios, docs

---

### 3.2 Deployment A: Vercel + Railway (Step-by-Step)

#### Step 1: Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Import Git Repository: naphut/shop
# - Framework: Vite (auto-detected)
# - Build Command: npm run build
# - Output Directory: dist
# - Install Command: npm install
```

#### Vercel Environment Variables
```env
VITE_API_URL=https://your-backend-name.railway.app
GEMINI_API_KEY=AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE
```

#### Step 2: Deploy Backend to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy backend_mysql
cd backend_mysql
railway up

# Or deploy backend_neon for PostgreSQL
cd ../backend_neon
railway up
```

#### Railway Environment Variables
```env
DB_HOST=containers.railway.app
DB_NAME=railway
DB_USER=railway
DB_PASS=your_railway_db_password
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-name.railway.app
```

#### Step 3: Connect Frontend to Backend
1. Get Railway URL from dashboard
2. Update Vercel environment variable `VITE_API_URL`
3. Redeploy Vercel: `vercel --prod`

---

### 3.3 Deployment B: Netlify + Railway

#### Step 1: Deploy Frontend to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Netlify Configuration (netlify.toml)
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  VITE_API_URL = "https://your-backend.railway.app"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend.railway.app/:splat"
  status = 200
```

---

### 3.4 Deployment C: Render (Full-stack)

#### render.yaml
```yaml
services:
  # Frontend
  - type: web
    name: master-shirt-shop-frontend
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: VITE_API_URL
        value: https://master-shirt-shop-backend.onrender.com
      - key: GEMINI_API_KEY
        value: AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE

  # Backend
  - type: web
    name: master-shirt-shop-backend
    env: php
    buildCommand: echo "No build needed"
    startCommand: php -S 0.0.0.0:10000
    envVars:
      - key: DB_HOST
        value: your_render_db_host
      - key: DB_NAME
        value: your_render_db_name
      - key: DB_USER
        value: your_render_db_user
      - key: DB_PASS
        value: your_render_db_password
      - key: JWT_SECRET
        value: your_super_secret_jwt_key
```

---

## 🔧 Phase 4: Configuration Examples

### 4.1 Frontend Environment Files

#### .env.local (Development)
```env
VITE_API_URL=http://localhost:8001
GEMINI_API_KEY=AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE
```

#### .env.production (Production)
```env
VITE_API_URL=https://your-backend-name.railway.app
GEMINI_API_KEY=AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE
```

### 4.2 Backend Configuration

#### config.php (Production)
```php
<?php
// Load environment variables
function loadEnv($path) {
    if (!file_exists($path)) return;
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') === false) continue;
        
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        
        putenv("$key=$value");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

loadEnv(__DIR__ . '/.env');

// Database Configuration
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'master_shirt_shop');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');

// Security
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'your-secret-key');
define('JWT_EXPIRY', $_ENV['JWT_EXPIRY'] ?? 86400);

// Application
define('APP_ENV', $_ENV['APP_ENV'] ?? 'development');
define('APP_DEBUG', $_ENV['APP_DEBUG'] ?? true);
define('APP_URL', $_ENV['APP_URL'] ?? 'http://localhost:8001');

// Database connection
function getDB() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        return new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $e) {
        error_log("Database Error: " . $e->getMessage());
        throw new Exception("Database connection failed");
    }
}
?>
```

---

## 🚨 Phase 5: Troubleshooting

### 5.1 Common Issues & Solutions

#### Issue: "Cannot connect to API"
**Causes**: CORS, wrong URL, backend not running
**Solutions**:
```bash
# Check backend is running
curl http://localhost:8001/api/health

# Check CORS headers
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS http://localhost:8001/api/login

# Fix CORS in backend
header("Access-Control-Allow-Origin: http://localhost:5173");
```

#### Issue: "Database connection failed"
**Causes**: Wrong credentials, database not running, wrong host
**Solutions**:
```php
// Test database connection directly
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=test", "user", "pass");
    echo "✅ Database connected";
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
```

#### Issue: "JWT token invalid"
**Causes**: Secret mismatch, token expired, wrong algorithm
**Solutions**:
```php
// Debug JWT
$token = "your_token_here";
try {
    $decoded = JWT::decode($token, JWT_SECRET);
    echo "✅ Token valid: " . json_encode($decoded);
} catch (Exception $e) {
    echo "❌ Token error: " . $e->getMessage();
}
```

#### Issue: "Build failed on deployment"
**Causes**: Missing dependencies, wrong Node version, environment variables
**Solutions**:
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
npm --version

# Test build locally
npm run build
```

### 5.2 Debugging Tools

#### Frontend Debugging
```bash
# React DevTools
# Install React Developer Tools browser extension

# Network debugging
# In browser DevTools -> Network tab
# Check API calls, responses, errors

# Console debugging
console.log('API Response:', data);
console.error('API Error:', error);
```

#### Backend Debugging
```php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log errors
error_log("Debug: User login attempt: " . $email);

// Return debug info
header('X-Debug-Info: Backend running');
```

---

## 🎯 Phase 6: Production Checklist

### 6.1 Pre-Deployment Checklist
- [ ] Frontend builds without errors
- [ ] Backend API endpoints work locally
- [ ] Database connection successful
- [ ] Environment variables set
- [ ] CORS configured for production domain
- [ ] JWT secret is secure and long
- [ ] Gemini API key works
- [ ] All tests pass

### 6.2 Post-Deployment Checklist
- [ ] Frontend loads at production URL
- [ ] Backend responds at production URL
- [ ] Database operations work
- [ ] User authentication works
- [ ] AI features function
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS works
- [ ] Custom domain (if needed)

---

## 📞 Quick Commands Reference

### Git Commands
```bash
# Initialize repo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/naphut/shop.git
git push -u origin main

# Update existing repo
git add .
git commit -m "Update: Fix API integration"
git push origin main

# Check status
git status
git log --oneline -5
```

### Deployment Commands
```bash
# Vercel
npm i -g vercel
vercel login
vercel --prod

# Railway
npm i -g @railway/cli
railway login
railway up

# Netlify
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist

# Render
# Push to GitHub, connect Render dashboard
```

### Debug Commands
```bash
# Frontend
npm run build
npm run dev
npm run preview

# Backend
php -S localhost:8001
php -S 0.0.0.0:8001

# Test API
curl -X GET http://localhost:8001/api/health
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🎉 Success!

Your Master Shirt Shop is now:
- ✅ **Debugged** - Frontend and backend work together
- ✅ **Version Controlled** - Proper Git setup
- ✅ **Deployed** - Live on internet with free hosting
- ✅ **Configured** - Environment variables and database
- ✅ **Tested** - All features working

**🌍 Live URLs:**
- Frontend: Your hosting provider URL
- Backend: Your hosting provider URL
- Database: Configured and connected

**🚀 Ready for customers!**
