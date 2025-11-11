#!/bin/bash

# Simple script to just apply the foreign key fixes
# Run this script to fix the database constraints

echo "🔧 Applying foreign key constraint fixes to resolve cascade issues..."

# Check if the fix file exists
if [ ! -f "fix_foreign_keys.sql" ]; then
    echo "❌ fix_foreign_keys.sql not found in current directory"
    exit 1
fi

echo "📝 Please enter your MySQL root password when prompted..."

# Apply the fixes
mysql -u root -p jossaDATABASE < fix_foreign_keys.sql

if [ $? -eq 0 ]; then
    echo "✅ Foreign key constraints fixed successfully!"
    echo "🎉 The following issues should now be resolved:"
    echo "   ✓ User deletion will now properly cascade"
    echo "   ✓ Candidate updates and deletes will work correctly"
    echo "   ✓ No more foreign key constraint violations"
    echo "   ✓ Profile updates should work properly"
    echo ""
    echo "🚀 You can now restart your server and test the functionality!"
else
    echo "❌ Failed to apply foreign key fixes"
    echo "📋 Please check:"
    echo "   - MySQL is running"
    echo "   - Database 'jossaDATABASE' exists"
    echo "   - You have proper MySQL permissions"
    exit 1
fi