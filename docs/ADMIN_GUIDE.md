# KOT News AI - Supabase Setup and Management Guide

## Quick Start

### 1. Set Up Supabase (5-10 minutes)

Follow the instructions in `docs/SUPABASE_SETUP.md` to:
- Create a Supabase project
- Get your API credentials
- Create database tables
- Set admin user credentials

### 2. Configure Environment Variables

Create or update `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxx

# Facebook Configuration
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
FACEBOOK_PAGE_ID=your_page_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id

# Optional: Admin Email (for logging)
ADMIN_EMAIL=admin@example.com
```

### 3. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000/admin/login`

### 4. Login to Admin Dashboard

- Email: The email you created in Supabase Auth
- Password: The password you set

## Admin Dashboard Features

### 📊 Dashboard
- Real-time statistics (total feeds, articles, posts)
- Recent job execution logs
- Quick action buttons for manual processing

### 📡 RSS Feeds
- Add/edit/delete RSS feed sources
- Enable/disable feeds without deletion
- Categorize feeds (Tech, AI, Web Development, etc.)
- View feed URL and status

### 📰 Articles
- Browse all fetched articles
- Filter by posted/unposted status
- View AI-enhanced titles and subtitles
- Preview generated images
- Manually edit article content before posting
- Delete articles if needed

### 🎨 Image Templates
- Manage image generation templates
- Customize colors (primary, secondary, accent)
- Set active template for image generation
- Add/remove templates

### ⏰ Schedule
- View cron job schedule
- Manually trigger RSS fetch
- Manually trigger image generation
- Manually trigger Facebook posting
- Monitor job execution status

### 📈 Analytics
- View engagement metrics by article
- Track post performance
- See top-performing content
- Export analytics data

### ⚙️ Settings
- Store API keys and credentials
- Configure image generation settings
- Manage Facebook page settings
- Set posting preferences

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Environment variables not loading
1. Make sure you're using `.env.local` (not `.env`)
2. Restart dev server after editing `.env.local`
3. Check that `NEXT_PUBLIC_` prefix is used for browser-visible variables

### Login page redirects to login infinitely
- Check that Supabase URL and anon key are correct
- Verify user exists in Supabase Auth
- Check browser console for authentication errors

### Database queries fail
- Verify Supabase migration ran successfully (`supabase/migrations/init.sql`)
- Check that RLS policies are correctly set in Supabase dashboard
- Ensure service role key has appropriate permissions

### Images not generating
- Check that Sharp is installed: `npm install sharp`
- Verify image template exists and is marked active
- Check logs for AI enhancement errors

### Facebook posting fails
- Verify `FACEBOOK_PAGE_ACCESS_TOKEN` is valid (expires after 60 days)
- Check that `FACEBOOK_PAGE_ID` is correct
- Ensure page token has `pages_manage_posts` permission

## Database Structure

### Tables

**rss_feeds**
- Stores RSS feed sources
- `is_active`: Toggle feeds on/off
- `category`: Organize by topic

**articles**
- Stores fetched articles
- `ai_enhanced`: Whether GPT-4 processed it
- `posted`: Whether shared to Facebook
- `generated_image`: Path to created image

**facebook_posts**
- Tracks published posts
- `engagement`: Total reactions
- `shares`, `comments`, `reactions`: Breakdown

**image_templates**
- Stores image generation templates
- `primary_color`, `secondary_color`, `accent_color`
- `is_active`: Use for generation

**job_logs**
- Records cron job runs
- `status`: pending/running/completed/failed
- `articles_processed`, `images_generated`, `posts_created`

**settings**
- Key-value configuration store
- Types: string, number, boolean, json

## API Endpoints (Still Available)

```
POST /api/rss/fetch
  - Fetch articles from all active RSS feeds
  - Body: { "force": true } (optional, bypass dedup)

POST /api/cron/process
  - Main processing job: enhance → generate → post
  - Body: { "limit": 10 } (optional, articles to process)
```

## Development Tips

### Accessing Database Directly

```typescript
import { supabase } from '@/lib/supabase'

// Raw queries
const { data } = await supabase
  .from('articles')
  .select('*')
  .eq('posted', false)
```

### Using Helper Functions

```typescript
import { getArticles, updateArticle } from '@/lib/db'

const { articles, total } = await getArticles({ 
  posted: false,
  limit: 10 
})
```

### Manual Data Entry

Use Supabase Studio in dashboard:
1. Go to your Supabase project
2. Click "Table Editor"
3. Insert/edit data directly
4. Changes reflect immediately in app

## Performance Optimization

### Database Indexes
All high-query columns are indexed:
- `rss_feeds(is_active)`
- `articles(posted, created_at, ai_enhanced)`
- `facebook_posts(page_id, created_at)`
- `job_logs(job_type, status)`

### Caching
Consider adding Redis for:
- Caching article metadata
- Session storage
- Rate limiting

### Batch Operations
Process articles in batches:
```typescript
const { articles } = await getArticles({ limit: 50 })
// Process in chunks of 10
```

## Backup & Recovery

### Export Data
Use Supabase CLI:
```bash
supabase db dump -f backup.sql
```

### Restore Data
```bash
supabase db restore backup.sql
```

### Manual Backup
Download from Supabase dashboard:
Settings → Backups → Download

## Security Checklist

- ✅ All environment variables are secret (not in git)
- ✅ Service role key is server-side only
- ✅ RLS policies restrict unauthorized access
- ✅ Admin routes require authentication
- ✅ No API keys exposed in client code
- ✅ HTTPS enforced in production

## Next Steps

1. **Add article management page** - Allow editing before posting
2. **Add scheduling** - Set posting times and frequency
3. **Add webhooks** - Sync Facebook metrics automatically
4. **Add email notifications** - Alert on job failures
5. **Add image preview** - Show generated images before posting
6. **Add user roles** - Support multiple admin users with permissions

## Support

For issues:
1. Check Supabase dashboard for error logs
2. Review browser console for client errors
3. Check server logs: `npm run dev` output
4. Check Supabase documentation: https://supabase.com/docs
