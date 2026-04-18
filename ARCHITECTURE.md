# Architecture Overview - KOT Tech News AI

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     AUTOMATED WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│  RSS Feeds   │ (15+ Tech News Sources)
│  - Hacker    │
│  - TechCrunch│
│  - The Verge │
│  - etc.      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  RSS Parser (src/lib/rss/)   │
│  - Fetch all feeds           │
│  - Parse XML/RSS             │
│  - Extract article metadata  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Deduplication & Storage     │
│  - Check for duplicates      │
│  - Store in PostgreSQL       │
│  - Article model             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  AI Enhancement (AI module)  │
│  - Generate title (80 chars) │
│  - Create subtitle (150 chr) │
│  - Generate hashtags         │
│  - Add call-to-action        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Image Generation            │
│  - Apply template design     │
│  - Insert article image      │
│  - Add logo (top-right)      │
│  - Generate 1200x630 image   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Facebook API Integration    │
│  - Create post with image    │
│  - Add enhanced caption      │
│  - Include source link       │
│  - Post to page              │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Analytics & Tracking        │
│  - Store post ID             │
│  - Track engagement          │
│  - Log job execution         │
└──────────────────────────────┘
```

## Component Architecture

### 1. **Backend - Serverless Functions** (Vercel)

```
src/app/api/
├── rss/
│   └── fetch/route.ts
│       - GET: Fetch RSS stats
│       - POST: Trigger RSS fetch
│
├── cron/
│   └── process/route.ts
│       - GET: Processing status
│       - POST: Trigger processing
│
└── webhook/
    └── facebook/route.ts (optional)
```

### 2. **Core Libraries**

#### `src/lib/rss/` - RSS Aggregation
- `feedConfig.ts` - 15+ RSS feed URLs and metadata
- `parser.ts` - RSS parsing, deduplication, storage

```typescript
// Exports
- fetchAndParseRSSFeed()
- fetchAllTechNews()
- deduplicateAndSaveArticles()
- initializeRSSFeeds()
```

#### `src/lib/ai/` - AI Enhancement
- `enhancement.ts` - OpenAI GPT-4 integration

```typescript
// Exports
- enhanceArticleContent() -> { title, subtitle, hashtags, cta }
- generateImageCaption()
- summarizeContent()
```

#### `src/lib/image/` - Image Generation
- `generator.ts` - Image template creation

```typescript
// Exports
- generateNewsImage() -> Buffer
- saveImageToFile() -> string (file path)
```

#### `src/lib/facebook/` - Social Media
- `api.ts` - Facebook Graph API wrapper

```typescript
// Exports
- facebookAPI.postToPage()
- facebookAPI.publishPost()
- facebookAPI.getPageInsights()
- facebookAPI.uploadMediaToFacebook()
```

#### `src/lib/jobs/` - Job Processing
- `processor.ts` - Main cron job handler

```typescript
// Exports
- processNewArticlesJob() -> {success, stats}
```

### 3. **Database Layer** (PostgreSQL + Prisma)

```
prisma/schema.prisma
├── RSSFeed
│   ├── id, name, url, category
│   ├── isActive
│   └── articles (relation)
│
├── Article
│   ├── id, title, description
│   ├── originalLink, imageUrl
│   ├── aiTitle, aiSubtitle
│   ├── generatedImage
│   ├── posted, facebookPostId
│   └── feedId (FK)
│
├── FacebookPost
│   ├── id, facebookPostId
│   ├── caption, imageUrl
│   ├── engagement metrics
│   └── articleId
│
├── ImageTemplate
│   ├── id, name, templatePath
│   ├── colors, logo
│   └── isActive
│
└── JobLog
    ├── jobType, status
    ├── articlesProcessed
    ├── imagesGenerated
    ├── postsCreated
    └── timestamps
```

### 4. **Frontend - Dashboard** (React)

```
src/app/dashboard/page.tsx
├── Real-time Statistics
│   ├── Total articles
│   ├── AI-processed count
│   ├── Posted to Facebook count
│   └── Progress percentages
│
├── Source Breakdown
│   └── Articles per RSS feed
│
└── Control Buttons
    ├── Fetch RSS Feeds (manual)
    └── Process & Post (manual)
```

## Data Flow Diagram

### 1. RSS Fetch Flow
```
Cron Trigger (0 */6 * * *)
    ↓
GET /api/rss/fetch (POST)
    ↓
fetchAllTechNews()
    ├─ Fetch 15+ feeds (parallel)
    ├─ Parse XML/RSS
    └─ Return articles map
    ↓
deduplicateAndSaveArticles()
    ├─ Check existing articles
    ├─ Filter duplicates
    └─ Save new articles
    ↓
Response: { newArticles, sourcesCount }
    ↓
Database: Article table updated
```

### 2. Processing Flow
```
Cron Trigger (*/30 * * * *)
    ↓
POST /api/cron/process
    ↓
