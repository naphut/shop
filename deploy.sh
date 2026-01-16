#!/bin/bash

# Master Shirt Shop Deployment Script
echo "🚀 Deploying Master Shirt Shop..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Create deployment directory
DEPLOY_DIR="deploy-master-shirt-shop"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy built frontend
cp -r dist $DEPLOY_DIR/

# Copy backend API
cp -r api $DEPLOY_DIR/

# Create production .env
cp .env.production $DEPLOY_DIR/.env

# Create deployment info
cat > $DEPLOY_DIR/DEPLOYMENT_INFO.md << EOF
# Master Shirt Shop - Deployment Information

## 🌐 Live Website
Your deployed website will be available at your hosting provider.

## 🔧 Setup Instructions

### For Vercel Deployment:
```bash
cd $DEPLOY_DIR
npm i -g vercel
vercel --prod
```

### For Netlify Deployment:
```bash
cd $DEPLOY_DIR
netlify deploy --prod --dir=.
```

### For Railway Deployment:
```bash
cd $DEPLOY_DIR/api
railway up
```

## 📁 Files Included
- Frontend build (React + Vite)
- Backend API (PHP + SQLite)
- Configuration files
- Database (SQLite with sample data)

## 🔑 Default Credentials
- Admin Email: admin@master.com
- Admin Password: admin123

## 📊 API Endpoints
- POST /login (User login)
- POST /register (User registration)
- POST /admin/login (Admin login)
- GET /me (Protected user info)
- GET /products (Product catalog)
- GET /categories (Categories list)

## 🛠️ Technologies Used
- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Native PHP 8.5, JWT Authentication, SQLite
- Database: SQLite with sample products and users
- Deployment: Multiple options (Vercel, Netlify, Railway, DigitalOcean)

EOF

echo "✅ Deployment package created in $DEPLOY_DIR"
echo "📋 Next steps:"
echo "   1. Choose your hosting provider"
echo "   2. Upload/copy the $DEPLOY_DIR folder"
echo "   3. Configure environment variables"
echo "   4. Update your domain DNS if needed"
echo ""
echo "🌍 Your Master Shirt Shop is ready for deployment!"
