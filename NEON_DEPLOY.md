# 🚀 Neon PostgreSQL Deployment Guide

## 🔍 Connection Issues

You're getting `psql: command not found` because PostgreSQL isn't installed or not in PATH.

## 🛠️ Solutions

### Option 1: Install PostgreSQL (Recommended)
```bash
# macOS with Homebrew
brew install postgresql

# Verify installation
which psql
psql --version

# Test connection
psql "postgresql://neondb_owner:npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Option 2: Use Docker (Alternative)
```bash
# Pull PostgreSQL Docker image
docker run --rm -it postgres:15 psql "postgresql://neondb_owner:npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Or use Neon CLI
npm i -g @neondatabase/serverless
neonctl connection-string master-shirt-shop
```

### Option 3: Use Neon CLI (Easiest)
```bash
# Install Neon CLI
npm i -g @neondatabase/serverless

# Get connection string
neonctl connection-string master-shirt-shop

# Test connection
neonctl connection-string master-shirt-shop | xargs -I {} psql

# Create tables
neonctl connection-string master-shirt-shop | xargs -I {} psql < create_tables.sql

# Insert sample data
neonctl connection-string master-shirt-shop | xargs -I {} psql < sample_data.sql
```

## 📋 Database Setup Commands

Once you have PostgreSQL access, run:

```bash
# Create database and tables
psql "your_connection_string" < create_tables.sql

# Insert sample data
psql "your_connection_string" < sample_data.sql

# Verify tables
psql "your_connection_string" -c "\dt"

# Test backend
cd backend_neon
php -S localhost:8001

# Test API
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@master.com","password":"admin123"}' \
  http://localhost:8001/login
```

## 🔧 Environment Setup

Create `.env` file with your actual credentials:
```env
DB_HOST=ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=npg_oaUnfsOMG9e7@ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech
DB_PORT=5432
DB_SSL=require
JWT_SECRET=your_secure_jwt_secret
```

## 🚀 Quick Deploy

```bash
# Start backend
cd backend_neon
php -S localhost:8001

# Deploy to any PHP host
# Upload backend_neon folder to your hosting provider
# Update frontend API_BASE to your domain
```

## 📊 Expected Result

After successful setup:
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

Choose one of the solutions above to get your Neon PostgreSQL backend working! 🎉
