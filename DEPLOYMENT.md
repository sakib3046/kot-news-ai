# Deployment Guide - KOT Tech News AI

Complete step-by-step guide to deploy to Vercel with Facebook integration.

## 📋 Pre-Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Git repository initialized and pushed to GitHub
- [ ] OpenAI API key created
- [ ] Facebook Page created with admin access
- [ ] Vercel account created
- [ ] PostgreSQL database ready (Vercel Postgres or external)

## 🔑 Step 1: Get Facebook API Credentials

### 1.1 Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Business" as app type
4. Fill in app name: "KOT Tech News AI"
5. Create app
6. Save **App ID** and **App Secret**

### 1.2 Add Pages Product

1. In your app, click "+ Add Product"
2. Search for "Pages" and click "Set Up"
3. This adds Facebook Pages functionality

### 1.3 Create/Link Facebook Page

1. If you don't have a Facebook Page:
   - Go to [Facebook Pages](https://www.facebook.com/pages/create)
   - Create a new page (e.g., "KOT Tech News")
   - Get your **Page ID** from the page URL or Settings

2. If you have an existing page:
   - Get your Page ID from page Settings → About

### 1.4 Generate Page Access Token

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer)
2. In the toolbar:
   - Select your app in the first dropdown
   - Change from "User Token" to "Page Token"
   - Select your page from the dropdown
3. Click "Generate Access Token"
4. Grant these permissions:
   - ✓ pages_manage_metadata
   - ✓ pages_read_engagement
   - ✓ pages_manage_posts
   - ✓ pages_read_user_content
5. Copy the **Page Access Token** (long alphanumeric string)
6. This token should be valid for ~2 months (auto-renewing)

