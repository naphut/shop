# Master Shirt Shop - Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for React Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd /Users/retnaphut/Documents/master-shirt-shop
vercel --prod

# Environment variables (set in Vercel dashboard)
VITE_API_URL=https://your-backend-url.com
```

### Option 2: Netlify (React Frontend)
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist

# Redirects file (netlify.toml)
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.com/:splat"
  status = 200
```

### Option 3: Railway (Full-Stack)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy both frontend and backend
railway login
railway init
railway up

# Environment variables
DB_HOST=containers.railway.app
DB_NAME=railway
DB_USER=railway
DB_PASS=your_password
JWT_SECRET=your_jwt_secret
```

### Option 4: Heroku (Full-Stack)
```bash
# Install Heroku CLI
npm i -g heroku

# Create app
heroku create master-shirt-shop

# Deploy backend
cd api
heroku buildpacks:set heroku/php
heroku config:set DB_HOST=your-db-host
heroku config:set DB_NAME=your-db-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Deploy frontend
cd ..
heroku buildpacks:set heroku/nodejs
heroku config:set API_URL=https://your-app.herokuapp.com
npm run build
heroku static:deploy
```

### Option 5: DigitalOcean (Docker)
```dockerfile
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Backend Dockerfile
FROM php:8-apache
COPY api/ /var/www/html/
RUN a2enmod rewrite
EXPOSE 80
```

### Option 6: AWS Amplify (React Frontend)
```bash
# Install Amplify CLI
npm i -g @aws-amplify/cli

# Initialize and deploy
amplify init
amplify add hosting
amplify publish

# Custom REST API (API Gateway + Lambda)
amplify add api
```

## 🔧 Pre-Deployment Checklist

### Frontend (React)
- [ ] Update API_BASE in apiService.ts to production URL
- [ ] Set environment variables in Vercel/Netlify dashboard
- [ ] Test build locally: `npm run build`
- [ ] Update all hardcoded URLs
- [ ] Optimize images and assets

### Backend (PHP)
- [ ] Update database credentials for production
- [ ] Set production JWT_SECRET
- [ ] Configure proper CORS origins
- [ ] Set up SSL certificates
- [ ] Test all endpoints locally with production config

### Database Setup
```sql
-- Production database setup
CREATE DATABASE master_shirt_shop;
USE master_shirt_shop;

-- Import schema
SOURCE db.sql;

-- Create admin user
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@yourdomain.com', '$2y$10$hash', 'admin');
```

## 🌐 Production Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com
VITE_JWT_SECRET=your_production_jwt_secret
```

### Backend (.env.production)
```env
DB_HOST=your-production-db-host
DB_NAME=master_shirt_shop
DB_USER=your_db_user
DB_PASS=your_secure_password
JWT_SECRET=your_super_secure_jwt_secret_key_2024
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

## 🔒 Security Considerations

1. **HTTPS Only**: Force HTTPS in production
2. **Environment Variables**: Never commit secrets to git
3. **Database Security**: Use strong passwords and limited privileges
4. **JWT Security**: Use long, random secrets
5. **CORS**: Limit to specific domains in production
6. **Rate Limiting**: Implement API rate limiting
7. **Input Validation**: Sanitize all user inputs
8. **Error Handling**: Don't expose sensitive information

## 📊 Monitoring & Analytics

### Recommended Tools
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: User session replay and analytics
- **Google Analytics**: Traffic and user behavior
- **Uptime Robot**: Server monitoring and alerts

## 🚀 Quick Deploy Commands

### Fastest Deployment (Vercel + Railway)
```bash
# Deploy frontend to Vercel
npm i -g vercel
vercel --prod

# Deploy backend to Railway
npm i -g @railway/cli
cd api
railway up
```

## 📞 Troubleshooting

### Common Issues
1. **CORS Errors**: Check allowed origins in backend
2. **Database Connection**: Verify credentials and network access
3. **Build Failures**: Check Node.js version and dependencies
4. **API 404s**: Verify routing and .htaccess rules
5. **JWT Errors**: Check secret key and token expiration

### Support
- Vercel: https://vercel.com/support
- Railway: https://railway.app/help
- Netlify: https://www.netlify.com/support
- DigitalOcean: https://www.digitalocean.com/support
