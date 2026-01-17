#!/bin/bash

echo "🚀 Deploying Master Shirt Shop to Netlify..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
npx netlify deploy --prod --dir=dist --force

echo "✅ Deployment complete!"
echo "🌍 Your Master Shirt Shop is now live at: https://master-shirt-shop.netlify.app"
