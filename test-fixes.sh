#!/bin/bash

# Test script to fix foreign key constraints and verify functionality
# This script should be run from the project root directory

echo "🔧 Starting database fix process..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Please start MySQL first."
    exit 1
fi

echo "✅ MySQL is running"

# Run the foreign key fix script
echo "🗃️  Applying foreign key constraint fixes..."
mysql -u root -p jossaDATABASE < fix_foreign_keys.sql

if [ $? -eq 0 ]; then
    echo "✅ Foreign key constraints fixed successfully"
else
    echo "❌ Failed to apply foreign key fixes"
    exit 1
fi

echo "🚀 Starting the server to test functionality..."

# Navigate to server directory and start the server
cd server

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

# Start the server in background
echo "🌐 Starting Node.js server..."
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully (PID: $SERVER_PID)"
else
    echo "❌ Failed to start server"
    exit 1
fi

echo "🎉 Database fixes applied and server is running!"
echo "📝 You can now test the following:"
echo "   - User registration and deletion"
echo "   - Candidate CRUD operations"
echo "   - Profile updates"
echo ""
echo "🛑 To stop the server, run: kill $SERVER_PID"
echo "📊 Check server logs for any errors"

# Keep the server running
wait $SERVER_PID