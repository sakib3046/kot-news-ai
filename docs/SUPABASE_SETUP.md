# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter project details:
   - **Name**: `kot-news-ai` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
4. Click "Create new project"
5. Wait for the project to initialize (5-10 minutes)

## Step 2: Get Your Connection Credentials

After your project is created:

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (under "API")
   - **anon public key** (under "Project API keys")
   - **service_role secret** (under "Project API keys") - keep this secret!

## Step 3: Set Environment Variables

Update your `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Existing variables (keep these)
OPENAI_API_KEY=your_openai_key
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_token
FACEBOOK_PAGE_ID=your_page_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id
```

## Step 4: Run Database Schema

1. In Supabase Dashboard, go to SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/migrations/init.sql`
4. Paste into the SQL editor
5. Click "Run"
6. Check for any errors

Alternatively, use the SQL file directly:
- Supabase CLI: `supabase db push`

## Step 5: Enable Authentication

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable "Email" provider
3. Configure email settings if needed

## Step 6: Create Admin User

Option A - Via Supabase Dashboard:
1. Go to Authentication → Users
2. Click "Add user"
3. Enter your admin email
4. Set a password
5. Click "Create user"

Option B - Via Code:
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'admin@example.com',
  password: 'strong-password-here'
})
```

## Step 7: Verify Tables Created

1. In Supabase Dashboard, go to Table Editor
2. You should see:
   - `rss_feeds`
   - `articles`
   - `facebook_posts`
   - `image_templates`
   - `job_logs`
   - `settings`

## Step 8: Optional - Install Supabase CLI

For local development and migrations:

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-id>
```

## Troubleshooting

### "Missing environment variables" error
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- These must start with `NEXT_PUBLIC_` to be available in browser code
- Restart dev server after updating `.env.local`

### Tables not appearing
- Check SQL Editor for error messages
- Ensure all SQL commands completed successfully
- Refresh the page if needed

### Authentication errors
- Verify the email in auth is confirmed
- Check RLS (Row Level Security) policies in Table Editor
- Ensure `auth.role() = 'authenticated'` is set correctly

### API responses are empty
- Check that tables have data
- Verify RLS policies allow reads for your user
- Use Supabase Dashboard → Table Editor to manually add test data

## Next Steps

1. Run `npm run dev` to start the development server
2. Navigate to `http://localhost:3000/admin/login`
3. Sign in with your admin credentials
4. Access the management dashboard

## Database Schema Overview

### rss_feeds
Stores RSS feed configurations
- `id`: Unique identifier
- `name`: Display name (e.g., "Hacker News")
- `url`: RSS feed URL
- `category`: Content category
- `is_active`: Enable/disable feed
- `created_at, updated_at`: Timestamps

### articles
Stores articles fetched from RSS feeds
- `id`: Unique identifier
- `feed_id`: Reference to rss_feeds
- `title, description`: Original content
- `original_link`: URL to original article
- `ai_title, ai_subtitle`: AI-enhanced content
- `ai_enhanced`: Whether enhancement is complete
- `posted`: Whether posted to Facebook
- `facebook_post_id`: Reference if posted
- `generated_image`: Path to generated image
- `guid`: RSS unique identifier

### facebook_posts
Tracks posts sent to Facebook
- `id`: Unique identifier
- `article_id`: Reference to articles
- `facebook_post_id`: Facebook's post ID
- `page_id`: Facebook page ID
- `caption`: Post text
- `image_url`: Shared image
- `engagement, shares, comments, reactions`: Metrics

### image_templates
Stores image template configurations
- `id`: Unique identifier
- `name`: Template name
- `template_path`: Path to template file
- `colors`: Primary, secondary, accent colors
- `is_active`: Enable/disable template

### job_logs
Records cron job execution
- `id`: Unique identifier
- `job_type`: Type of job
- `status`: pending, running, completed, failed
- `articles_processed`: Count of processed articles
- `images_generated`: Count of generated images
- `posts_created`: Count of created posts
- `error`: Error message if failed

### settings
Stores configuration settings
- `id`: Unique identifier
- `key`: Setting name
- `value`: Setting value
- `setting_type`: Data type (string, number, boolean, json)
