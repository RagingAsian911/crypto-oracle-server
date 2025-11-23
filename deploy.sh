#!/bin/bash

echo "=========================================="
echo "   ORACLESIGNAL — FULL SYSTEM DEPLOYER"
echo "=========================================="

# Where everything will live
BASE_DIR="/var/www/oraclesignal"
mkdir -p $BASE_DIR
cd $BASE_DIR

echo "[1/8] Updating system..."
sudo apt update -y
sudo apt install -y git curl nodejs npm

echo "[2/8] Installing PM2 (process manager)..."
sudo npm install -g pm2

echo "[3/8] Cloning GitHub repositories..."

# Backend — automation engine
if [ -d "crypto-oracle-server" ]; then rm -rf crypto-oracle-server; fi
git clone https://github.com/RagingAsian911/crypto-oracle-server.git

# Main revenue site
if [ -d "bbw-temple-site" ]; then rm -rf bbw-temple-site; fi
git clone https://github.com/RagingAsian911/bbw-temple-site.git

# Microservice template
if [ -d "express-hello-world" ]; then rm -rf express-hello-world; fi
git clone https://github.com/RagingAsian911/express-hello-world.git

# Marketing funnel
if [ -d "frida-website" ]; then rm -rf frida-website; fi
git clone https://github.com/RagingAsian911/frida-website.git


echo "[4/8] Installing crypto-oracle-server dependencies..."
cd $BASE_DIR/crypto-oracle-server
npm install --production

echo "[5/8] Creating .env file from template..."
if [ ! -f ".env" ]; then cp .env.example .env; fi
echo "⚠️ Edit .env after deployment to insert your real keys."

echo "[6/8] Launching crypto-oracle-server..."
pm2 stop oracle-server 2>/dev/null
pm2 start MAIN.JS --name oracle-server
pm2 save

echo "[7/8] Installing express-hello-world dependencies..."
cd $BASE_DIR/express-hello-world
npm install --production
pm2 stop express-hello 2>/dev/null
pm2 start server.js --name express-hello
pm2 save

echo "[8/8] Preparing static sites (bbw-temple-site + frida-website)..."
echo "Upload these folders to any static host or bind them to nginx:"
echo " - $BASE_DIR/bbw-temple-site"
echo " - $BASE_DIR/frida-website"

echo "=========================================="
echo "     DEPLOYMENT COMPLETE"
echo "  PM2 Services Running:"
pm2 list
echo "=========================================="