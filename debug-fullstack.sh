#!/bin/bash

# Full-Stack Debug Script for Master Shirt Shop
echo "🔧 Full-Stack Debug & Deploy Script"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Environment Check${NC}"
echo "=================="

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not installed${NC}"
    echo "Install: https://nodejs.org/"
fi

# Check PHP
if command -v php &> /dev/null; then
    PHP_VERSION=$(php --version | head -1)
    echo -e "${GREEN}✅ PHP: $PHP_VERSION${NC}"
else
    echo -e "${RED}❌ PHP not installed${NC}"
    echo "Install: https://www.php.net/"
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ Git: $GIT_VERSION${NC}"
else
    echo -e "${RED}❌ Git not installed${NC}"
    echo "Install: https://git-scm.com/"
fi

echo ""
echo -e "${BLUE}Step 2: Frontend Debug${NC}"
echo "=================="

# Check package.json
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json found${NC}"
    
    # Check dependencies
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✅ node_modules exists${NC}"
    else
        echo -e "${YELLOW}⚠️  Installing dependencies...${NC}"
        npm install
    fi
    
    # Test build
    echo -e "${BLUE}🔨 Testing frontend build...${NC}"
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend builds successfully${NC}"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        echo "Check for TypeScript errors:"
        npx tsc --noEmit
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Backend Debug${NC}"
echo "=================="

# Check backend directories
BACKEND_DIRS=("backend_mysql" "backend_neon" "backend_xampp")
BACKEND_FOUND=""

for dir in "${BACKEND_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ Backend found: $dir${NC}"
        BACKEND_FOUND="$dir"
        
        # Check for config.php
        if [ -f "$dir/config.php" ]; then
            echo -e "${GREEN}✅ config.php found in $dir${NC}"
        else
            echo -e "${YELLOW}⚠️  config.php not found in $dir${NC}"
        fi
        
        # Check for index.php
        if [ -f "$dir/index.php" ]; then
            echo -e "${GREEN}✅ index.php found in $dir${NC}"
        else
            echo -e "${YELLOW}⚠️  index.php not found in $dir${NC}"
        fi
        
        break
    fi
done

if [ -z "$BACKEND_FOUND" ]; then
    echo -e "${RED}❌ No backend directory found${NC}"
fi

echo ""
echo -e "${BLUE}Step 4: API Connection Test${NC}"
echo "==========================="

# Test backend if found
if [ -n "$BACKEND_FOUND" ]; then
    echo -e "${BLUE}🚀 Starting backend server...${NC}"
    cd "$BACKEND_FOUND"
    php -S localhost:8001 > /dev/null 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for server to start
    sleep 3
    
    echo -e "${BLUE}🔍 Testing API endpoints...${NC}"
    
    # Test health endpoint
    echo "Testing /api/health..."
    if curl -s http://localhost:8001/api/health > /dev/null; then
        echo -e "${GREEN}✅ Health endpoint working${NC}"
    else
        echo -e "${RED}❌ Health endpoint failed${NC}"
    fi
    
    # Test login endpoint
    echo "Testing /api/login..."
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8001/api/login \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@master.com","password":"admin123"}' \
        2>/dev/null)
    
    if echo "$LOGIN_RESPONSE" | grep -q "token"; then
        echo -e "${GREEN}✅ Login endpoint working${NC}"
    else
        echo -e "${RED}❌ Login endpoint failed${NC}"
        echo "Response: $LOGIN_RESPONSE"
    fi
    
    # Kill backend server
    kill $BACKEND_PID 2>/dev/null
    echo -e "${BLUE}🛑 Backend server stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping API test - no backend found${NC}"
fi

echo ""
echo -e "${BLUE}Step 5: Git Repository Check${NC}"
echo "============================="

# Check if git repo
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    
    # Check remote
    if git remote get-url origin > /dev/null; then
        REMOTE_URL=$(git remote get-url origin)
        echo -e "${GREEN}✅ Remote origin: $REMOTE_URL${NC}"
    else
        echo -e "${YELLOW}⚠️  No remote origin set${NC}"
    fi
    
    # Check status
    STATUS=$(git status --porcelain)
    if [ -z "$STATUS" ]; then
        echo -e "${GREEN}✅ Working tree clean${NC}"
    else
        echo -e "${YELLOW}⚠️  Uncommitted changes:${NC}"
        echo "$STATUS"
    fi
else
    echo -e "${YELLOW}⚠️  Not a Git repository${NC}"
    echo "Initialize with: git init"
fi

echo ""
echo -e "${BLUE}Step 6: Environment Variables${NC}"
echo "=============================="

# Check .env files
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file found${NC}"
    echo "Contents:"
    cat .env | grep -v "PASSWORD\|SECRET" | sed 's/^/  /'
else
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
fi

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅ .env.example file found${NC}"
else
    echo -e "${YELLOW}⚠️  .env.example file not found${NC}"
fi

echo ""
echo -e "${BLUE}Step 7: Deployment Readiness${NC}"
echo "=============================="

# Check deployment configs
DEPLOY_FILES=("vercel.json" "netlify.toml" "railway.toml" "render.yaml")

for file in "${DEPLOY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file found${NC}"
    else
        echo -e "${YELLOW}⚠️  $file not found${NC}"
    fi
done

# Check build output
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Frontend built (dist folder exists)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not built (no dist folder)${NC}"
fi

echo ""
echo -e "${GREEN}🎯 Debug Summary${NC}"
echo "=================="

if command -v node &> /dev/null && [ -f "package.json" ] && npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend: Ready for deployment${NC}"
else
    echo -e "${RED}❌ Frontend: Needs fixes${NC}"
fi

if [ -n "$BACKEND_FOUND" ] && [ -f "$BACKEND_FOUND/index.php" ]; then
    echo -e "${GREEN}✅ Backend: Ready for deployment${NC}"
else
    echo -e "${RED}❌ Backend: Needs fixes${NC}"
fi

if [ -d ".git" ] && git remote get-url origin > /dev/null; then
    echo -e "${GREEN}✅ Git: Ready for push${NC}"
else
    echo -e "${RED}❌ Git: Needs setup${NC}"
fi

echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Fix any ❌ issues above"
echo "2. Run: npm run build (if needed)"
echo "3. Run: git add . && git commit -m 'Ready for deployment'"
echo "4. Run: git push origin main"
echo "5. Deploy to your hosting provider"
echo ""
echo -e "${GREEN}🚀 Your Master Shirt Shop will be live soon!${NC}"
