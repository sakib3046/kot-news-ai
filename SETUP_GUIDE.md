# KOT Tech News AI - Automated Facebook Page

An intelligent, fully-automated tech news aggregation and posting system that:
- Fetches from 15+ premium tech news RSS feeds
- Uses AI (OpenAI GPT-4) to enhance titles and create compelling captions
- Generates beautiful, modern news images with templates
- Automatically posts to your Facebook page
- Tracks engagement and analytics

## 🎯 Features

### RSS Feed Aggregation
- **15+ Tech News Feeds** including:
  - Hacker News, TechCrunch, The Verge, ArsTechnica
  - NVIDIA, OpenAI, Google AI, AWS, GitHub blogs
  - MIT Technology Review, Product Hunt, and more
- Smart deduplication to avoid duplicate posts
- Priority-based feed ranking for best content

### AI Enhancement
- **GPT-4 Powered**: Automatically creates catchy titles and engaging subtitles
- **Optimized for Facebook**: Generates hashtags and call-to-action
- **Context-Aware**: Understands tech news and creates relevant content

### Image Generation
- **Modern Template Design**: Visually attractive, professional-looking images
- **Dynamic Content**: Automatically inserts titles, subtitles, and article images
- **Branding**: Top-right logo placement and customizable colors
- **1200x630 Resolution**: Optimized for Facebook sharing

### Facebook Integration
- **Automatic Posting**: Posts enhanced content with images to your page
- **Engagement Tracking**: Monitors likes, shares, and comments
- **Direct Links**: Each post links to original source article
- **Graph API v18**: Using latest Facebook API features

### Automation & Scheduling
- **Serverless Cron Jobs**: Powered by Vercel Cron
- **RSS Fetch**: Every 6 hours (configurable)
- **Article Processing**: Every 30 minutes (configurable)
- **Dashboard**: Real-time monitoring of all operations

## 📋 Requirements

- Node.js 18+
- PostgreSQL database (Vercel Postgres recommended)
- OpenAI API key
- Facebook Page with access token

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Using Vercel Postgres (recommended):
```bash
npm install @vercel/postgres
npx prisma db push
```

Or local PostgreSQL:
```bash
createdb kot_news_ai
npx prisma migrate dev --name init
```

### 3. Create `.env.local`

```env
# Database
DATABASE_URL="postgresql://..."

# OpenAI API
OPENAI_API_KEY="sk_..."

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN="your_token"
FACEBOOK_PAGE_ID="123456"

# Security
CRON_SECRET="your-secret-key-here"

# Deployment
VERCEL_URL="your-app.vercel.app"
```

### 4. Initialize Database

```bash
npx prisma migrate dev --name init
```

### 5. Start Development

```bash
npm run dev
# Visit http://localhost:3000/dashboard
```

## 📊 Getting Facebook Access Token

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create App → Select "Business" Type
3. Add "Pages" product
4. In Settings → Basic, save your App ID & Secret
5. Go to Tools → Graph API Explorer
6. Select your page from dropdown
7. Generate access token with these permissions:
   - `pages_manage_metadata`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_read_user_content`
8. Copy the long-lived access token
9. Get your Page ID from page's URL or Graph API

## 🚢 Deploy to Vercel

### Step 1: Push to GitHub

```bash
git remote add origin https://github.com/yourusername/kot-news-ai
git push -u origin main
```

### Step 2: Create Vercel Project

```bash
npm install -g vercel
vercel
```

### Step 3: Set Environment Variables in Vercel Dashboard

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure `DATABASE_URL` uses Vercel Postgres connection string

### Step 4: Deploy

```bash
vercel --prod
```

### Step 5: Enable Cron Jobs

Cron jobs are defined in `vercel.json`:
- RSS Fetch: Every 6 hours (`0 */6 * * *`)
- Article Processing: Every 30 minutes (`*/30 * * * *`)

Jobs run automatically on Vercel Pro plan or higher.

## 📊 Database Schema

### Articles
Stores all fetched articles with AI enhancements and posting status

### FacebookPost
Tracks all posts sent to Facebook with engagement metrics

### JobLog
Complete audit trail of all cron jobs and processing

## 🔧 API Endpoints

### `/api/rss/fetch`
- **GET**: Get RSS statistics
- **POST**: Trigger manual RSS fetch

### `/api/cron/process`
- **GET**: Check processing status
- **POST**: Trigger manual article processing

### `/dashboard`
Web interface for monitoring and manual triggers

## 📈 Workflow

```
1. RSS Feed Fetch (every 6 hours)
   ↓
