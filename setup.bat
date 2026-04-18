@echo off
REM KOT Tech News AI - Quick Setup Script for Windows

echo.
echo 🚀 KOT Tech News AI - Setup Script
echo ====================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+
    exit /b 1
)

echo ✓ Node.js detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Generate Prisma Client
echo 🔧 Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma Client
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

REM Create .env.local if doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local template...
    (
        echo # Database
        echo DATABASE_URL="postgresql://user:password@localhost:5432/kot_news_ai"
        echo.
        echo # OpenAI API
        echo OPENAI_API_KEY="sk_your_key_here"
        echo.
        echo # Facebook Graph API
        echo FACEBOOK_PAGE_ACCESS_TOKEN="your_page_access_token"
        echo FACEBOOK_PAGE_ID="your_page_id"
        echo FACEBOOK_APP_ID="your_app_id"
        echo FACEBOOK_APP_SECRET="your_app_secret"
        echo.
        echo # Security
        echo CRON_SECRET="your-random-secret-here-at-least-32-chars"
        echo.
        echo # Deployment
        echo VERCEL_URL="http://localhost:3000"
        echo VERCEL_ENV="development"
        echo NODE_ENV="development"
        echo.
        echo # Logging
        echo LOG_LEVEL="info"
    ) > .env.local
    echo ✓ Created .env.local (PLEASE FILL IN YOUR CREDENTIALS)
) else (
    echo ✓ .env.local already exists
)
echo.

REM Build project
echo 🏗️  Building project...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed. Check errors above.
    exit /b 1
)
echo ✓ Build successful
echo.

echo ✨ Setup Complete!
echo.
echo Next steps:
echo 1. Configure .env.local with your credentials
echo 2. Set up database: npx prisma migrate dev
echo 3. Start dev server: npm run dev
echo 4. Open dashboard: http://localhost:3000/dashboard
echo.
echo For detailed setup instructions, see DEPLOYMENT.md
echo.
pause
