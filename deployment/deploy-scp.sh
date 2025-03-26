#!/bin/bash

# Check if key file and host are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <path-to-key-file> <ec2-host>"
    echo "Example: $0 ~/my-key.pem ec2-user@ec2-xx-xx-xx-xx.compute-1.amazonaws.com"
    exit 1
fi

KEY_FILE=$1
EC2_HOST=$2

# Create a temporary directory for the files to transfer
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Create the deployment package
echo "Creating deployment package..."
# Only copy the current project files
cp -r . $TEMP_DIR/
cd $TEMP_DIR

# Remove unnecessary files and macOS metadata
echo "Cleaning up unnecessary files..."
rm -rf node_modules .next .git .env.local coverage
find . -type f -name "._*" -delete
find . -type f -name ".DS_Store" -delete
find . -type f -name ".AppleDouble" -delete
find . -type f -name ".LSOverride" -delete

# Create a tar file
cd ..
tar --exclude="._*" --exclude=".DS_Store" --exclude=".AppleDouble" --exclude=".LSOverride" -czf deploy.tar.gz -C "$TEMP_DIR" .

# Transfer the tar file to EC2
echo "Transferring files to EC2..."
scp -i $KEY_FILE deploy.tar.gz $EC2_HOST:/home/ec2-user/

# SSH into the instance and set up the application
echo "Setting up the application on EC2..."
ssh -i $KEY_FILE $EC2_HOST "
    echo 'Cleaning up old files...'
    sudo rm -rf /var/www/inkreads/*
    sudo mkdir -p /var/www/inkreads
    sudo chown ec2-user:ec2-user /var/www/inkreads
    
    echo 'Extracting new files...'
    tar -xzf deploy.tar.gz -C /var/www/inkreads
    cd /var/www/inkreads
    
    # Clean up any remaining macOS metadata files
    echo 'Cleaning up metadata files...'
    find . -type f -name '._*' -delete
    find . -type f -name '.DS_Store' -delete
    find . -type f -name '.AppleDouble' -delete
    find . -type f -name '.LSOverride' -delete
    
    # Install dependencies
    echo 'Installing dependencies...'
    pnpm install
    
    # Build with retry mechanism
    echo 'Building application...'
    MAX_RETRIES=3
    RETRY_COUNT=0
    

    
    rm -f ~/deploy.tar.gz
    
    
"

# Clean up
rm -rf $TEMP_DIR deploy.tar.gz
echo "Cleaned up temporary files"

echo "Deployment complete!" 