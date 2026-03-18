-- Add missing usage tracking columns to profiles
alter table profiles
  add column if not exists rewrites_this_month int not null default 0,
  add column if not exists usage_reset_at timestamptz not null default date_trunc('month', now());

-- Limits reference (enforced in Edge Functions):
-- free plan: 12 posts, 15 comments, 5 rewrites per month
-- pro plan: unlimited
