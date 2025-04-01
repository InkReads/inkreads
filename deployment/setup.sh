#!/bin/bash

# Update system packages
sudo yum update -y

# Install Node.js and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 20
nvm use 20

# Install pnpm globally
npm install -g pnpm

# Install PM2 globally
npm install -g pm2

# Install Nginx and Certbot
sudo yum install nginx -y
sudo yum install -y epel-release
sudo yum install -y certbot python3-certbot-nginx

# Create app directory if it doesn't exist
sudo mkdir -p /var/www/inkreads
sudo chown ec2-user:ec2-user /var/www/inkreads

# Install dependencies
pnpm install

# Build the application
pnpm run build

# Copy Nginx configuration
sudo cp deployment/config/nginx.conf /etc/nginx/conf.d/inkreads.conf
sudo rm -f /etc/nginx/conf.d/default.conf

# Stop Nginx temporarily for SSL certificate installation
sudo systemctl stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d theinkreads.com -d www.theinkreads.com --non-interactive --agree-tos --email 1henrytran@gmail.com

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Test Nginx configuration
sudo nginx -t

# Start the application with PM2
pm2 delete all || true
pm2 start ecosystem.config.js --env production

# Save PM2 process list and configure to start on system startup
pm2 save
sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v20/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user 