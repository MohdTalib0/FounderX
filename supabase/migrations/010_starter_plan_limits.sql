-- Migration 010: Add starter plan limits to increment_usage RPC
--
-- Previously the RPC took p_limit from the caller (always the free limit).
-- Now limits are computed internally based on plan — no caller can pass the wrong cap.
--
-- Plan limits:
--   free:    posts=12,  comments=15,  rewrites=5
--   starter: posts=80,  comments=100, rewrites=40
--   pro:     unlimited

-- Drop old 2-arg signature
drop function if exists increment_usage(text, int);

create or replace function increment_usage(
  p_field  text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id   uuid;
  v_plan      text;
  v_onboarded boolean;
  v_posts     int;
  v_comments  int;
  v_rewrites  int;
  v_reset_at  timestamptz;
  v_current   int;
  v_new       int;
  v_limit     int;   -- null = unlimited
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

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

  -- Reset counters on new calendar month
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

  -- Resolve current counter
  if p_field = 'posts' then
    v_current := v_posts;
  elsif p_field = 'comments' then
    v_current := v_comments;
  elsif p_field = 'rewrites' then
    v_current := v_rewrites;
  else
    raise exception 'unknown field: %', p_field;
  end if;

  -- Resolve plan limit (null = unlimited)
  if v_plan = 'free' then
    v_limit := case p_field
      when 'posts'    then 12
      when 'comments' then 15
      when 'rewrites' then 5
    end;
  elsif v_plan = 'starter' then
    v_limit := case p_field
      when 'posts'    then 80
      when 'comments' then 100
      when 'rewrites' then 40
    end;
  else
    v_limit := null; -- pro: unlimited
  end if;

  -- Gate check (skip for the onboarding welcome post)
  if v_limit is not null
     and not (p_field = 'posts' and not v_onboarded)
  then
    if v_current >= v_limit then
      return jsonb_build_object(
        'allowed', false,
        'count',   v_current,
        'limit',   v_limit
      );
    end if;
  end if;

  -- Increment (skip for onboarding welcome post)
  if not (p_field = 'posts' and not v_onboarded) then
    if p_field = 'posts' then
      update profiles set posts_this_month = posts_this_month + 1
      where id = v_user_id returning posts_this_month into v_new;
    elsif p_field = 'comments' then
      update profiles set comments_this_month = comments_this_month + 1
      where id = v_user_id returning comments_this_month into v_new;
    elsif p_field = 'rewrites' then
      update profiles set rewrites_this_month = rewrites_this_month + 1
      where id = v_user_id returning rewrites_this_month into v_new;
    end if;
  else
    v_new := v_current;
  end if;

  return jsonb_build_object('allowed', true, 'count', v_new, 'limit', v_limit);
end;
$$;

grant execute on function increment_usage(text) to authenticated;