processNewArticlesJob()
    ├─ Fetch unprocessed articles (10)
    │
    ├─ For each article:
    │   ├─ enhanceArticleContent() [AI]
    │   ├─ generateNewsImage() [Image]
    │   └─ saveImageToFile()
    │
    ├─ Fetch ready articles (5)
    │
    └─ For each ready article:
        ├─ publishPost() [Facebook]
        ├─ Create FacebookPost record
        └─ Update Article.posted = true
    ↓
Response: { success, articlesProcessed, imagesGenerated, postsCreated }
    ↓
Database: Article, FacebookPost, JobLog tables updated
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+ (Vercel Functions)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **API**: RESTful (JSON)

### Database
- **Type**: PostgreSQL
- **ORM**: Prisma v4
- **Connection**: Connection pooling
- **Hosting**: Vercel Postgres (recommended)

### AI & APIs
- **AI**: OpenAI GPT-4o-mini
- **Social**: Facebook Graph API v18
- **RSS**: rss-parser library
- **HTTP**: axios + node-fetch

### Image Processing
- **Library**: Sharp (image resizing)
- **Format**: SVG overlays + PNG output
- **Dimensions**: 1200x630px (Facebook optimized)
- **Quality**: 95% compression

### Deployment
- **Hosting**: Vercel (serverless)
- **CI/CD**: Automatic (Git push)
- **Cron**: Vercel Cron (built-in)
- **Monitoring**: Vercel Analytics

## Performance Metrics

### Request Latency
- RSS Fetch: 30-60 seconds (15 feeds)
- AI Enhancement: 0.5-1s per article
- Image Generation: 1-2s per image
- Facebook Posting: 0.5-1s per post

### Throughput
- **RSS Fetch**: 15 feeds in parallel
- **Article Processing**: 10 articles batch
- **Facebook Posts**: 5 per cycle (30 min)

### Daily Output
- **At 6-hour intervals**: 4 RSS fetches/day
- **At 30-minute intervals**: 48 processing jobs/day
- **Realistic posts**: 5-20 posts/day (depends on content)

### Cost Estimation
| Component | Usage | Cost/Month |
|-----------|-------|-----------|
| Vercel | Serverless + Cron | Free-$150 |
| OpenAI | 5000 requests | $1-5 |
| Database | Vercel Postgres | Free-$15 |
| Facebook | API calls | Free |
| **Total** | | **$1-170** |

## Security Architecture

### Authentication & Authorization
- `CRON_SECRET`: Bearer token for endpoint protection
- Facebook: OAuth 2.0 token
- OpenAI: API key (server-side only)

### Data Protection
- Environment variables: Never committed
- Database: Encrypted at rest
- API Keys: Rotated regularly
- No logging of secrets

### Rate Limiting
- Built into OpenAI SDK
- Vercel function timeouts (300s max)
- RSS feed request delays (1s between)
- Facebook API rate limits respected

## Scaling Strategy

### Horizontal Scaling
1. Increase Vercel plan (more concurrent functions)
2. Increase batch sizes in processor.ts
3. Adjust cron schedule for more frequent runs

### Vertical Scaling
1. Optimize image generation (caching)
2. Parallelize API calls
3. Cache RSS feeds locally
4. Batch database operations

### Monitoring & Debugging
1. Vercel Function Logs
2. Prisma Studio for database
3. OpenAI usage dashboard
4. Facebook Insights analytics

## Future Enhancements

1. **Multi-Language Support**
   - Translate titles to multiple languages
   - Post to regional Facebook pages

2. **Advanced Image Templates**
   - A/B testing different designs
   - Dynamic color schemes based on category
   - Video generation (Runway.ai)

3. **Instagram Integration**
   - Auto-resize images for Instagram
   - Carousel posts for multiple articles
   - Reels with AI voiceover

4. **Analytics Dashboard**
   - Engagement metrics
   - Best performing content
   - Optimal posting times
   - Trending topics

5. **Community Features**
   - Comments moderation
   - Auto-replies
   - Sentiment analysis

6. **Advanced AI**
   - Custom fine-tuned model
   - Image generation (DALL-E)
   - Video summarization
   - Automatic categorization

## Deployment Architecture

```
GitHub Repository
    ↓
Git Push (main branch)
    ↓
Vercel Webhook
    ↓
Build Process
    ├─ npm install
    ├─ npm run build
    └─ Tests
    ↓
Deployment
    ├─ Generate Prisma Client
    ├─ Set environment variables
    ├─ Deploy functions
    └─ Update cron jobs
    ↓
Production
    ├─ Serverless functions running
    ├─ Cron jobs scheduled
    ├─ Database connected
    └─ APIs available
```

## Monitoring & Logging

### Application Logs
- Function execution logs (Vercel)
- API request/response logs
- Error tracking

### Database Logs
- Query execution times
- Connection pool status
- Migration history

### Business Metrics
- Articles processed per day
- Posts created per day
- Average engagement per post
- API costs

---

For implementation details, see:
- `src/lib/` - Core libraries
- `src/app/api/` - API endpoints
- `prisma/schema.prisma` - Database schema
- `DEPLOYMENT.md` - Deployment instructions
