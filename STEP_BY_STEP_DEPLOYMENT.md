# 🚀 Master Shirt Shop - Step by Step Deployment Guide

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ Gemini API key configured (AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE)
- ✅ GitHub account
- ✅ Credit card (for free tiers - no charges unless you exceed limits)

---

## 🌟 Step 1: Prepare Your Code

### 1.1 Push to GitHub
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment - Gemini API configured"
git push origin main
```

### 1.2 Verify Build
```bash
# Test local build
npm run build
# Should show: ✓ built in XXXms
```

---

## 📚 Step 2: Deploy Backend (Railway)

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click "Sign up with GitHub"
3. Authorize Railway access

### 2.2 Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `master-shirt-shop` repository
3. Configure settings:
   ```
   Root Directory: backend
   Build Command: (leave empty)
   Start Command: php -S 0.0.0.0:8001
   ```

### 2.3 Set Environment Variables
In Railway dashboard, go to your project → Variables and add:
```env
DB_HOST=containers.railway.app
DB_NAME=railway
DB_USER=railway
DB_PASS=your_railway_db_password
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random_12345
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-url.railway.app
```

### 2.4 Add Database
1. In your Railway project, click "+ New"
2. Select "Add PostgreSQL"
3. Railway will automatically set `DB_PASS`

### 2.5 Test Backend
Wait for deployment, then visit:
```
https://your-backend-url.railway.app/api/health
```
Should return: `{"status": "ok"}`

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign up" → "Continue with GitHub"
3. Authorize Vercel access

### 3.2 Deploy Frontend
1. Click "New Project"
2. Select your `master-shirt-shop` repository
3. Configure settings:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### 3.3 Set Environment Variables
In Vercel dashboard, go to project settings → Environment Variables:
```env
VITE_API_URL=https://your-backend-url.railway.app
GEMINI_API_KEY=AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE
```

### 3.4 Deploy
Click "Deploy" and wait for completion.

---

## 🔧 Step 4: Configure Database

### 4.1 Access Railway Database
1. In Railway project, click on your PostgreSQL database
2. Click "Connect" → "PHP"
3. Copy the connection details

### 4.2 Run Database Setup
1. In Railway, click on your backend service
2. Click "Logs" to see connection details
3. Your backend should automatically create tables

### 4.3 Add Sample Data (Optional)
Visit: `https://your-backend-url.railway.app/api/setup`

---

## 🧪 Step 5: Test Everything

### 5.1 Test Frontend
Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Product search works
- ✅ AI design generation
- ✅ User registration

### 5.2 Test Backend API
```bash
# Test health endpoint
curl https://your-backend-url.railway.app/api/health

# Test products endpoint
curl https://your-backend-url.railway.app/api/products

# Test user registration
curl -X POST https://your-backend-url.railway.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

---

## 🌐 Step 6: Final Configuration

### 6.1 Update CORS (if needed)
In your backend `index.php`, update the CORS origin:
```php
header("Access-Control-Allow-Origin: https://your-vercel-url.vercel.app");
```

### 6.2 Set Custom Domain (Optional)
**Vercel:**
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records

**Railway:**
1. Go to project settings → Networking
2. Add your custom domain

---

## 📱 Step 7: Test Full Application

### Test Complete Flow:
1. **Visit Frontend**: `https://your-vercel-url.vercel.app`
2. **Register Account**: Create new user account
3. **Login**: Test user authentication
4. **Search Products**: Use AI-powered search
5. **Create Design**: Test AI design generation
6. **Add to Cart**: Test cart functionality
7. **Checkout**: Test purchase flow

### Admin Panel Test:
1. **Admin Login**: `admin@master.com` / `admin123`
2. **View Dashboard**: Check analytics
3. **Manage Products**: Add/edit products
4. **View Orders**: Check order management

---

## 🎉 Step 8: Go Live!

### Your Shop is Live at:
- **Frontend**: `https://your-vercel-url.vercel.app`
- **Backend**: `https://your-backend-url.railway.app`

### Quick Links:
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Project GitHub**: https://github.com/yourusername/master-shirt-shop

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. CORS Errors
```php
// In backend/index.php
header("Access-Control-Allow-Origin: https://your-vercel-url.vercel.app");
```

#### 2. Database Connection Failed
- Check Railway database is running
- Verify environment variables
- Check backend logs

#### 3. Build Failed
- Check Node.js version (18+)
- Clear cache: `rm -rf node_modules && npm install`
- Check package.json scripts

#### 4. API 404 Errors
- Verify routing in backend
- Check .htaccess file
- Ensure proper URL structure

#### 5. Gemini API Not Working
- Verify API key in Vercel environment
- Check API key is valid
- Monitor usage limits

---

## 📊 Monitoring

### Set up monitoring:
1. **Vercel Analytics**: Built-in
2. **Railway Logs**: Check backend performance
3. **Gemini Dashboard**: Monitor API usage
4. **Error Tracking**: Consider Sentry

---

## 💰 Costs

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 credit/month (enough for small shop)
- **Gemini API**: Free tier available

### You'll pay if:
- >100k visitors/month
- Heavy AI usage
- Multiple databases

---

## 🎯 Success Metrics

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Backend API responds correctly
- ✅ User registration/login works
- ✅ AI features function properly
- ✅ Admin panel accessible
- ✅ Products display correctly

---

## 🆘 Need Help?

### Support Links:
- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/help
- **Gemini API Docs**: https://ai.google.dev/docs

### Quick Commands:
```bash
# Redeploy frontend
vercel --prod

# Redeploy backend
cd backend && railway up

# Check logs
railway logs
```

---

**🎊 Congratulations! Your Master Shirt Shop is now live on the internet!**

*This guide covers everything from zero to live deployment. Follow each step carefully for best results.*
