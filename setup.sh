#!/bin/bash
# KOT Tech News AI - Quick Setup Script

echo "🚀 KOT Tech News AI - Setup Script"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✓ Node.js $(node --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi
echo "✓ Prisma Client generated"
echo ""

# Create .env.local if doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kot_news_ai"

# OpenAI API
OPENAI_API_KEY="sk_your_key_here"

# Facebook Graph API
FACEBOOK_PAGE_ACCESS_TOKEN="your_page_access_token"
FACEBOOK_PAGE_ID="your_page_id"
FACEBOOK_APP_ID="your_app_id"
FACEBOOK_APP_SECRET="your_app_secret"

# Security
CRON_SECRET="your-random-secret-here-at-least-32-chars"

# Deployment
VERCEL_URL="http://localhost:3000"
VERCEL_ENV="development"
NODE_ENV="development"

# Logging
LOG_LEVEL="info"
EOF
    echo "✓ Created .env.local (PLEASE FILL IN YOUR CREDENTIALS)"
else
    echo "✓ .env.local already exists"
fi
echo ""

# Check DATABASE_URL
if grep -q "DATABASE_URL" .env.local; then
    echo "⚠️  Please configure DATABASE_URL in .env.local"
    echo "   Instructions: See DEPLOYMENT.md"
fi
echo ""

# Build project
echo "🏗️  Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Check errors above."
    exit 1
fi
echo "✓ Build successful"
echo ""

echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env.local with your credentials"
echo "2. Set up database: npx prisma migrate dev"
echo "3. Start dev server: npm run dev"
echo "4. Open dashboard: http://localhost:3000/dashboard"
echo ""
echo "For detailed setup instructions, see DEPLOYMENT.md"
