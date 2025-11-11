#!/bin/bash

# JOSAA Authentication Testing Script
# This script helps test the authentication and authorization system

echo "🔐 JOSAA Authentication Testing Script"
echo "======================================"
echo ""

API_BASE="http://localhost:5000/api"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Public Access (Should work without auth)
echo "📋 Test 1: Public Access Tests"
echo "------------------------------"

echo -n "1.1 Get Seat Matrix (public): "
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/seat-matrix")
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Status: $response)"
else
    echo -e "${RED}✗ FAILED${NC} (Status: $response)"
fi

echo -n "1.2 Get Opening/Closing Ranks (public): "
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/opening-closing-ranks")
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Status: $response)"
else
    echo -e "${RED}✗ FAILED${NC} (Status: $response)"
fi

echo -n "1.3 Get Institutes (public): "
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/institutes")
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Status: $response)"
else
    echo -e "${RED}✗ FAILED${NC} (Status: $response)"
fi

echo ""

# Test 2: Protected Routes Without Auth (Should fail)
echo "🔒 Test 2: Protected Routes Without Authentication"
echo "--------------------------------------------------"

echo -n "2.1 Get Candidates without auth: "
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/candidates")
if [ "$response" -eq 401 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Correctly denied: $response)"
else
    echo -e "${RED}✗ FAILED${NC} (Should be 401, got: $response)"
fi

echo -n "2.2 Get Allocations without auth: "
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/allocations")
if [ "$response" -eq 401 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Correctly denied: $response)"
else
    echo -e "${RED}✗ FAILED${NC} (Should be 401, got: $response)"
fi

echo -n "2.3 Get Choices without auth: "
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/choices/candidate/1")
if [ "$response" -eq 401 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Correctly denied: $response)"
else
    echo -e "${RED}✗ FAILED${NC} (Should be 401, got: $response)"
fi

echo ""

# Test 3: Login Tests
echo "🔑 Test 3: Authentication Tests"
echo "-------------------------------"

# Note: These tests require actual user accounts in the database
echo -e "${YELLOW}Note: The following tests require valid user credentials in the database${NC}"

echo ""
echo "Example login test (requires valid credentials):"
echo "curl -X POST $API_BASE/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"identifier\": \"student@email.com\", \"password\": \"password123\"}'"

echo ""

# Test 4: With Authentication Headers
echo "🎫 Test 4: Authenticated Requests (Manual Test)"
echo "-----------------------------------------------"
echo "To test authenticated requests, first login and then use the returned user data:"
echo ""
echo "# 1. Login"
echo "response=\$(curl -X POST $API_BASE/auth/login -H 'Content-Type: application/json' -d '{...}')"
echo ""
echo "# 2. Extract user data and use in headers"
echo "curl -X GET $API_BASE/candidates \\"
echo "  -H 'x-user-id: <userID>' \\"
echo "  -H 'x-user-role: Student' \\"
echo "  -H 'x-candidate-id: <candidateID>'"

echo ""
echo "======================================"
echo "✅ Public access tests completed"
echo "🔒 Protected route tests completed"
echo ""
echo "💡 To test full authentication flow:"
echo "   1. Start the server: cd server && npm start"
echo "   2. Start the client: cd client && npm run dev"
echo "   3. Open browser and test login functionality"
echo ""