2. Deduplication & Storage
   ↓
3. AI Enhancement (title, subtitle, hashtags)
   ↓
4. Image Generation (template + content)
   ↓
5. Facebook Posting
   ↓
6. Engagement Tracking
```

## 🎨 Customization

### Change RSS Feeds
Edit `src/lib/rss/feedConfig.ts`:
```typescript
export const techRSSFeeds = [
  {
    name: "Your Feed",
    url: "https://example.com/feed",
    category: "tech",
    priority: 8,
  },
];
```

### Modify Image Template
Edit `src/lib/image/generator.ts` - `createTextOverlay()` function

### Adjust Posting Schedule
Update `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/rss/fetch",
      "schedule": "0 */3 * * *"  // Every 3 hours instead
    }
  ]
}
```

### AI Enhancement Settings
Edit `src/lib/ai/enhancement.ts` - modify OpenAI prompts

## 🔐 Security

- ✅ Environment variables for all secrets
- ✅ CRON_SECRET authentication on endpoints
- ✅ Facebook token never exposed
- ✅ OpenAI key server-side only
- ✅ No hardcoded credentials

## 📊 Monitoring

### Dashboard (`/dashboard`)
- Total articles fetched
- AI-processed count
- Posted to Facebook count
- Articles per source
- One-click action buttons

### Vercel Logs
Check function logs in Vercel dashboard → Functions

### Database Studio
```bash
npx prisma studio
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Unauthorized" on API calls | Check CRON_SECRET in .env.local |
| "Failed to fetch RSS feeds" | Verify feed URLs, check internet |
| "Image generation failed" | Ensure Sharp dependencies installed |
| "No active RSS feeds found" | Run POST `/api/rss/fetch` to initialize |
| Facebook posting fails | Verify access token, page ID, permissions |
| Database connection error | Check DATABASE_URL format |

## 📝 Project Structure

```
kot-news-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── rss/fetch/          # RSS fetching endpoint
│   │   │   └── cron/process/       # Processing endpoint
│   │   ├── dashboard/              # Monitoring UI
│   │   └── page.tsx
│   └── lib/
│       ├── rss/                    # RSS parsing & config
│       ├── ai/                     # OpenAI enhancement
│       ├── image/                  # Image generation
│       ├── facebook/               # Facebook API
│       ├── jobs/                   # Cron job handlers
│       └── prisma.ts               # Database client
├── prisma/
│   └── schema.prisma               # Database schema
├── public/
│   └── generated/                  # Generated images
├── vercel.json                     # Cron configuration
└── .env.local                      # Environment variables
```

## 🚀 Performance & Scaling

- **Max Articles per Run**: 10 fetches, 5 posts (configurable)
- **Image Generation**: 1.2s per image (~30s for 5 images)
- **AI Enhancement**: 0.5s per article (parallel possible)
- **Total Job Time**: ~2-3 minutes for full cycle

## 📈 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure Facebook credentials
3. ✅ Monitor first automated posts
4. ✅ Adjust RSS feeds based on audience
5. ✅ Customize image templates
6. ✅ Track engagement metrics

## 💡 Pro Tips

- Test with small batches first
- Monitor OpenAI API usage (cost ~$1-5/month)
- Keep RSS feed list focused (avoid duplicates)
- Customize image colors to match brand
- Use Prisma Studio to inspect data
- Check Vercel logs for debugging

## 📜 License

MIT

---

**Built with ❤️ | Powered by Next.js, OpenAI, and Vercel**
