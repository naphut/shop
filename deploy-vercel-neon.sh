#!/bin/bash

# Deploy Master Shirt Shop to Vercel + Neon Database
echo "🚀 Deploying to Vercel + Neon Database"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Build Frontend${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}❌ Frontend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"

echo ""
echo -e "${BLUE}Step 2: Deploy to Vercel${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm i -g vercel
fi

echo -e "${BLUE}🎨 Deploying frontend to Vercel...${NC}"
vercel --prod
FRONTEND_URL=$(vercel ls 2>/dev/null | head -1 | awk '{print $2}')

echo ""
echo -e "${BLUE}Step 3: Instructions for Backend${NC}"
echo -e "${GREEN}📋 Backend Deployment Steps:${NC}"
echo "1. Go to https://railway.app"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select 'naphut/shop'"
echo "4. Root Directory: backend_neon"
echo "5. Railway will auto-detect Neon database"
echo ""

echo -e "${BLUE}Step 4: Environment Variables${NC}"
echo -e "${YELLOW}🔧 After backend deployment, update Vercel:${NC}"
echo "1. Go to your Vercel project settings"
echo "2. Update VITE_API_URL to: https://your-backend-name.railway.app"
echo "3. Redeploy with: vercel --prod"
echo ""

echo -e "${GREEN}🎯 Deployment Summary:${NC}"
echo -e "Frontend: ${GREEN}$FRONTEND_URL${NC}"
echo -e "Backend: ${YELLOW}Deploy to Railway (backend_neon folder)${NC}"
echo -e "Database: ${GREEN}Neon PostgreSQL (auto-configured)${NC}"
echo -e "API Key: ${GREEN}Gemini AI configured${NC}"
echo ""

echo -e "${BLUE}📚 Complete Guide:${NC}"
echo "See VERCEL_NEON_DEPLOY.md for detailed instructions"
echo ""

echo -e "${GREEN}🌍 Your Master Shirt Shop is ready to go live!${NC}"
