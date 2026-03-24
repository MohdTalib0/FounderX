-- Idempotent grants for growth tables (013). Safe if already merged into 005 on fresh installs.
-- Apply this on projects where 005 ran before tool_uses / waitlist / referrals existed.
--
-- Paddle columns on profiles (015) use existing grants on public.profiles (005).
-- subscription_events grants: see 016 (must run after create table).

grant insert                         on table public.tool_uses   to anon, authenticated;
grant select, insert, update         on table public.tool_uses   to authenticated;

grant insert                         on table public.waitlist    to anon, authenticated;

grant select, insert, update, delete on table public.referrals   to authenticated;
