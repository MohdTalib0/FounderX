-- Atomic usage check-and-increment.
-- Replaces the read→check→write pattern across 3 Edge Functions.
-- Uses FOR UPDATE to prevent race conditions from concurrent requests.
--
-- p_field: 'posts' | 'comments' | 'rewrites'
-- p_limit: the free-plan cap for that field
--
-- Returns:
--   { allowed: true,  count: <new_value> }              — incremented, proceed
--   { allowed: false, count: <current>, limit: <cap> }  — blocked, return 402
--
-- Security: user identity is derived from auth.uid() — callers cannot
-- impersonate other users by passing a different UUID.

-- Drop the old 3-argument signature if it exists from a previous apply
drop function if exists increment_usage(uuid, text, int);

create or replace function increment_usage(
  p_field  text,
  p_limit  int
)
returns jsonb
language plpgsql
security definer
set search_path = public        -- prevent search_path injection on SECURITY DEFINER
as $$
declare
  v_user_id           uuid;
  v_plan              text;
  v_onboarded         boolean;
  v_posts             int;
  v_comments          int;
  v_rewrites          int;
  v_reset_at          timestamptz;
  v_current           int;
  v_new               int;
begin
  -- Derive caller identity — cannot be spoofed by the client
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  -- Lock the row so concurrent requests queue up rather than racing
  select plan, onboarded,
         posts_this_month, comments_this_month, rewrites_this_month,
         usage_reset_at
  into   v_plan, v_onboarded,
         v_posts, v_comments, v_rewrites,
         v_reset_at
  from   profiles
  where  id = v_user_id
  for update;

  if not found then
    raise exception 'profile not found';
  end if;

  -- Reset all counters if we have rolled into a new calendar month
  if date_trunc('month', v_reset_at) < date_trunc('month', now()) then
    update profiles
    set    posts_this_month    = 0,
           comments_this_month = 0,
           rewrites_this_month = 0,
           usage_reset_at      = date_trunc('month', now())
    where  id = v_user_id;
    v_posts    := 0;
    v_comments := 0;
    v_rewrites := 0;
  end if;

  -- Resolve the current counter for the requested field
  -- (cannot use RAISE inside a CASE expression — use IF/ELSIF)
  if p_field = 'posts' then
    v_current := v_posts;
  elsif p_field = 'comments' then
    v_current := v_comments;
  elsif p_field = 'rewrites' then
    v_current := v_rewrites;
  else
    raise exception 'unknown field: %', p_field;
  end if;

  -- Free-plan limit check.
  -- Onboarding welcome post (onboarded = false, field = posts) is always allowed
  -- and never incremented — the check is skipped entirely.
  if v_plan = 'free'
     and not (p_field = 'posts' and not v_onboarded)
  then
    if v_current >= p_limit then
      return jsonb_build_object(
        'allowed', false,
        'count',   v_current,
        'limit',   p_limit
      );
    end if;
  end if;

  -- Atomically increment — skip for onboarding welcome post
  if not (p_field = 'posts' and not v_onboarded) then
    if p_field = 'posts' then
      update profiles
      set posts_this_month = posts_this_month + 1
      where id = v_user_id
      returning posts_this_month into v_new;
    elsif p_field = 'comments' then
      update profiles
      set comments_this_month = comments_this_month + 1
      where id = v_user_id
      returning comments_this_month into v_new;
    elsif p_field = 'rewrites' then
      update profiles
      set rewrites_this_month = rewrites_this_month + 1
      where id = v_user_id
      returning rewrites_this_month into v_new;
    end if;
  else
    v_new := v_current; -- unchanged for onboarding welcome post
  end if;

  return jsonb_build_object('allowed', true, 'count', v_new);
end;
$$;

grant execute on function increment_usage(text, int) to authenticated;
