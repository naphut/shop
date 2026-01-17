# 🚀 Deploy to Vercel + Connect Neon Database

## 📋 Prerequisites
- ✅ GitHub repo: https://github.com/naphut/shop.git
- ✅ Neon database configured
- ✅ Gemini API key: AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE

---

## 🎨 Step 1: Deploy Frontend to Vercel

### 1.1 Go to Vercel
1. Visit https://vercel.com
2. Click "Sign up" or "Login"
3. Click "New Project"

### 1.2 Import Repository
1. Click "Import Git Repository"
2. Select `naphut/shop`
3. Click "Import"

### 1.3 Configure Project
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 1.4 Environment Variables
Add these in Vercel → Settings → Environment Variables:
```env
VITE_API_URL=https://your-backend-url.railway.app
GEMINI_API_KEY=AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE
```

### 1.5 Deploy
Click "Deploy" and wait for completion.

---

## 🐘 Step 2: Deploy Backend to Railway (Neon Database)

### 2.1 Go to Railway
1. Visit https://railway.app
2. Click "New Project"

### 2.2 Import Repository
1. Click "Deploy from GitHub repo"
2. Select `naphut/shop`
3. Click "Import"

### 2.3 Configure Backend
```
Root Directory: backend_neon
Builder: Nixpacks (auto-detected)
Start Command: php -S 0.0.0.0:8001 -t .
```

### 2.4 Add Neon Database (Skip if you want Railway DB)
1. In Railway project, click "+ New"
2. Select "Add PostgreSQL" (this creates Railway DB)
3. OR skip and use your existing Neon DB

### 2.5 Environment Variables
Railway will auto-use these from `backend_neon/railway.toml`:
```env
DB_HOST=ep-young-voice-ah2904qr-pooler.c-3.us-east-1.aws.neon.tech
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=npg_oaUnfsOMG9e7
DB_PORT=5432
DB_SSL=require
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
APP_ENV=production
APP_DEBUG=false
```

### 2.6 Deploy Backend
Click "Deploy" and wait for completion.

---

## 🔗 Step 3: Connect Frontend to Backend

### 3.1 Get Backend URL
After Railway deployment, you'll get a URL like:
```
https://your-backend-name.railway.app
```

### 3.2 Update Vercel Environment
1. Go to Vercel → Your Project → Settings
2. Update `VITE_API_URL`:
```env
VITE_API_URL=https://your-backend-name.railway.app
```

### 3.3 Redeploy Frontend
In Vercel dashboard, click "Redeploy" or:
```bash
vercel --prod
```

---

## 🧪 Step 4: Test Neon Database Connection

### 4.1 Test Backend Health
Visit: `https://your-backend-name.railway.app/api/health`
Should return: `{"status": "ok"}`

### 4.2 Test Database
Visit: `https://your-backend-name.railway.app/api/test`
Should show database connection status.

### 4.3 Test Frontend
Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Product search works
- ✅ User registration
- ✅ AI features

---

## 🌐 Step 5: Go Live!

### Your URLs:
- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://your-backend-name.railway.app`
- **Neon DB**: https://neon.tech (console)

### Final Configuration:
1. **CORS**: Backend should allow your Vercel domain
2. **Environment**: All variables set correctly
3. **Database**: Neon connection working
4. **API**: Gemini AI features working

---

## 🎯 Success Checklist

Your deployment is successful when:
- ✅ Vercel frontend loads without errors
- ✅ Railway backend responds to /api/health
- ✅ Neon database connects successfully
- ✅ User registration/login works
- ✅ Product search functions
- ✅ AI design generation works
- ✅ Admin panel accessible

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. CORS Errors
```php
// In backend_neon/index.php
header("Access-Control-Allow-Origin: https://your-vercel-url.vercel.app");
```

#### 2. Database Connection Failed
- Verify Neon connection string
- Check Railway environment variables
- Test connection directly

#### 3. Build Failed
- Check Node.js version (18+)
- Clear cache: `rm -rf node_modules && npm install`

#### 4. API 404 Errors
- Verify backend routing
- Check .htaccess configuration
- Ensure correct URL structure

---

## 📊 Monitoring

### Vercel Dashboard:
- Analytics: Built-in
- Logs: Deployment and function logs
- Settings: Environment variables

### Railway Dashboard:
- Logs: Backend and database logs
- Metrics: Performance monitoring
- Settings: Environment variables

### Neon Dashboard:
- Database: Connection and performance
- Branching: Development environments
- Usage: Monitor credits

---

## 🎉 Congratulations!

**Your Master Shirt Shop is now live with:**
- 🎨 **Modern Frontend** on Vercel
- 🐘 **Powerful Backend** on Railway  
- 🗄️ **Scalable Database** on Neon
- 🤖 **AI Features** powered by Gemini

**🌍 Live URLs:**
- Frontend: Check Vercel dashboard
- Backend: Check Railway dashboard
- Database: https://neon.tech

**🚀 Your shop is ready for customers!**
