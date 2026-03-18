-- ─── Email notification preference ───────────────────────────────────────────
-- Allows users to opt out of re-engagement emails from Settings → Account.
-- send-reengagement filters on email_notifications = true before sending.

alter table profiles
  add column if not exists email_notifications boolean not null default true;
