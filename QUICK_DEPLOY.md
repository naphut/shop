# 🚀 Quick Deploy Master Shirt Shop

## Option 1: GitHub Pages (Free & Easiest)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy Master Shirt Shop"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)
6. Click Save

### Step 3: Update API URL
In your React app, update API_BASE to:
```javascript
const API_BASE = 'https://yourusername.github.io/master-shirt-shop/api';
```

## Option 2: Vercel (Recommended)

### One-Click Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod
```

### Environment Variables
Set in Vercel dashboard:
- `VITE_API_URL`: Your backend API URL

## Option 3: Netlify (Free Static Hosting)

### Deploy Build Folder
```bash
# Drag and drop the 'dist' folder to Netlify
# Or use Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### API Proxy
Add this to `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.com/:splat"
  status = 200
```

## Option 4: Railway (Backend + Frontend)

### Deploy with Docker
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway up
```

## 🌐 Live Demo Links

### Temporary Demo (24 hours):
**Frontend**: https://master-shirt-shop-demo.vercel.app
**Backend API**: https://master-shirt-shop-demo.vercel.app/api

### Setup Your Own:
1. **Free Domain**: Freenom, EU.org
2. **Paid Hosting**: Vercel, Netlify, Railway ($5-20/month)
3. **Cloud Server**: DigitalOcean, AWS ($5-50/month)

## 🔧 Production Checklist

### Before Going Live:
- [ ] Update all hardcoded URLs
- [ ] Set production JWT_SECRET
- [ ] Configure database properly
- [ ] Test all API endpoints
- [ ] Set up SSL certificates
- [ ] Configure domain DNS
- [ ] Set up monitoring
- [ ] Test payment integration

### After Deployment:
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Test on mobile devices
- [ ] Check Core Web Vitals
- [ ] Validate HTML/CSS

## 📞 Support

If you need help with deployment:
- 📧 Technical: Check the deployment guide
- 🌐 Hosting: Contact your hosting provider support
- 💬 Community: GitHub Issues, Stack Overflow

---

**🎉 Your Master Shirt Shop is ready for production deployment!**
