# 🌐 Master Shirt Shop - Internet Setup Guide

## 📋 Complete Hosting Setup

This guide will help you deploy your Master Shirt Shop to the internet with both frontend and backend hosting.

---

## 🚀 Option 1: Quick Deploy (Recommended)

### Frontend: Vercel + Backend: Railway

#### Step 1: Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project folder
cd /Users/retnaphut/Documents/master-shirt-shop
vercel --prod

# Follow the prompts:
# - Link to existing project? No
# - Project name: master-shirt-shop
# - Directory: ./
# - Want to override settings? Yes
```

#### Step 2: Deploy Backend to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd /Users/retnaphut/Documents/master-shirt-shop/backend
railway init
railway up
```

#### Step 3: Configure Environment Variables
**In Vercel Dashboard:**
1. Go to your project settings → Environment Variables
2. Add these variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   GEMINI_API_KEY=your_gemini_api_key
   ```

**In Railway Dashboard:**
1. Go to your backend project → Variables
2. Add these variables:
   ```
   DB_HOST=containers.railway.app
   DB_NAME=railway
   DB_USER=railway
   DB_PASS=your_railway_db_password
   JWT_SECRET=your_super_secret_jwt_key
   APP_ENV=production
   APP_DEBUG=false
   ```

---

## 🌐 Option 2: Alternative Hosting

### Frontend: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Backend: Heroku
```bash
# Install Heroku CLI
npm i -g heroku

# Create and deploy
heroku create master-shirt-shop-backend
cd backend
heroku buildpacks:set heroku/php
git add .
git commit -m "Deploy backend"
git push heroku main
```

---

## 🔧 Pre-Deployment Checklist

### ✅ Frontend Preparation
- [ ] Test local build: `npm run build`
- [ ] Update API URLs in production
- [ ] Set Gemini API key
- [ ] Optimize images
- [ ] Test all functionality locally

### ✅ Backend Preparation  
- [ ] Test database connection
- [ ] Set production JWT secret
- [ ] Configure CORS for your domain
- [ ] Test all API endpoints
- [ ] Set up error logging

---

## 📱 Step-by-Step Instructions

### Phase 1: Get Your API Keys

1. **Gemini API Key**
   - Visit: https://aistudio.google.com/app/apikey
   - Create new API key
   - Copy the key for later use

2. **Database Setup (Railway)**
   - Sign up at https://railway.app
   - Create new PostgreSQL database
   - Note connection details

### Phase 2: Deploy Backend

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Railway**
   - Connect Railway to your GitHub repo
   - Select `backend` folder
   - Configure environment variables
   - Deploy

3. **Test Backend**
   - Visit: `https://your-backend-url.railway.app/api/health`
   - Should return: `{"status": "ok"}`

### Phase 3: Deploy Frontend

1. **Deploy on Vercel**
   - Connect Vercel to your GitHub repo
   - Configure environment variables
   - Deploy automatically

2. **Test Frontend**
   - Visit your Vercel URL
   - Test search functionality
   - Test user registration/login

---

## 🔗 Environment Variables Reference

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.railway.app
GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend (Production)
```env
DB_HOST=containers.railway.app
DB_NAME=railway
DB_USER=railway
DB_PASS=your_database_password
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-url.railway.app
```

---

## 🛠️ Deployment Scripts

### Quick Deploy Script
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying Master Shirt Shop..."

# Deploy backend
echo "📦 Deploying backend to Railway..."
cd backend
railway up

# Deploy frontend
echo "🎨 Deploying frontend to Vercel..."
cd ..
vercel --prod

echo "✅ Deployment complete!"
echo "Frontend: https://your-vercel-url.vercel.app"
echo "Backend: https://your-backend-url.railway.app"
```

---

## 🔍 Testing Your Deployment

### Frontend Tests
- [ ] Homepage loads correctly
- [ ] Product search works
- [ ] AI design generation works
- [ ] User registration/login
- [ ] Cart functionality
- [ ] Checkout process

### Backend Tests
- [ ] Health endpoint: `/api/health`
- [ ] Products endpoint: `/api/products`
- [ ] User registration: `/api/users/register`
- [ ] User login: `/api/users/login`
- [ ] Admin functionality

---

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```php
   // In backend index.php
   header("Access-Control-Allow-Origin: https://your-frontend-domain.vercel.app");
   header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type, Authorization");
   ```

2. **Database Connection**
   - Verify Railway database is running
   - Check connection credentials
   - Ensure proper port (usually 5432)

3. **Build Failures**
   - Check Node.js version (use 18+)
   - Clear node_modules and reinstall
   - Verify all dependencies

4. **API 404 Errors**
   - Check routing configuration
   - Verify .htaccess rules
   - Ensure proper file structure

---

## 📊 Monitoring & Analytics

### Recommended Services
- **Sentry**: Error tracking
- **Google Analytics**: User analytics  
- **Uptime Robot**: Server monitoring
- **LogRocket**: User session recording

---

## 🎉 Success!

Once deployed, your shop will be live at:
- **Frontend**: `https://your-shop.vercel.app`
- **Backend**: `https://your-backend.railway.app`

### Next Steps
1. Set up custom domain
2. Configure SSL certificates
3. Set up payment gateway
4. Add email notifications
5. Set up backup strategy

---

## 🆘 Support Links

- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/help
- **Netlify Support**: https://www.netlify.com/support
- **Heroku Support**: https://www.heroku.com/support

---

*This guide covers the most common deployment scenario. Adjust based on your specific hosting provider and requirements.*
