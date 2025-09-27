#!/bin/bash

# AuraShift Backend Setup Script
# This script helps you set up the backend development environment

echo "🚀 Setting up AuraShift Backend..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        echo "📝 Creating .env file from env.example..."
        cp env.example .env
        echo "✅ .env file created"
        
        # Generate a random JWT secret
        if command -v openssl &> /dev/null; then
            JWT_SECRET=$(openssl rand -base64 32)
            # Replace the placeholder JWT secret in .env file
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s/your_super_secret_jwt_key_here_change_in_production/$JWT_SECRET/g" .env
            else
                # Linux
                sed -i "s/your_super_secret_jwt_key_here_change_in_production/$JWT_SECRET/g" .env
            fi
            echo "🔐 Generated secure JWT secret"
        else
            echo "⚠️  Please manually generate a JWT secret using: openssl rand -base64 32"
        fi
    else
        echo "❌ env.example file not found"
        exit 1
    fi
else
    echo "✅ .env file already exists"
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    # MongoDB Shell (mongosh) is available
    if mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running and accessible"
    else
        echo "⚠️  MongoDB is not running or not accessible"
        echo "   Please start MongoDB with: mongod"
        echo "   Or install MongoDB from: https://docs.mongodb.com/manual/installation/"
    fi
elif command -v mongo &> /dev/null; then
    # Legacy MongoDB Shell (mongo) is available
    if mongo --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running and accessible"
    else
        echo "⚠️  MongoDB is not running or not accessible"
        echo "   Please start MongoDB with: mongod"
    fi
else
    echo "⚠️  MongoDB client not found"
    echo "   Please install MongoDB from: https://docs.mongodb.com/manual/installation/"
fi

echo ""
echo "🎉 Setup completed!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Review and update the .env file if needed"
echo "2. Make sure MongoDB is running"
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "The API will be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/api/health"
echo ""
echo "Happy coding! 🚀"
