-- ─── Beta plan ───────────────────────────────────────────────────────────────
-- During the beta period all users get unlimited access.
-- plan = 'beta' bypasses the increment_usage limit check (which only fires
-- when v_plan = 'free'). No change to increment_usage itself is needed.

-- New signups default to 'beta'
alter table profiles alter column plan set default 'beta';

-- Upgrade all existing free-tier users
update profiles set plan = 'beta' where plan = 'free';


-- ─── last_posted_at maintenance ───────────────────────────────────────────────
-- Keep profiles.last_posted_at in sync so re-engagement emails and any future
-- activity-based features have a reliable timestamp without querying generated_posts.

create or replace function update_last_posted_at()
returns trigger as $$
begin
  update public.profiles
  set    last_posted_at = now()
  where  id = new.user_id;
  return new;
end;
$$ language plpgsql security definer
   set search_path = public;

drop trigger if exists on_post_generated on generated_posts;
create trigger on_post_generated
  after insert on generated_posts
  for each row execute function update_last_posted_at();


-- ─── sent_emails grants ───────────────────────────────────────────────────────
-- send-reengagement uses the service role which bypasses RLS.
-- No authenticated-role access is needed or wanted.
-- Explicit service_role grant is implicit in Supabase, but document it:
grant select, insert on table public.sent_emails to service_role;
