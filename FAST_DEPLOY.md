# 🚀 Fast Deploy - Master Shirt Shop

## ⚡ Quick Deploy (5 minutes)

Your code is now at: https://github.com/naphut/shop.git

### Step 1: Deploy Backend (Railway)
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `naphut/shop`
4. Settings:
   - Root Directory: `backend_mysql`
   - Builder: Nixpacks (selected automatically)
   - Start Command: `php -S 0.0.0.0:8001 -t .`
5. Add PostgreSQL database
6. Set Variables:
   ```
   DB_HOST=containers.railway.app
   DB_NAME=railway
   DB_USER=railway
   DB_PASS=${RAILWAY_PRIVATE_PASSWORD}
   JWT_SECRET=super_secret_key_12345
   APP_ENV=production
   ```

### Step 2: Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Click "New Project"
3. Import `naphut/shop`
4. Settings:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
5. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   GEMINI_API_KEY=AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE
   ```

### Step 3: Test
- Frontend: Your Vercel URL
- Backend: Your Railway URL + `/api/health`

## 🎯 Done!
Your shop is live! 🎉
