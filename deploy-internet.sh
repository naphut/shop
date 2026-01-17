#!/bin/bash

# Master Shirt Shop - Internet Deployment Script
echo "🌐 Master Shirt Shop - Internet Deployment"
echo "=========================================="

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Installing..."
        case $1 in
            "vercel")
                npm i -g vercel
                ;;
            "railway")
                npm i -g @railway/cli
                ;;
            "netlify")
                npm i -g netlify-cli
                ;;
        esac
    else
        echo "✅ $1 is installed"
    fi
}

# Build frontend
echo "📦 Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✅ Frontend built successfully"

# Check environment variables
echo "🔧 Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your actual values"
else
    echo "✅ .env file found"
fi

# Check if Gemini API key is set
if grep -q "AIzaSyCU0lxbL9HUjvOW5_CeoMs9X-EOEFOSjrE" .env; then
    echo "✅ Gemini API key is configured"
else
    echo "⚠️  Gemini API key not found in .env"
fi

# Deployment options
echo ""
echo "🚀 Choose deployment option:"
echo "1) Vercel (Frontend) + Railway (Backend) - Recommended"
echo "2) Netlify (Frontend) + Railway (Backend)"
echo "3) Vercel (Frontend only - manual backend)"
echo "4) Build package for manual deployment"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🌟 Deploying to Vercel + Railway..."
        
        # Check tools
        check_tool "vercel"
        check_tool "railway"
        
        # Deploy backend first
        echo "📚 Deploying backend to Railway..."
        cd backend
        railway login
        railway init
        railway up
        BACKEND_URL=$(railway domain)
        cd ..
        
        # Deploy frontend
        echo "🎨 Deploying frontend to Vercel..."
        vercel --prod
        
        echo "✅ Deployment complete!"
        echo "🔗 Backend: https://$BACKEND_URL"
        echo "🔗 Frontend: Check Vercel output above"
        ;;
        
    2)
        echo "🌐 Deploying to Netlify + Railway..."
        
        check_tool "netlify"
        check_tool "railway"
        
        # Deploy backend
        echo "📚 Deploying backend to Railway..."
        cd backend
        railway login
        railway init
        railway up
        BACKEND_URL=$(railway domain)
        cd ..
        
        # Deploy frontend
        echo "🎨 Deploying frontend to Netlify..."
        netlify deploy --prod --dir=dist
        
        echo "✅ Deployment complete!"
        echo "🔗 Backend: https://$BACKEND_URL"
        echo "🔗 Frontend: Check Netlify output above"
        ;;
        
    3)
        echo "🎨 Deploying frontend to Vercel only..."
        check_tool "vercel"
        vercel --prod
        echo "✅ Frontend deployed! Remember to configure your backend URL."
        ;;
        
    4)
        echo "📦 Creating deployment package..."
        PACKAGE_DIR="master-shirt-shop-$(date +%Y%m%d)"
        rm -rf $PACKAGE_DIR
        mkdir -p $PACKAGE_DIR
        
        # Copy built frontend
        cp -r dist $PACKAGE_DIR/frontend
        
        # Copy backend
        cp -r backend $PACKAGE_DIR/
        
        # Copy configuration files
        cp vercel.json $PACKAGE_DIR/
        cp netlify.toml $PACKAGE_DIR/
        cp railway.toml $PACKAGE_DIR/backend/
        cp .env.example $PACKAGE_DIR/.env.example
        
        # Create instructions
        cat > $PACKAGE_DIR/README.md << 'EOF'
# Master Shirt Shop - Deployment Package

## Quick Start

### Option 1: Vercel + Railway
```bash
# Frontend
vercel --prod

# Backend
cd backend
railway up
```

### Option 2: Netlify + Railway
```bash
# Frontend
netlify deploy --prod --dir=frontend

# Backend
cd backend
railway up
```

## Environment Variables

### Frontend
- VITE_API_URL: Your backend URL
- GEMINI_API_KEY: Your Gemini API key

### Backend
- DB_HOST: Database host
- DB_NAME: Database name
- DB_USER: Database user
- DB_PASS: Database password
- JWT_SECRET: JWT secret key

## Default Credentials
- Admin: admin@master.com / admin123
- Test User: user@test.com / user123

Good luck! 🚀
EOF
        
        echo "✅ Package created: $PACKAGE_DIR"
        echo "📋 Upload this folder to your hosting provider"
        ;;
        
    5)
        echo "👋 Exiting..."
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment completed!"
echo "📞 If you need help, check INTERNET_SETUP_GUIDE.md"
echo "🌍 Your Master Shirt Shop is now on the internet!"
