# Pre-Launch Checklist - KOT Tech News AI

Complete this checklist before launching your automated tech news page.

## ✅ Pre-Setup

- [ ] **Hardware & Tools**
  - [ ] Computer with Node.js 18+ installed
  - [ ] Git installed and configured
  - [ ] GitHub account created
  - [ ] Code editor (VS Code recommended)

- [ ] **Accounts Created**
  - [ ] OpenAI account (https://openai.com)
  - [ ] Facebook account with Page admin access
  - [ ] Vercel account (https://vercel.com)
  - [ ] PostgreSQL account (Vercel Postgres or self-hosted)

---

## ✅ API Keys & Credentials

### OpenAI Setup
- [ ] Go to https://platform.openai.com/api/keys
- [ ] Create new API key
- [ ] Name: "KOT Tech News AI"
- [ ] Copy and save key
- [ ] Store in: `OPENAI_API_KEY`

### Facebook Setup
- [ ] Go to https://developers.facebook.com/apps
- [ ] Create new app (type: Business)
- [ ] Save: `FACEBOOK_APP_ID`
- [ ] Save: `FACEBOOK_APP_SECRET`
- [ ] Add "Pages" product
- [ ] Create/select Facebook Page
- [ ] Save: `FACEBOOK_PAGE_ID`
- [ ] Generate page access token
- [ ] Save: `FACEBOOK_PAGE_ACCESS_TOKEN`
- [ ] Test token with Graph Explorer

### Database Setup
- [ ] [ ] Option A: Create Vercel Postgres database
  - [ ] Go to Vercel dashboard → Storage
  - [ ] Create Postgres database
  - [ ] Save connection string
  - [ ] Save: `DATABASE_URL`
- [ ] [ ] Option B: Self-hosted PostgreSQL
  - [ ] Install PostgreSQL locally or get connection string
  - [ ] Create database: `kot_news_ai`
  - [ ] Save: `DATABASE_URL`

---

## ✅ Local Development Setup

### Repository Setup
- [ ] Clone/create project repository
- [ ] Initialize git repository
- [ ] Connect to GitHub
- [ ] Create `.gitignore` (done)

### Environment Configuration
- [ ] Create `.env.local` file
- [ ] Add `DATABASE_URL`
- [ ] Add `OPENAI_API_KEY`
- [ ] Add `FACEBOOK_PAGE_ACCESS_TOKEN`
- [ ] Add `FACEBOOK_PAGE_ID`
- [ ] Add `FACEBOOK_APP_ID`
- [ ] Add `FACEBOOK_APP_SECRET`
- [ ] Generate and add `CRON_SECRET` (32+ chars)
- [ ] Verify NO `.env.local` is committed to git

### Dependencies
- [ ] Run `npm install`
- [ ] Verify no errors in output
- [ ] Check `package.json` has all required packages

### Database Initialization
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify tables created in database
- [ ] Open `npx prisma studio` and verify schema

### Local Testing
- [ ] Run `npm run build` - should complete without errors
- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:3000/dashboard`
- [ ] Click "Fetch RSS Feeds" button - should work
- [ ] Click "Process & Post" button - should work
- [ ] Check `/api/rss/fetch` endpoint
- [ ] Check `/api/cron/process` endpoint

### Code Quality
- [ ] Run `npm run lint`
- [ ] Fix any eslint errors
- [ ] TypeScript compiles without errors
- [ ] Review code for hardcoded secrets (should be none)

---

## ✅ GitHub & Version Control

- [ ] Create GitHub repository
- [ ] Add `.gitignore` entries:
  - [ ] `.env.local`
  - [ ] `node_modules/`
  - [ ] `.next/`
  - [ ] `dist/`
  - [ ] `public/generated/`
- [ ] Initial commit: "Initial commit: KOT Tech News AI"
- [ ] Push to GitHub: `git push origin main`
- [ ] Verify repository is public (for Vercel integration)

---

## ✅ Vercel Deployment

### Create Vercel Project
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "New Project"
- [ ] Import from Git (select GitHub repo)
- [ ] Select your repository
- [ ] Click "Import"

### Configure Environment Variables in Vercel
- [ ] Go to Project Settings → Environment Variables
- [ ] Add `DATABASE_URL`
- [ ] Add `OPENAI_API_KEY`
- [ ] Add `FACEBOOK_PAGE_ACCESS_TOKEN`
- [ ] Add `FACEBOOK_PAGE_ID`
- [ ] Add `FACEBOOK_APP_ID`
- [ ] Add `FACEBOOK_APP_SECRET`
- [ ] Add `CRON_SECRET`
- [ ] Set all variables for Production environment
- [ ] Save variables

### Deploy
- [ ] Click "Deploy" button
- [ ] Wait for deployment to complete
- [ ] Verify "✓ Deployed successfully"
- [ ] Copy deployment URL
- [ ] Set `VERCEL_URL` in Vercel (e.g., your-app.vercel.app)

### Verify Deployment
- [ ] Visit your deployed app: `https://your-app.vercel.app`
- [ ] Check dashboard: `https://your-app.vercel.app/dashboard`
- [ ] Test `/api/rss/fetch` endpoint
- [ ] Check Vercel function logs (should have no errors)

---

## ✅ Cron Jobs Configuration

- [ ] Verify `vercel.json` exists in project root
- [ ] Check cron schedule configuration:
  - [ ] RSS Fetch: `0 */6 * * *` (every 6 hours)
  - [ ] Article Process: `*/30 * * * *` (every 30 minutes)
- [ ] Deploy cron configuration: `git push origin main`
- [ ] Verify cron jobs appear in Vercel dashboard
  - [ ] Project → Crons
  - [ ] Should show 2 cron jobs configured

---

## ✅ Facebook Page Setup

- [ ] Go to your Facebook Page
- [ ] Click "Settings" → "Basic Information"
- [ ] Verify Page ID matches `FACEBOOK_PAGE_ID`
- [ ] Go to "Settings" → "Roles"
- [ ] Add Vercel app as authorized app (if needed)
- [ ] Test posting manually to ensure permissions work
- [ ] Set up Page webhook (optional for advanced features)

### Test Facebook Posting
- [ ] Go to your Vercel app `/dashboard`
- [ ] Trigger manual processing: "Process & Post"
- [ ] Check your Facebook Page
- [ ] Verify post appears with image and caption
- [ ] Test engagement (like, comment, share)

---

## ✅ Monitoring & Logging

### Set Up Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (optional)
- [ ] Configure email alerts (optional)
- [ ] Monitor OpenAI API usage dashboard
- [ ] Monitor PostgreSQL connection usage

### Check Logs
- [ ] Vercel Dashboard → Functions → Logs
- [ ] Look for any errors from first cron run
- [ ] Check database queries in Prisma logs
- [ ] Monitor OpenAI API response times

### First Automated Run
- [ ] Wait for first automatic cron job (up to 6 hours)
- [ ] Check dashboard for updated statistics
- [ ] Verify articles were fetched
- [ ] Verify images were generated
- [ ] Verify posts appeared on Facebook

---

## ✅ Post-Launch Monitoring

### First Week
- [ ] Monitor cron jobs running on schedule
- [ ] Check for any errors in logs
- [ ] Verify Facebook posts are consistent
- [ ] Track engagement metrics
- [ ] Monitor API costs (OpenAI, database)
- [ ] Check database growth (articles, posts)

### First Month
- [ ] Analyze Facebook post performance
- [ ] Identify best-performing content types
- [ ] Adjust RSS feeds if needed
- [ ] Fine-tune AI prompts if needed
- [ ] Plan customizations based on feedback
- [ ] Review and optimize costs

---

## ✅ Customization Options

- [ ] Consider custom image template colors
- [ ] Evaluate different AI prompts
- [ ] Review RSS feed selection
- [ ] Adjust posting frequency if needed
- [ ] Set up Instagram integration (future)
- [ ] Configure custom domain (optional)

---

## ✅ Backup & Maintenance

- [ ] Set up database backups (Vercel Postgres handles this)
- [ ] Export important data regularly
- [ ] Monitor storage usage
- [ ] Clean up old generated images (optional)
- [ ] Update dependencies monthly: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`

---

## ✅ Documentation & Knowledge Transfer

- [ ] Store all API keys securely
- [ ] Document custom configurations
- [ ] Keep deployment notes updated
- [ ] Create runbook for troubleshooting
- [ ] Share access with team members (if applicable)
- [ ] Backup `.env.local` securely

---

## ✅ Security Checklist

- [ ] No hardcoded secrets in code
- [ ] All sensitive data in environment variables
- [ ] `.env.local` added to `.gitignore`
- [ ] `CRON_SECRET` is strong (32+ chars)
- [ ] Facebook token refreshed (auto-renewing)
- [ ] OpenAI API key limited to necessary permissions
- [ ] Database password is strong
- [ ] GitHub repository private (if desired)
- [ ] Vercel environment variables are protected
- [ ] No debug logs exposing sensitive data

---

## ✅ Troubleshooting Prep

### Common Issues Ready?
- [ ] Know how to check Vercel logs
- [ ] Know how to access Prisma Studio
- [ ] Have OpenAI status page bookmarked
- [ ] Have Facebook API docs bookmarked
- [ ] Know how to manually trigger cron jobs

### Help Resources Saved
- [ ] https://vercel.com/docs
- [ ] https://nextjs.org/docs
- [ ] https://www.prisma.io/docs
- [ ] https://platform.openai.com/docs
- [ ] https://developers.facebook.com/docs

---

## 🚀 Go Live Decision

- [ ] All items above checked ✓
- [ ] Local testing passed ✓
- [ ] Deployment successful ✓
- [ ] Cron jobs configured ✓
- [ ] Facebook posting verified ✓
- [ ] Monitoring set up ✓
- [ ] Documentation reviewed ✓
- [ ] Security verified ✓

**Ready to Launch?** ✨

If all items are checked:
1. ✅ Your KOT Tech News AI is fully operational
2. ✅ Automated RSS fetching is active
3. ✅ AI enhancement is running
4. ✅ Image generation is working
5. ✅ Facebook posts are being shared
6. ✅ Real-time dashboard is monitoring everything

---

## 📞 Support During Launch

### If Cron Jobs Don't Run
1. Check Vercel plan (Pro+ required)
2. Verify `vercel.json` exists
3. Check Vercel dashboard → Crons section
4. Review function logs for errors
5. Manually trigger to test: `curl -X POST https://your-app.vercel.app/api/rss/fetch`

### If Facebook Posts Fail
1. Check access token is still valid
2. Verify page ID is correct
3. Check permissions granted on app
4. Test with Graph API Explorer
5. Check Facebook API status page

### If Images Don't Generate
1. Verify Sharp library installed
2. Check disk space available
3. Check `/public/generated` folder permissions
4. Review function logs for errors
5. Check image URLs are publicly accessible

### If Articles Don't Process
1. Check database connection
2. Run `npx prisma studio` to inspect data
3. Manually trigger RSS fetch
4. Check OpenAI API quota
5. Review function execution logs

---

## 📊 Success Metrics

### First Week Targets
- [ ] At least 1 successful RSS fetch
- [ ] At least 5 articles in database
- [ ] At least 3 images generated
- [ ] At least 1 post on Facebook
- [ ] 0 critical errors in logs

### First Month Targets
- [ ] 100+ articles fetched
- [ ] 20+ posts on Facebook
- [ ] Measurable engagement (likes, comments, shares)
- [ ] API costs under budget
- [ ] Stable automated schedule

---

## 🎉 Completion

When everything is checked and verified:

✅ **KOT Tech News AI is Live and Automated!**

Your system is now:
- Fetching tech news 24/7
- Enhancing content with AI
- Generating beautiful images
- Posting to Facebook automatically
- Growing your tech news presence

Enjoy watching your automated tech news page flourish! 🚀

---

**Last Updated**: April 18, 2026
**Status**: Production Ready
**Version**: 1.0.0

---

Questions? Check:
- `DEPLOYMENT.md` - Setup instructions
- `API_REFERENCE.md` - API details
- `ARCHITECTURE.md` - System design
- `PROJECT_SUMMARY.md` - Overview
