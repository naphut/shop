# 🚀 Neon Database Quick Deploy

## 🐘 Neon PostgreSQL Database Ready

Your connection string:
```
postgresql://neondb_owner:npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 📋 Deployment Options

### Option 1: Deploy to Railway with Neon
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select `naphut/shop`
4. Settings:
   - Root Directory: `backend_neon`
   - Builder: Nixpacks
   - Start Command: `php -S 0.0.0.0:8001 -t .`
5. Environment Variables (already configured in railway.toml):
   ```
   DB_HOST=ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech
   DB_NAME=neondb
   DB_USER=neondb_owner
   DB_PASS=npg_oaUnfsOMG9e7
   DB_PORT=5432
   DB_SSL=require
   ```

### Option 2: Deploy to Vercel + Neon
1. Frontend: Deploy to Vercel (as before)
2. Backend: Use Railway with Neon database
3. Connect Vercel to Neon backend

## 🔧 Database Setup

### Test Neon Connection
```php
// In your backend, test connection:
$db = getDB();
if ($db) {
    echo "✅ Neon database connected!";
} else {
    echo "❌ Connection failed";
}
```

### Create Tables
```sql
-- Run this in Neon console or via setup endpoint
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name JSON NOT NULL,
    description JSON NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    images JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 Benefits of Neon
- ✅ Serverless PostgreSQL
- ✅ Auto-scaling
- ✅ Free tier available
- ✅ Fast connection from anywhere
- ✅ Branching for development

## 🚀 Deploy Steps

### 1. Push Updates
```bash
git add .
git commit -m "Configure Neon database connection"
git push origin main
```

### 2. Deploy Backend
- Railway will auto-detect settings from `backend_neon/railway.toml`
- Neon database connection is pre-configured

### 3. Deploy Frontend
- Vercel deployment as before
- Update `VITE_API_URL` to point to Railway backend

### 4. Test
- Visit Railway URL + `/api/health`
- Test database operations
- Verify frontend-backend connection

## 🎯 URLs After Deployment
- **Neon Database**: https://neon.tech
- **Backend**: https://your-backend.railway.app
- **Frontend**: https://your-frontend.vercel.app

## 🔑 Connection Details (Already Configured)
- Host: ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech
- Database: neondb
- User: neondb_owner
- Password: npg_oaUnfsOMG9e7
- Port: 5432
- SSL: require

**Your Neon database is ready for production! 🎉**
