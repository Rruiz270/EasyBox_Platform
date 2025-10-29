#!/bin/bash

# EasyBox Platform Start Script for Railway
echo "🚀 Starting EasyBox Platform Backend..."

# Navigate to backend directory
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start the application
echo "🎯 Starting Node.js server..."
npm start