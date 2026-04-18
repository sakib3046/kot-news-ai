# KOT Tech News AI - Automated Facebook Page System

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-blue?logo=vercel)](https://vercel.com)
[![Node.js](https://img.shields.io/badge/Node-18+-green?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql)](https://www.postgresql.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green?logo=openai)](https://openai.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Fully-automated tech news aggregation and Facebook page management system powered by AI.**

## 🎯 Features

### Intelligent Automation
- **15+ RSS Feeds**: Hacker News, TechCrunch, The Verge, ArsTechnica, NVIDIA, OpenAI, Google AI, and more
- **AI Enhancement**: OpenAI GPT-4 creates catchy titles and engaging subtitles
- **Image Generation**: Modern 1200x630px templates with dynamic content
- **Facebook Integration**: Automatic posting with engagement tracking
- **Zero Manual Work**: Fully automated 24/7

### Smart Processing
✨ **Deduplication**: Prevents posting the same story twice
🤖 **AI Optimization**: Content optimized for Facebook engagement
📸 **Image Templates**: Modern, professional, attractive designs
⏱️ **Scheduled Automation**: Cron jobs every 6 hours for RSS, every 30 min for posting
📊 **Real-time Dashboard**: Monitor everything from one place

---

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| **Tech Feeds** | 15+ premium sources |
| **Articles/Day** | 100-200 potential |
| **Posts/Day** | 5-20 (depending on content) |
| **Processing Time** | ~2-3 minutes per cycle |
| **Monthly Cost** | ~$1-25 |
| **Setup Time** | ~30 minutes |

---

## 🚀 Quick Start

### 1. Prerequisites
```bash
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Facebook Page + Access Token
```

### 2. Install & Setup (5 minutes)
```bash
# Clone and install
npm install

# Initialize database
npx prisma migrate dev --name init

# Create .env.local with credentials
# See DEPLOYMENT.md for detailed setup
```

### 3. Deploy to Vercel
```bash
# Push to GitHub
git push origin main

# Deploy to Vercel (automatic)
# Or: vercel --prod

# Set environment variables in Vercel dashboard
# Done! Cron jobs start automatically
```

### 4. Monitor
Visit your dashboard: `https://your-app.vercel.app/dashboard`

---

## 📚 Documentation

### Getting Started
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Quick start guide with step-by-step instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete Vercel deployment with Facebook setup
- **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** - Pre-launch verification checklist

### Technical Details
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and component overview
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API documentation
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Feature summary and project details

### Configuration
- **[.env.local](./.env.local)** - Environment variables template
- **[vercel.json](./vercel.json)** - Cron job scheduling
- **[prisma/schema.prisma](./prisma/schema.prisma)** - Database schema

---

## 🏗️ Architecture

```
RSS Feeds (15+)
    ↓
RSS Parser → Deduplication → Storage
    ↓
AI Enhancement (GPT-4) → Title + Subtitle + Hashtags
    ↓
Image Generation → Template + Content → Save to CDN
    ↓
Facebook API → Post with Image + Caption + Link
    ↓
Engagement Tracking & Analytics
```

### Technology Stack
- **Backend**: Next.js 14 + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **AI**: OpenAI GPT-4o-mini
- **Images**: Sharp + SVG overlays
- **Social**: Facebook Graph API v18
- **Hosting**: Vercel Serverless
- **Scheduling**: Vercel Cron Jobs

---

## 📋 What's Included

### Core Modules
```
src/lib/
├── rss/          → RSS feed parsing & aggregation
├── ai/           → OpenAI GPT-4 enhancement
├── image/        → Image template generation
├── facebook/     → Facebook Graph API wrapper
└── jobs/         → Cron job processing

src/app/
├── api/
│   ├── rss/fetch/      → RSS fetching endpoint
│   └── cron/process/   → Article processing endpoint
└── dashboard/          → Real-time monitoring UI
```

### Key Features
- ✅ 15+ pre-configured tech news feeds
- ✅ Intelligent deduplication
- ✅ AI-powered content enhancement
- ✅ Automatic image generation with modern templates
- ✅ Facebook page integration
- ✅ Serverless cron job scheduling
- ✅ Real-time dashboard monitoring
- ✅ Complete audit logs

---

## 🔧 Configuration

### Environment Variables Required
```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk_..."
FACEBOOK_PAGE_ACCESS_TOKEN="EAAC..."
FACEBOOK_PAGE_ID="123456"
FACEBOOK_APP_ID="987654"
FACEBOOK_APP_SECRET="abc123..."
CRON_SECRET="your-secret-key"
VERCEL_URL="your-app.vercel.app"
```

### Customization
- **RSS Feeds**: Edit `src/lib/rss/feedConfig.ts`
- **Image Template**: Edit `src/lib/image/generator.ts`
- **AI Prompts**: Edit `src/lib/ai/enhancement.ts`
- **Posting Schedule**: Edit `vercel.json` cron times

---

## 📊 Monitoring

### Dashboard
Real-time statistics and control at `/dashboard`:
- Total articles fetched
- AI-processed count
- Posted to Facebook count
- Articles by source breakdown
- Manual trigger buttons

### APIs
```bash
# Get statistics
curl https://your-app.vercel.app/api/rss/fetch

# Get processing status
curl https://your-app.vercel.app/api/cron/process

# Manually trigger RSS fetch
curl -X POST https://your-app.vercel.app/api/rss/fetch \
  -H "Authorization: Bearer $CRON_SECRET"

# Manually trigger processing
curl -X POST https://your-app.vercel.app/api/cron/process \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## 💰 Cost Analysis

| Component | Cost | Notes |
|-----------|------|-------|
| Vercel | Free-$20/mo | Serverless hosting |
| OpenAI | $1-5/mo | ~5-20 posts/day |
| Database | Free-$15/mo | Vercel Postgres free tier good |
| Facebook | Free | Graph API is free |
| **Total** | **$1-40/mo** | Mostly dependent on usage |

---

## 🔐 Security

✅ **No Hardcoded Secrets** - All credentials in environment variables
✅ **Server-Side Only** - API keys never exposed to client
✅ **Cron Security** - Bearer token authentication on endpoints
✅ **Database Protection** - Connection strings encrypted
✅ **Token Management** - Facebook tokens auto-renewing
✅ **No Logging Secrets** - Debug logs never contain sensitive data

---

## 🚀 Getting Started

### Step 1: Prepare Credentials
1. Create Facebook App and get access token (see DEPLOYMENT.md)
2. Get OpenAI API key
3. Set up PostgreSQL database

### Step 2: Local Development
```bash
git clone <repo>
npm install
npx prisma migrate dev --name init
# Edit .env.local with credentials
npm run dev
# Visit http://localhost:3000/dashboard
```

### Step 3: Deploy
```bash
git push origin main
# Vercel automatically deploys
# Set environment variables in Vercel dashboard
# Cron jobs start automatically
```

### Step 4: Monitor
Visit your dashboard and watch the magic happen! ✨

---

## 📈 Performance

### Processing Time
- RSS Fetch: 30-60 seconds (all 15 feeds)
- AI Enhancement: 0.5-1s per article
- Image Generation: 1-2s per image
- Facebook Posting: 0.5-1s per post

### Daily Output
- RSS fetches: 4 (every 6 hours)
- Processing cycles: 48 (every 30 minutes)
- Articles processed: 20-50/day
- Posts to Facebook: 5-20/day

---

## 🛠️ Development

### Project Structure
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npx prisma studio   # Open database UI
npx prisma migrate  # Manage migrations
```

### Testing
```bash
# Test RSS fetch
curl http://localhost:3000/api/rss/fetch

# Test processing
curl -X POST http://localhost:3000/api/cron/process

# Test database
npx prisma studio
```

---

## 🐛 Troubleshooting

### Common Issues
| Issue | Solution |
|-------|----------|
| Cron jobs not running | Check Vercel Pro plan, verify vercel.json |
| Facebook posting fails | Check access token, page ID, permissions |
| RSS fetch fails | Verify feed URLs, check internet |
| Images don't generate | Ensure Sharp installed, check disk space |
| Database errors | Check DATABASE_URL format, test connection |

See **DEPLOYMENT.md** for detailed troubleshooting guide.

---

## 📞 Support

- **Documentation**: See files in project root (SETUP_GUIDE.md, DEPLOYMENT.md, etc.)
- **API Docs**: See API_REFERENCE.md
- **Architecture**: See ARCHITECTURE.md
- **FAQ**: See LAUNCH_CHECKLIST.md troubleshooting section

---

## 📝 License

MIT License - feel free to use this project for any purpose!

---

## 🎯 Roadmap

### v1.0 (Current)
✅ RSS feed aggregation
✅ AI content enhancement
✅ Image generation
✅ Facebook integration
✅ Automated scheduling

### v1.1 (Planned)
🔄 Instagram integration
🔄 Advanced analytics
🔄 Custom templates UI
🔄 Admin panel

### v2.0 (Future)
🔄 Video generation
🔄 Multi-language support
🔄 Community engagement
🔄 Sentiment analysis

---

## 🙌 Contributing

Contributions welcome! Areas we'd love help with:
- Additional RSS feed sources
- New image templates
- Enhanced AI prompts
- Analytics features
- Documentation improvements

---

## 💡 Tips

1. **Start Small**: Test with a single RSS feed first
2. **Monitor Costs**: Watch OpenAI usage dashboard
3. **Customize**: Adjust image colors to match brand
4. **Track Metrics**: Monitor engagement and optimize content
5. **Regular Updates**: Check for dependency updates monthly

---

## 🎉 Success Stories

After deployment, you'll have:
- ✅ A fully automated tech news page
- ✅ Consistent daily posts (no manual work)
- ✅ AI-enhanced content (better engagement)
- ✅ Professional-looking images
- ✅ Growing audience with zero effort

---

## 📞 Quick Links

- [Setup Guide](./SETUP_GUIDE.md)
- [Deployment Instructions](./DEPLOYMENT.md)
- [API Reference](./API_REFERENCE.md)
- [Architecture Details](./ARCHITECTURE.md)
- [Pre-Launch Checklist](./LAUNCH_CHECKLIST.md)
- [Project Summary](./PROJECT_SUMMARY.md)

---

**Ready to automate your tech news page? Start with [SETUP_GUIDE.md](./SETUP_GUIDE.md)! 🚀**

---

Made with ❤️ | Powered by Next.js, OpenAI, Prisma & Vercel
