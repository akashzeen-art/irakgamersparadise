#!/bin/bash

# Gamers Paradise - SSH Server Deployment Script

echo "🎮 Gamers Paradise - SSH Server Deployment"
echo "=========================================="

# Configuration
SERVER_HOST="142.93.209.116"
SERVER_USER="root"  # Replace with your actual SSH username
SERVER_PATH="/var/www/vasnumero/gamersparadisirak"
LOCAL_BUILD_DIR="dist"

# Build the project
echo "🔨 Building project..."
npm install
npm run build

if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Upload files to server
echo "📤 Uploading files to server..."
rsync -avz --delete $LOCAL_BUILD_DIR/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

# Upload configuration files
echo "📋 Uploading configuration files..."
scp .htaccess $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
scp nginx.conf $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

# Set proper permissions on server
echo "🔐 Setting permissions..."
ssh $SERVER_USER@$SERVER_HOST "chmod -R 755 $SERVER_PATH && chown -R www-data:www-data $SERVER_PATH"

echo "✅ Deployment completed!"
echo "🌐 Your site should be live at: https://gamersparadise.fun"
echo ""
echo "📝 Next steps:"
echo "1. Update nginx site config with the proxy rules from nginx.conf"
echo "2. Run: sudo nginx -t && sudo systemctl reload nginx"
echo "3. Set up SSL certificate for HTTPS"
echo "4. Test: curl 'https://gamersparadise.fun/api/subscription/status?subid=0&productcode=ZIQGP'"