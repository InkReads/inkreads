# Deployment Instructions for Inkreads

This guide explains how to deploy the Inkreads application to an EC2 instance.

## Prerequisites

1. An AWS EC2 instance running Amazon Linux 2023 (recommended: t2.micro or larger)
2. A domain name pointing to your EC2 instance (optional)
3. SSH access to your EC2 instance
4. Your EC2 key pair file (e.g., `ink_reads_key.pem`)

## Initial Setup

1. **Set up your SSH key:**
   ```bash
   # Move your key file to a safe location
   mv ~/Downloads/ink_reads_key.pem ~/.ssh/
   
   # Set correct permissions
   chmod 400 ~/.ssh/ink_reads_key.pem
   ```

2. **Configure your domain (if using one):**
   ```bash
   # In your domain registrar (e.g., GoDaddy, Namecheap):
   # 1. Add A record:
   #    - Host: @ or theinkreads.com
   #    - Points to: Your EC2 IP (e.g., 13.57.117.138)
   # 2. Add CNAME record:
   #    - Host: www
   #    - Points to: theinkreads.com
   
   # Wait for DNS propagation (can take up to 48 hours)
   # You can check propagation with:
   dig theinkreads.com
   ```

3. **Test SSH connection:**
   ```bash
   # Using IP address (recommended for initial setup)
   ssh -i ~/.ssh/ink_reads_key.pem ec2-user@13.57.117.138
   
   # Or using domain name (after DNS propagation)
   ssh -i ~/.ssh/ink_reads_key.pem ec2-user@theinkreads.com
   ```

## Deployment Structure

```
deployment/
├── config/
│   └── nginx.conf         # Nginx configuration
├── deploy-scp.sh         # Main deployment script
├── setup.sh             # Server setup script
└── ecosystem.config.js  # PM2 configuration
```

## Deployment Steps

1. **Prepare your local environment:**
   ```bash
   # Make deployment scripts executable
   chmod +x deployment/deploy-scp.sh
   chmod +x deployment/setup.sh
   ```

2. **Run the deployment script:**
   ```bash
   # From your project root
   ./deployment/deploy-scp.sh /path/to/your-key.pem ec2-user@your-ec2-ip
   ```

   This script will:
   - Create a temporary directory for deployment
   - Copy project files to EC2
   - Set up necessary directories
   - Run the setup script

3. **The setup script will automatically:**
   - Update system packages
   - Install Node.js 20 via NVM
   - Install pnpm and PM2 globally
   - Install Nginx and Certbot
   - Set up SSL certificates
   - Configure Nginx
   - Start the application with PM2

## Configuration Files

### ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'inkreads',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### nginx.conf
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    # ... SSL configuration ...
}
```

## Post-deployment Steps

1. **Check application status:**
   ```bash
   pm2 status
   ```

2. **View logs:**
   ```bash
   # Application logs
   pm2 logs inkreads
   
   # Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Monitor the application:**
   ```bash
   pm2 monit
   ```

## SSL Configuration

The setup script automatically:
1. Installs Certbot
2. Obtains SSL certificates for your domain
3. Configures Nginx for HTTPS
4. Sets up automatic certificate renewal

## Directory Structure on Server

```
/var/www/inkreads/
├── .next/              # Next.js build output
├── node_modules/       # Dependencies
├── public/            # Static files
├── src/               # Source code
├── deployment/        # Deployment scripts
├── ecosystem.config.js # PM2 configuration
└── .env.production    # Production environment variables
```

## Troubleshooting

1. **If the application isn't accessible:**
   ```bash
   # Check application status
   pm2 status
   
   # Check Nginx status
   sudo systemctl status nginx
   
   # Check application logs
   pm2 logs inkreads
   
   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   
   # Verify SSL certificate
   sudo certbot certificates
   ```

2. **If you need to restart the application:**
   ```bash
   pm2 restart inkreads
   ```

3. **If you need to rebuild the application:**
   ```bash
   cd /var/www/inkreads
   pnpm install
   pnpm run build
   pm2 restart inkreads
   ```

4. **If SSL isn't working:**
   ```bash
   # Check SSL certificate
   sudo certbot certificates
   
   # Renew SSL certificate
   sudo certbot renew
   
   # Check Nginx SSL configuration
   sudo nginx -t
   ```

## Security Considerations

1. **Security Group Rules:**
   - SSH (22): Your IP only
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0

2. **File Permissions:**
   ```bash
   # Set correct permissions for key file
   chmod 400 /path/to/your-key.pem
   ```

3. **Environment Variables:**
   - Keep sensitive data in `.env.production`
   - Never commit `.env` files to git

## Backup & Recovery

1. **Backup application files:**
   ```bash
   tar -czf backup.tar.gz /var/www/inkreads
   ```

2. **Backup Nginx config:**
   ```bash
   sudo cp /etc/nginx/conf.d/inkreads.conf /etc/nginx/conf.d/inkreads.conf.backup
   ```

3. **Backup SSL certificates:**
   ```bash
   sudo cp -r /etc/letsencrypt /etc/letsencrypt.backup
   ``` 