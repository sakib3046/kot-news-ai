-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RSSFeed table
CREATE TABLE IF NOT EXISTS rss_feeds (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'tech',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rss_feeds_is_active ON rss_feeds(is_active);

-- Article table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  feed_id TEXT NOT NULL REFERENCES rss_feeds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  original_link TEXT NOT NULL UNIQUE,
  image_url TEXT,
  pub_date TIMESTAMP WITH TIME ZONE,
  guid TEXT,
  source TEXT,
  ai_title TEXT,
  ai_subtitle TEXT,
  ai_enhanced BOOLEAN DEFAULT false,
  posted BOOLEAN DEFAULT false,
  facebook_post_id TEXT,
  generated_image TEXT,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(feed_id, guid)
);

CREATE INDEX IF NOT EXISTS idx_articles_posted ON articles(posted);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_articles_ai_enhanced ON articles(ai_enhanced);
CREATE INDEX IF NOT EXISTS idx_articles_feed_id ON articles(feed_id);

-- FacebookPost table
CREATE TABLE IF NOT EXISTS facebook_posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  facebook_post_id TEXT NOT NULL UNIQUE,
  page_id TEXT NOT NULL,
  caption TEXT NOT NULL,
  image_url TEXT,
  engagement INT DEFAULT 0,
  shares INT DEFAULT 0,
  comments INT DEFAULT 0,
  reactions INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_facebook_posts_page_id ON facebook_posts(page_id);
CREATE INDEX IF NOT EXISTS idx_facebook_posts_created_at ON facebook_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_facebook_posts_article_id ON facebook_posts(article_id);

-- ImageTemplate table
CREATE TABLE IF NOT EXISTS image_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  template_path TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1a1a1a',
  secondary_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#0066cc',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_image_templates_is_active ON image_templates(is_active);

-- JobLog table
CREATE TABLE IF NOT EXISTS job_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  job_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  message TEXT,
  articles_processed INT DEFAULT 0,
  images_generated INT DEFAULT 0,
  posts_created INT DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_job_logs_job_type_status ON job_logs(job_type, status);
CREATE INDEX IF NOT EXISTS idx_job_logs_created_at ON job_logs(started_at);

-- Settings table (for admin settings)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  setting_type TEXT DEFAULT 'string', -- string, number, boolean, json
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE facebook_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin only)
CREATE POLICY "Enable all operations for authenticated users" ON rss_feeds
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON articles
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON facebook_posts
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON image_templates
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON job_logs
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON settings
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
