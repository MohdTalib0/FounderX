-- ─── Email send log ──────────────────────────────────────────────────────────
-- Prevents sending the same re-engagement email twice to the same user.
-- Service role only — no public access.

create table sent_emails (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  email_type text not null,  -- '24h' | '72h' | 'weekly'
  sent_at    timestamptz not null default now()
);

create index idx_sent_emails_lookup on sent_emails(user_id, email_type, sent_at desc);

alter table sent_emails enable row level security;
-- No RLS policies — service role bypasses RLS, which is what we want.
-- Regular users should never read/write this table.


-- ─── Scheduling ───────────────────────────────────────────────────────────────
--
-- Option A — pg_cron  (Supabase Pro; enable pg_cron + pg_net in the dashboard)
-- Replace {{PROJECT_URL}} with your Supabase project URL
-- Replace {{CRON_SECRET}} with the value you set in edge function secrets
--
--   SELECT cron.schedule(
--     'reengagement-24h', '0 * * * *',
--     $$ SELECT net.http_post(
--         url     := '{{PROJECT_URL}}/functions/v1/send-reengagement',
--         headers := '{"Content-Type":"application/json","x-cron-secret":"{{CRON_SECRET}}"}'::jsonb,
--         body    := '{"type":"24h"}'::jsonb) $$);
--
--   SELECT cron.schedule(
--     'reengagement-72h', '30 * * * *',
--     $$ SELECT net.http_post(
--         url     := '{{PROJECT_URL}}/functions/v1/send-reengagement',
--         headers := '{"Content-Type":"application/json","x-cron-secret":"{{CRON_SECRET}}"}'::jsonb,
--         body    := '{"type":"72h"}'::jsonb) $$);
--
--   SELECT cron.schedule(
--     'reengagement-weekly', '0 8 * * 1',
--     $$ SELECT net.http_post(
--         url     := '{{PROJECT_URL}}/functions/v1/send-reengagement',
--         headers := '{"Content-Type":"application/json","x-cron-secret":"{{CRON_SECRET}}"}'::jsonb,
--         body    := '{"type":"weekly"}'::jsonb) $$);
--
--
-- Option B — cron-job.org  (free, works on Supabase Free tier)
-- Create 3 jobs at https://cron-job.org with these settings:
--
--   Job 1 "reengagement-24h"
--     URL:     {{PROJECT_URL}}/functions/v1/send-reengagement
--     Schedule: every hour (0 * * * *)
--     Method:  POST   Body: {"type":"24h"}
--     Header:  x-cron-secret: {{CRON_SECRET}}
--
--   Job 2 "reengagement-72h"
--     URL:     {{PROJECT_URL}}/functions/v1/send-reengagement
--     Schedule: every hour (30 * * * *)
--     Method:  POST   Body: {"type":"72h"}
--     Header:  x-cron-secret: {{CRON_SECRET}}
--
--   Job 3 "reengagement-weekly"
--     URL:     {{PROJECT_URL}}/functions/v1/send-reengagement
--     Schedule: every Monday at 08:00 UTC  (0 8 * * 1)
--     Method:  POST   Body: {"type":"weekly"}
--     Header:  x-cron-secret: {{CRON_SECRET}}
