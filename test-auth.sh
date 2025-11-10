#!/bin/bash

# Authentication System Test Script
# Run this to verify your authentication setup

echo "🔐 Testing Wellness Cafe Authentication System"
echo "=============================================="
echo ""

# Check 1: .env.local file exists
echo "✓ Check 1: Environment Configuration"
if [ -f ".env.local" ]; then
    echo "  ✅ .env.local file found"
    
    # Check if it has Firebase keys
    if grep -q "REACT_APP_FIREBASE_API_KEY" .env.local; then
        echo "  ✅ Firebase API key configured"
    else
        echo "  ❌ Firebase API key missing in .env.local"
        echo "     Add: REACT_APP_FIREBASE_API_KEY=your_key_here"
    fi
    
    if grep -q "REACT_APP_FIREBASE_PROJECT_ID" .env.local; then
        echo "  ✅ Firebase Project ID configured"
    else
        echo "  ❌ Firebase Project ID missing in .env.local"
    fi
else
    echo "  ❌ .env.local file NOT found"
    echo "     You need to create this file with your Firebase credentials"
    echo "     See AUTH_SYSTEM_STATUS.md for instructions"
fi
echo ""

# Check 2: Firebase files exist
echo "✓ Check 2: Firebase Files"
files=(
    "src/firebase.js"
    "src/firebase/firebaseConfig.js"
    "src/AuthContext.js"
    "src/components/Login.js"
    "src/features/auth/Signup.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
    fi
done
echo ""

# Check 3: Node modules installed
echo "✓ Check 3: Dependencies"
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules installed"
    
    # Check for key packages
    if [ -d "node_modules/firebase" ]; then
        echo "  ✅ Firebase package installed"
    else
        echo "  ❌ Firebase package missing (run: npm install)"
    fi
    
    if [ -d "node_modules/react-router-dom" ]; then
        echo "  ✅ React Router installed"
    else
        echo "  ❌ React Router missing (run: npm install)"
    fi
else
    echo "  ❌ node_modules not found (run: npm install)"
fi
echo ""

# Check 4: Build status
echo "✓ Check 4: Build Status"
if [ -d "build" ]; then
    echo "  ✅ Production build exists"
    echo "  Last built: $(stat -f %Sm -t "%Y-%m-%d %H:%M" build 2>/dev/null || stat -c %y build 2>/dev/null | cut -d' ' -f1-2)"
else
    echo "  ⚠️  No production build found"
    echo "     Run: npm run build"
fi
echo ""

# Check 5: Firebase CLI
echo "✓ Check 5: Deployment Tools"
if command -v firebase &> /dev/null; then
    echo "  ✅ Firebase CLI installed"
    firebase_version=$(firebase --version)
    echo "     Version: $firebase_version"
else
    echo "  ⚠️  Firebase CLI not installed (deployment only)"
    echo "     Install: npm install -g firebase-tools"
fi
echo ""

# Summary
echo "=============================================="
echo "📋 Summary"
echo "=============================================="

if [ -f ".env.local" ] && [ -d "node_modules" ]; then
    echo "✅ Core setup looks good!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Run: npm start"
    echo "2. Go to: http://localhost:3000/signup"
    echo "3. Create a test account"
    echo "4. Check your email for verification"
    echo ""
    echo "📚 Documentation: AUTH_SYSTEM_STATUS.md"
else
    echo "⚠️  Setup incomplete"
    echo ""
    echo "🔧 Required actions:"
    if [ ! -f ".env.local" ]; then
        echo "1. Create .env.local with Firebase credentials"
    fi
    if [ ! -d "node_modules" ]; then
        echo "2. Run: npm install"
    fi
    echo ""
    echo "📚 See AUTH_SYSTEM_STATUS.md for detailed instructions"
fi

echo ""
echo "🧪 Manual Tests Required:"
echo "- Sign up with email/password"
echo "- Sign in with existing account"
echo "- Sign in with Google OAuth"
echo "- Check email verification"
echo "- Test protected routes"
echo ""
echo "For detailed testing checklist, see AUTH_SYSTEM_STATUS.md"
