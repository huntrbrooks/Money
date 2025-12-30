# Supabase Setup Instructions

This document outlines the Supabase configuration required for admin persistence.

## Required Environment Variables

Set these in your production hosting environment (Vercel, etc.):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-strong-random-secret
```

## Database Schema

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Main site configuration table
CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Version history for rollback support
CREATE TABLE IF NOT EXISTS site_config_versions (
  id SERIAL PRIMARY KEY,
  config_id INTEGER NOT NULL DEFAULT 1,
  version BIGINT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  data JSONB NOT NULL,
  CONSTRAINT fk_config FOREIGN KEY (config_id) REFERENCES site_config(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_site_config_versions_config_id ON site_config_versions(config_id);
CREATE INDEX IF NOT EXISTS idx_site_config_versions_updated_at ON site_config_versions(updated_at DESC);

-- Content items (MDX for posts and videos)
CREATE TABLE IF NOT EXISTS content_items (
  type TEXT NOT NULL CHECK (type IN ('posts', 'videos')),
  slug TEXT NOT NULL,
  mdx TEXT NOT NULL,
  PRIMARY KEY (type, slug)
);

CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
```

## Storage Bucket

1. Go to Storage in Supabase dashboard
2. Create a new bucket named: `site-assets`
3. Set it to **Private** (not public)
4. The API will handle serving via `/api/assets/[...path]` route

## Initial Data

After creating the tables, you may want to seed the `site_config` table with your current `data/site.json` content:

```sql
INSERT INTO site_config (id, data, updated_at)
VALUES (1, '{}'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;
```

Then use the Admin dashboard to upload your current config, or manually import from `data/site.json`.

## Verification

After setup, verify:
1. Visit `/api/admin/storage-status` (while logged into admin) - should return `{"ok": true, "storage": "supabase", "bucket": "site-assets"}`
2. Make a small change in Admin → Save → Refresh → confirm it persists
3. Upload a test PDF/image → confirm it's accessible via `/api/assets/...`