## 🔑 Step 2: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Click "API Keys" in sidebar
3. Click "+ Create new secret key"
4. Name it "KOT News AI"
5. Copy the key immediately (can't be viewed again)
6. Store securely

## 📦 Step 3: Set Up Database

### Option A: Vercel Postgres (Recommended)

```bash
npm install @vercel/postgres
npx prisma db push
```

Or use Vercel dashboard:
1. Go to Vercel Dashboard → Storage
2. Click "Create Database"
3. Select "Postgres"
4. Name: "kot-news-ai"
5. Select region
6. Create database
7. Copy connection string

### Option B: Self-Hosted PostgreSQL

Install PostgreSQL locally or use managed service:
```bash
createdb kot_news_ai
# Set DATABASE_URL in .env.local
```

### Option C: Other Managed PostgreSQL

- Railway.app
- Render.com
- AWS RDS
- DigitalOcean

## 🚀 Step 4: Local Setup & Testing

### 4.1 Configure Environment

Create `.env.local`:

```env
# Database - Replace with your connection string
DATABASE_URL="postgresql://user:password@localhost:5432/kot_news_ai"

# OpenAI
OPENAI_API_KEY="sk_..." # Your OpenAI key

# Facebook - From steps above
FACEBOOK_PAGE_ACCESS_TOKEN="EAAC..." # Your page token
FACEBOOK_PAGE_ID="123456789" # Your page ID
FACEBOOK_APP_ID="987654321" # Your app ID
FACEBOOK_APP_SECRET="abc123def456..." # Your app secret

# Security - Create a random secret
CRON_SECRET="your-random-secret-here-at-least-32-chars"

# Deployment
VERCEL_URL="http://localhost:3000"
VERCEL_ENV="development"
NODE_ENV="development"

# Logging
LOG_LEVEL="info"
```

### 4.2 Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# View data
npx prisma studio
# Opens http://localhost:5555 in browser
```

### 4.3 Test Locally

```bash
# Start dev server
npm run dev

# Visit dashboard
open http://localhost:3000/dashboard

# Test RSS fetch
curl http://localhost:3000/api/rss/fetch

# Test processing
curl -X POST http://localhost:3000/api/cron/process
```

## 🌐 Step 5: Deploy to Vercel

### 5.1 Push to GitHub

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit: KOT Tech News AI"

# Add GitHub remote
git remote add origin https://github.com/yourusername/kot-news-ai
git push -u origin main
```

### 5.2 Create Vercel Project

Option A: CLI
```bash
npm i -g vercel
vercel
# Select "GitHub" as import source
# Authorize Vercel on GitHub
# Select repository
```

Option B: Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from Git (connect GitHub)
4. Select repository
5. Click "Import"

### 5.3 Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

Add all variables from `.env.local`:

| Key | Value | Notes |
|-----|-------|-------|
| DATABASE_URL | postgresql://... | Your database URL |
| OPENAI_API_KEY | sk_... | Your OpenAI key |
| FACEBOOK_PAGE_ACCESS_TOKEN | EAAC... | Your page token |
| FACEBOOK_PAGE_ID | 123456 | Your page ID |
| FACEBOOK_APP_ID | 987654 | Your app ID |
| FACEBOOK_APP_SECRET | abc123... | Your app secret |
| CRON_SECRET | random-secret | Random 32+ char string |
| VERCEL_URL | your-domain.vercel.app | Your Vercel domain |
| NODE_ENV | production | Set to production |

### 5.4 Deploy

```bash
vercel --prod
```

Or just push to main branch (auto-deploys):
```bash
git push origin main
```

## ✅ Step 6: Verify Deployment

### 6.1 Check Build

In Vercel Dashboard:
- Deployments tab shows build status
- Should see ✓ Deployed successfully

### 6.2 Test Endpoints

```bash
# Get dashboard
curl https://your-app.vercel.app/dashboard

# Check RSS status
curl https://your-app.vercel.app/api/rss/fetch

# Check processing status
curl https://your-app.vercel.app/api/cron/process
```

### 6.3 View Logs

```bash
vercel logs
# or in Vercel Dashboard → Deployments → Runtime Logs
```

### 6.4 Test Database Connection

In Vercel Dashboard → Functions:
- Should see no errors in logs
- Functions should execute within 5 seconds

## ⏱️ Step 7: Enable Cron Jobs

Cron jobs are defined in `vercel.json` - already configured!

Current schedule:
- **RSS Fetch**: Every 6 hours (0 */6 * * *)
- **Article Processing**: Every 30 minutes (*/30 * * * *)

### To Change Schedule:

Edit `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/rss/fetch",
      "schedule": "0 * * * *"  // Change to every hour
    },
    {
      "path": "/api/cron/process",
      "schedule": "0 * * * *"   // Change to hourly
    }
  ]
}
```

Then push to trigger re-deploy:
```bash
git commit -am "Update cron schedule" && git push
```

## 📊 Step 8: Monitor & Manage

### 8.1 Dashboard

Visit: `https://your-app.vercel.app/dashboard`

Features:
- Real-time statistics
- Manual trigger buttons
- Articles per source breakdown

### 8.2 Database Management

```bash
# Query database
npx prisma studio

# Run migrations
npx prisma migrate deploy

# Check schema
npx prisma generate
```

### 8.3 Logs & Monitoring

**Vercel Logs:**
```bash
vercel logs --function
vercel logs https://your-app.vercel.app/api/rss/fetch
```

**Function Details:**
- Go to Vercel Dashboard → your project → Functions
- See invocation count, duration, logs

### 8.4 Facebook Insights

1. Go to your Facebook Page
2. Click "Insights"
3. View post performance
4. Track engagement metrics

## 🐛 Troubleshooting

### Cron Jobs Not Running

**Check:**
- Vercel Pro plan or higher (Free doesn't support crons)
- `vercel.json` exists in root
- Endpoints return 200 status

**Fix:**
```bash
# Check cron status
vercel crons --list

# Test endpoint manually
curl -X POST https://your-app.vercel.app/api/rss/fetch \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Database Connection Errors

**Check:**
- DATABASE_URL in Vercel environment variables
- Database is running and accessible
- Connection string is correct

**Fix:**
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Or use Prisma
npx prisma db execute --stdin <<< "SELECT 1"
```

### Facebook Posting Fails

**Check:**
- Page access token is valid
- Page ID is correct
- Permissions granted on app
- Image URL is publicly accessible

**Fix:**
```bash
# Test token
curl https://graph.facebook.com/me?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN

# Check permissions
curl "https://graph.facebook.com/$FACEBOOK_PAGE_ID?fields=name&access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"
```

### OpenAI API Errors

**Check:**
- API key is valid
- Quota/billing is active
- Rate limits not exceeded

**Fix:**
- Check OpenAI dashboard for usage
- Ensure balance is positive
- Wait between requests (built-in)

### Articles Not Processing

**Check:**
- RSS feeds are returning content
- No articles in database yet
- Job logs in database

**Fix:**
```bash
# Manually trigger RSS fetch
curl -X POST https://your-app.vercel.app/api/rss/fetch \
  -H "Authorization: Bearer $CRON_SECRET"

# Check database
npx prisma studio
# Browse Article table
```

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use Vercel environment variables only
   - Rotate secrets monthly

2. **API Keys**
   - Create separate app-specific keys
   - Set spending limits on OpenAI
   - Monitor usage regularly

3. **Facebook Token**
   - Use page tokens (not user tokens)
   - Auto-refresh tokens
   - Regenerate if compromised

4. **Cron Security**
   - Use CRON_SECRET header
   - Change secret monthly
   - Monitor function calls

## 📈 Scaling Tips

1. **Increase Posting**
   - Adjust `vercel.json` cron schedule
   - Increase batch sizes in processor.ts
   - Monitor API costs

2. **Add More Feeds**
   - Edit `src/lib/rss/feedConfig.ts`
   - Test locally first
   - Deploy and monitor

3. **Customize Templates**
   - Edit `src/lib/image/generator.ts`
   - Regenerate old images
   - Track performance

4. **Monitor Costs**
   - OpenAI: ~$1-5/month for 10-50 posts/day
   - Vercel: Free tier usually fine
   - Database: Vercel Postgres free tier good for starts

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **Facebook Docs**: https://developers.facebook.com/docs

## ✨ You're All Set!

Your KOT Tech News AI is now:
- ✅ Running on Vercel
- ✅ Fetching RSS feeds automatically
- ✅ Enhancing content with AI
- ✅ Generating images
- ✅ Posting to Facebook

Monitor the dashboard and enjoy automated tech news sharing!
