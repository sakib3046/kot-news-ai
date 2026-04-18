# KOT News AI - Setup Checklist

Complete these steps to get your system up and running!

## Phase 1: Preparation (15 minutes)

- [ ] You have Node.js 18+ installed
- [ ] You have a code editor (VS Code recommended)
- [ ] You have a GitHub account (optional, for deployment)
- [ ] You have OpenAI API key (get from https://platform.openai.com)
- [ ] You have Facebook app with page access (https://developers.facebook.com)

## Phase 2: Supabase Setup (10-15 minutes)

- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project in Supabase console
- [ ] Wait for project to initialize (5-10 minutes)
- [ ] Go to Project Settings → API
- [ ] Copy `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
- [ ] Copy `anon public key` (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] Copy `service_role secret` (SUPABASE_SERVICE_ROLE_KEY)
- [ ] Go to SQL Editor → "New Query"
- [ ] Paste contents of `supabase/migrations/init.sql`
- [ ] Click "Run" to create tables and policies
- [ ] Verify all tables appear in "Table Editor"
- [ ] Go to Authentication → Users
- [ ] Click "Add user" and create admin account with email/password

## Phase 3: Environment Configuration (5 minutes)

- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Edit `.env.local` with your credentials:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
  - [ ] `OPENAI_API_KEY` = Your OpenAI key
  - [ ] `FACEBOOK_PAGE_ACCESS_TOKEN` = Your Facebook page token
  - [ ] `FACEBOOK_PAGE_ID` = Your Facebook page ID
  - [ ] `NEXT_PUBLIC_FACEBOOK_APP_ID` = Your Facebook app ID

## Phase 4: Local Development (10 minutes)

- [ ] Open terminal in project directory
- [ ] Run `npm install` (if not done yet)
- [ ] Run `npm run dev`
- [ ] Open browser to `http://localhost:3000/admin/login`
- [ ] Login with admin email/password (from Supabase)
- [ ] You should see the Dashboard page
- [ ] View stats (should be all zeros initially)
- [ ] Click "RSS Feeds" in sidebar
- [ ] Try adding a test RSS feed
- [ ] Verify feed appears in list

## Phase 5: Testing the System (15 minutes)

- [ ] Go back to Dashboard
- [ ] Click "Refresh" button
- [ ] Feed count should now be 1
- [ ] Click "+ Add Feed" to add more feeds
  - Try these popular tech feeds:
    - Hacker News: `https://news.ycombinator.com/rss`
    - TechCrunch: `https://techcrunch.com/feed/`
    - The Verge: `https://www.theverge.com/feed/index.xml`
- [ ] Add 5-10 feeds to test
- [ ] **API Testing** (advanced):
  - [ ] Test RSS fetch: `curl -X POST http://localhost:3000/api/rss/fetch`
  - [ ] Should fetch articles from feeds
  - [ ] Check Dashboard → Recent Jobs

## Phase 6: Image Generation Setup (10 minutes)

- [ ] Check that Sharp is installed: `npm ls sharp`
- [ ] Test image generation (requires AI processing)
- [ ] Verify generated images folder: `public/generated/`
- [ ] Customize image templates (coming soon in admin UI)

## Phase 7: Facebook Integration (10 minutes)

- [ ] Verify Facebook credentials in `.env.local`
- [ ] Facebook page token should have `pages_manage_posts` permission
- [ ] Test posting manually (coming soon in admin UI)
- [ ] Monitor engagement in your Facebook page

## Phase 8: Production Deployment (20 minutes)

### Option A: Deploy to Vercel (Recommended)

- [ ] Create Vercel account at https://vercel.com
- [ ] Connect your GitHub repository to Vercel
- [ ] In Vercel Project Settings → Environment Variables:
  - [ ] Add all variables from `.env.local`
  - [ ] **Keep SUPABASE_SERVICE_ROLE_KEY secure** (only server-side)
- [ ] Deploy project
- [ ] Test login at your domain/admin/login
- [ ] Enable Cron Jobs in `vercel.json`
  - [ ] RSS fetch every 6 hours
  - [ ] Processing every 30 minutes

### Option B: Deploy Manually

- [ ] Run `npm run build`
- [ ] Deploy `.next` folder to your server
- [ ] Set environment variables in production
- [ ] Configure cron jobs on your platform

## Phase 9: Ongoing Management

### Daily Tasks
- [ ] Check dashboard for system health
- [ ] Review recent job logs for errors
- [ ] Monitor Facebook engagement
- [ ] Add new RSS feeds as needed

### Weekly Tasks
- [ ] Review analytics and engagement metrics
- [ ] Optimize image templates based on performance
- [ ] Check for feed failures and fix
- [ ] Review job logs for patterns

### Monthly Tasks
- [ ] Refresh Facebook page token (expires every 60 days)
- [ ] Update RSS feeds based on relevance
- [ ] Review system performance metrics
- [ ] Backup Supabase database

## Phase 10: Optimization (Optional)

- [ ] Customize image templates with your branding
- [ ] Configure posting schedule
- [ ] Set up email notifications for job failures
- [ ] Add custom categories for articles
- [ ] Implement A/B testing for content
- [ ] Add webhooks for real-time data

## 🆘 Troubleshooting Checklist

### Can't Login
- [ ] Verify `.env.local` has correct Supabase URL and keys
- [ ] Check that admin user exists in Supabase Auth
- [ ] Restart dev server after changing `.env.local`
- [ ] Clear browser cache and cookies
- [ ] Check browser console for error messages

### No Data Appears
- [ ] Verify database migration ran (check tables exist)
- [ ] Test API endpoint: `curl http://localhost:3000/api/rss/fetch -X POST`
- [ ] Check Supabase dashboard for data
- [ ] Review browser console for JavaScript errors
- [ ] Check network tab in DevTools

### Cron Jobs Not Running
- [ ] Verify `vercel.json` has cron configuration
- [ ] Check Vercel project has cron functions enabled
- [ ] Review Vercel logs for job execution
- [ ] Check that API routes return 200 status

### Image Generation Fails
- [ ] Verify Sharp is installed: `npm install sharp`
- [ ] Check that image template exists and is active
- [ ] Verify OpenAI key is valid and has credits
- [ ] Check `/public/generated/` folder permissions

### Facebook Posting Fails
- [ ] Verify page token hasn't expired (refresh every 60 days)
- [ ] Check token has `pages_manage_posts` permission
- [ ] Verify page ID is correct
- [ ] Test in Facebook Graph API Explorer

## ✅ Success Indicators

You've successfully set up the system when:

- [ ] Login page works with your admin account
- [ ] Dashboard shows 0 feeds/articles initially
- [ ] Can add and edit RSS feeds
- [ ] Added feeds appear in dashboard
- [ ] Job logs show executed jobs
- [ ] No errors in browser console
- [ ] No errors in server logs

## 📚 Next Resources

1. **[SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Detailed Supabase configuration
2. **[ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md)** - How to use each admin page
3. **[COMPLETION.md](./docs/COMPLETION.md)** - Project status and next steps
4. **[README_SUPABASE.md](./README_SUPABASE.md)** - Quick reference

## 💬 Need Help?

1. Check the relevant documentation file
2. Review "Troubleshooting" section in ADMIN_GUIDE.md
3. Check browser DevTools console for error messages
4. Review Supabase logs and metrics
5. Check Vercel deployment logs

---

**Estimated Total Time**: 1.5 - 2 hours for full setup

Once complete, the system will automatically:
- Fetch articles from your RSS feeds
- Enhance them with AI
- Generate beautiful images
- Post to Facebook
- Track engagement

**Happy automating!** 🚀
