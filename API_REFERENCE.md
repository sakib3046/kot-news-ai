# API Reference - KOT Tech News AI

Complete API documentation for all endpoints and utilities.

## Base URL

```
Development: http://localhost:3000
Production: https://your-app.vercel.app
```

---

## 🔌 REST API Endpoints

### RSS Feed Management

#### GET `/api/rss/fetch`
Get current RSS and article statistics.

**Response:**
```json
{
  "status": "ok",
  "endpoint": "/api/rss/fetch",
  "totalArticles": 1250,
  "processedArticles": 845,
  "postedArticles": 420,
  "bySource": [
    {
      "source": "Hacker News",
      "_count": 150
    },
    {
      "source": "TechCrunch",
      "_count": 120
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### POST `/api/rss/fetch`
Manually trigger RSS feed fetching from all configured sources.

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "result": {
    "newArticles": 47,
    "sourcesCount": 15,
    "statistics": [
      {
        "source": "Hacker News",
        "_count": 150
      },
      {
        "source": "TechCrunch",
        "_count": 120
      }
    ]
  },
  "timestamp": "2026-04-18T12:30:45.123Z"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (invalid CRON_SECRET)
- `500` - Server error

**Notes:**
- Fetches all 15 RSS feeds in parallel
- Deduplicates against existing articles
- Automatically initializes feeds if missing
- Takes 30-60 seconds to complete

---

### Article Processing

#### GET `/api/cron/process`
Get article processing and Facebook posting status.

**Response:**
```json
{
  "status": "ok",
  "endpoint": "/api/cron/process",
  "description": "Processes new articles and posts to Facebook"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### POST `/api/cron/process`
Manually trigger article processing, image generation, and Facebook posting.

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
Content-Type: application/json
```

**Request Body (Optional):**
```json
{
  "articlesLimit": 10,
  "postsLimit": 5
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "articlesProcessed": 10,
    "imagesGenerated": 8,
    "postsCreated": 5
  },
  "timestamp": "2026-04-18T12:30:45.123Z"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (invalid CRON_SECRET)
- `500` - Server error

**Process Flow:**
1. Fetches 10 unprocessed articles
2. Enhances each with AI (title, subtitle, hashtags)
3. Generates image for each article
4. Fetches 5 ready-to-post articles
5. Posts each to Facebook
6. Logs all activities

---

## 🎯 Dashboard UI

### GET `/dashboard`
Web interface for monitoring and manual control.

**Features:**
- Real-time statistics
- Articles breakdown by source
- Manual trigger buttons
- Auto-refresh every 30 seconds

**Displays:**
- Total articles fetched
- AI-processed percentage
- Posted to Facebook count
- Articles per RSS source table

---

## 📚 Core Libraries

### RSS Parser (`src/lib/rss/parser.ts`)

#### `fetchAndParseRSSFeed(feedUrl, feedName)`
Fetches and parses a single RSS feed.

```typescript
async function fetchAndParseRSSFeed(
  feedUrl: string,
  feedName: string
): Promise<ParsedArticle[]>
```

**Parameters:**
- `feedUrl` (string): URL of RSS feed
- `feedName` (string): Name of feed source

**Returns:**
```typescript
interface ParsedArticle {
  title: string;
  description?: string;
  link: string;
  pubDate?: string;
  image?: string;
  source: string;
  guid?: string;
}
```

**Example:**
```typescript
const articles = await fetchAndParseRSSFeed(
  'https://news.ycombinator.com/rss',
  'Hacker News'
);
```

---

#### `fetchAllTechNews()`
Fetches from all 15 configured tech news RSS feeds in parallel.

```typescript
async function fetchAllTechNews(): Promise<
  Map<string, ParsedArticle[]>
>
```

**Returns:**
A map where key is feed name and value is array of articles.

**Example:**
```typescript
const allFeeds = await fetchAllTechNews();
for (const [feedName, articles] of allFeeds) {
  console.log(`${feedName}: ${articles.length} articles`);
}
```

---

#### `deduplicateAndSaveArticles(articles)`
Deduplicates articles and saves new ones to database.

```typescript
async function deduplicateAndSaveArticles(
  articles: Map<string, ParsedArticle[]>
)
```

**Parameters:**
- `articles`: Map of feed articles

**Returns:**
Array of saved Article records

---

### AI Enhancement (`src/lib/ai/enhancement.ts`)

#### `enhanceArticleContent(title, description)`
Uses OpenAI GPT-4 to enhance article content for Facebook.

```typescript
async function enhanceArticleContent(
  originalTitle: string,
  originalDescription: string
): Promise<EnhancedContent>
```

**Parameters:**
- `originalTitle`: Original article title
- `originalDescription`: Article description/snippet

**Returns:**
```typescript
interface EnhancedContent {
  title: string;           // Max 80 chars, catchy
  subtitle: string;        // Max 150 chars, compelling
  hashtags: string[];      // 3-5 hashtags
  callToAction: string;    // "Read More →", etc
}
```

**Example:**
```typescript
const enhanced = await enhanceArticleContent(
  'OpenAI Releases GPT-5',
  'OpenAI has announced the release of GPT-5...'
);
console.log(enhanced.title);      // Catchy title
console.log(enhanced.hashtags);   // ["#ai", "#openai", ...]
```

---

### Image Generation (`src/lib/image/generator.ts`)

#### `generateNewsImage(params)`
Generates a modern news image with template and content.

```typescript
async function generateNewsImage(
  params: ImageGenerationParams
): Promise<Buffer>
```

**Parameters:**
```typescript
interface ImageGenerationParams {
  title: string;
  subtitle: string;
  imageUrl?: string;           // Optional article image
  logoUrl?: string;            // Optional logo
  primaryColor?: string;       // Background color
  secondaryColor?: string;     // Text color
  accentColor?: string;        // Accent color
}
```

**Returns:**
Buffer of PNG image (1200x630px)

**Example:**
```typescript
const imageBuffer = await generateNewsImage({
  title: "AI Breakthrough",
  subtitle: "New model surpasses human performance",
  imageUrl: "https://example.com/image.jpg",
  accentColor: "#0066cc"
});
```

---

#### `saveImageToFile(imageBuffer, filename)`
Saves generated image to `/public/generated`.

```typescript
async function saveImageToFile(
  imageBuffer: Buffer,
  filename: string
): Promise<string>
```

**Returns:**
Public URL path (e.g., `/generated/article-123-456.png`)

---

### Facebook API (`src/lib/facebook/api.ts`)

#### `facebookAPI.postToPage(params)`
Posts a photo with caption to Facebook page.

```typescript
async postToPage(params: FacebookPostParams): Promise<{
  success: boolean;
  postId?: string;
  error?: string;
}>
```

**Parameters:**
```typescript
interface FacebookPostParams {
  imageUrl: string;      // Public URL to image
  caption: string;       // Post caption/description
  link?: string;         // Optional source link
  hashtags?: string;     // Optional hashtags
}
```

**Returns:**
```typescript
{
  success: true,
  postId: "123456789_987654321"
}
```

**Example:**
```typescript
const result = await facebookAPI.postToPage({
  imageUrl: 'https://your-app.vercel.app/generated/image.png',
  caption: 'Check out this amazing tech news!',
  link: 'https://source-article.com',
  hashtags: '#tech #ai #news'
});
```

---

#### `facebookAPI.publishPost(caption, imageUrl, link)`
Publishes a feed post with link and preview.

```typescript
async publishPost(
  caption: string,
  imageUrl: string,
  link?: string
): Promise<{
  success: boolean;
  postId?: string;
  error?: string;
}>
```

---

#### `facebookAPI.getPageInsights()`
Retrieves page engagement metrics.

```typescript
async getPageInsights(): Promise<{
  reach?: number;
  engagement?: number;
  followers?: number;
}>
```

---

### Job Processing (`src/lib/jobs/processor.ts`)

#### `processNewArticlesJob()`
Main cron job handler - processes articles and posts to Facebook.

```typescript
async function processNewArticlesJob(): Promise<{
  success: boolean;
  articlesProcessed: number;
  imagesGenerated: number;
  postsCreated: number;
  error?: string;
}>
```

**Workflow:**
1. Create job log entry
2. Fetch up to 10 unprocessed articles
3. For each article:
   - Enhance with AI
   - Generate image
   - Save image to disk
4. Fetch up to 5 ready-to-post articles
5. For each article:
   - Post to Facebook
   - Log post ID
   - Mark as posted
6. Update job log with results

**Example:**
```typescript
const result = await processNewArticlesJob();
console.log(`Processed: ${result.articlesProcessed}`);
console.log(`Posted: ${result.postsCreated}`);
```

---

## 🗄️ Database Queries (Prisma)

### Get Unprocessed Articles
```typescript
const articles = await prisma.article.findMany({
  where: {
    aiEnhanced: false,
    posted: false
  },
  take: 10,
  orderBy: { createdAt: 'desc' }
});
```

### Get Posted Articles Stats
```typescript
const stats = await prisma.article.groupBy({
  by: ['source'],
  _count: true,
  where: { posted: true }
});
```

### Get Facebook Performance
```typescript
const performance = await prisma.facebookPost.groupBy({
  by: ['pageId'],
  _sum: {
    engagement: true,
    shares: true,
    comments: true,
    reactions: true
  }
});
```

### View Job History
```typescript
const jobs = await prisma.jobLog.findMany({
  orderBy: { startedAt: 'desc' },
  take: 50
});
```

---

## 🔐 Authentication

All POST endpoints require CRON_SECRET:

```bash
curl -X POST https://your-app.vercel.app/api/rss/fetch \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**How to Set:**
1. Generate random 32+ character string
2. Add to `.env.local`: `CRON_SECRET="your-secret"`
3. Add to Vercel environment variables
4. Include in requests as Bearer token

---

## 🔧 Configuration

### RSS Feed Configuration (`feedConfig.ts`)

```typescript
export const techRSSFeeds = [
  {
    name: "Feed Name",
    url: "https://example.com/rss",
    category: "tech",
    priority: 8,  // 1-10 scale
  }
];
```

### Image Template Customization

Edit `src/lib/image/generator.ts` `createTextOverlay()` function:

```typescript
// Change colors
<circle cx="40" cy="40" r="35" fill="${accentColor}" />

// Modify text
<text font-size="52" font-weight="bold">
  ${escapeXml(displayTitle)}
</text>
```

### OpenAI Prompt Customization

Edit `src/lib/ai/enhancement.ts` - modify the prompt in `enhanceArticleContent()`:

```typescript
const prompt = `You are a social media expert...
// Customize instructions here
`;
```

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid params) |
| 401 | Unauthorized (invalid CRON_SECRET) |
| 404 | Not found |
| 500 | Server error |

---

## ⏱️ Rate Limits

- **OpenAI**: Automatic within SDK (handles retries)
- **Facebook**: 200 requests per hour per endpoint
- **RSS Feeds**: 1 second delay between feeds
- **Database**: Vercel Postgres plan limits

---

## 🚀 Performance Tips

1. **Batch Operations**: Process multiple articles at once
2. **Caching**: Consider caching RSS feeds locally
3. **Parallel Execution**: Use Promise.all() for concurrent tasks
4. **Database Indexes**: Already configured in schema
5. **Image Optimization**: Sharp handles efficiently

---

## 📝 Example Workflows

### Manual RSS Fetch
```bash
curl -X POST https://your-app.vercel.app/api/rss/fetch \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json"
```

### Check Status
```bash
curl https://your-app.vercel.app/api/rss/fetch
```

### Trigger Processing
```bash
curl -X POST https://your-app.vercel.app/api/cron/process \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Monitor Database
```bash
npx prisma studio
```

---

For more information:
- See **DEPLOYMENT.md** for setup
- See **ARCHITECTURE.md** for system design
- See **PROJECT_SUMMARY.md** for overview
